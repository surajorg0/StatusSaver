package org.surajorg.statussaver;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.graphics.Bitmap;
import android.media.ThumbnailUtils;
import android.util.Base64;
import android.util.Log;
import androidx.core.content.FileProvider;

import androidx.activity.result.ActivityResult;
import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;

@CapacitorPlugin(name = "Saf")
public class SafPlugin extends Plugin {

    private static final String PREF_NAME = "SafPluginPrefs";
    private static final String KEY_URI_WA = "saved_tree_uri_wa";
    private static final String KEY_URI_WAB = "saved_tree_uri_wab";

    @PluginMethod
    public void requestAccess(PluginCall call) {
        String type = call.getString("type", "wa"); // "wa" or "wab"
        String key = "wab".equals(type) ? KEY_URI_WAB : KEY_URI_WA;
        
        String savedUri = getSavedUri(key);
        if (savedUri != null && checkUriPermission(Uri.parse(savedUri))) {
            JSObject ret = new JSObject();
            ret.put("granted", true);
            call.resolve(ret);
            return;
        }

        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String folder = "wab".equals(type) ? 
                "primary%3AAndroid%2Fmedia%2Fcom.whatsapp.w4b%2FWhatsApp%20Business%2FMedia%2F.Statuses" :
                "primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";
            Uri uri = Uri.parse("content://com.android.externalstorage.documents/document/" + folder);
            intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, uri);
        }
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        JSObject data = new JSObject();
        data.put("key", key);
        saveCall(call);
        startActivityForResult(call, intent, "documentTreeResult");
    }

    @ActivityCallback
    private void documentTreeResult(PluginCall call, ActivityResult result) {
        if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
            Uri treeUri = result.getData().getData();
            if (treeUri != null) {
                getContext().getContentResolver().takePersistableUriPermission(
                        treeUri, 
                        Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                );
                // We need to know which key this was for. 
                // Since requestAccess defaults to "wa" if not specified, 
                // and the user likely clicks them one by one.
                // For simplicity, we'll check the initial folder name in the URI to guess the type
                String key = treeUri.toString().contains("w4b") ? KEY_URI_WAB : KEY_URI_WA;
                saveUri(key, treeUri.toString());
                JSObject ret = new JSObject();
                ret.put("granted", true);
                call.resolve(ret);
                return;
            }
        }
        call.reject("Permission denied");
    }

    @PluginMethod
    public void listStatuses(PluginCall call) {
        String type = call.getString("type", "wa");
        String key = "wab".equals(type) ? KEY_URI_WAB : KEY_URI_WA;
        String savedUri = getSavedUri(key);
        if (savedUri == null) {
            call.reject("No access granted. Call requestAccess first.");
            return;
        }
        Uri treeUri = Uri.parse(savedUri);
        if (!checkUriPermission(treeUri)) {
            call.reject("Permission lost. Call requestAccess again.");
            return;
        }

        DocumentFile documentFile = DocumentFile.fromTreeUri(getContext(), treeUri);
        if (documentFile == null || !documentFile.exists() || !documentFile.isDirectory()) {
            call.reject("Directory not found or invalid.");
            return;
        }

        JSArray filesArray = new JSArray();
        for (DocumentFile file : documentFile.listFiles()) {
            if (file.isFile()) {
                String name = file.getName();
                if (name != null && !name.equals(".nomedia")) {
                    JSObject fileObj = new JSObject();
                    fileObj.put("name", name);
                    fileObj.put("uri", file.getUri().toString());
                    fileObj.put("size", file.length());
                    fileObj.put("lastModified", file.lastModified());
                    fileObj.put("type", getMimeType(name));
                    filesArray.put(fileObj);
                }
            }
        }
        JSObject ret = new JSObject();
        ret.put("files", filesArray);
        call.resolve(ret);
    }

    @PluginMethod
    public void copyToCache(PluginCall call) {
        String uriStr = call.getString("uri");
        String name = call.getString("name");
        if (uriStr == null || name == null) {
            call.reject("Uri and name are required");
            return;
        }
        
        Uri uri = Uri.parse(uriStr);
        File cacheDir = new File(getContext().getCacheDir(), "status-cache");
        if (!cacheDir.exists()) {
            cacheDir.mkdirs();
        }
        
        File cachedFile = new File(cacheDir, name);
        if (cachedFile.exists() && cachedFile.length() > 0) {
            // Already cached
            JSObject ret = new JSObject();
            ret.put("path", cachedFile.getAbsolutePath());
            call.resolve(ret);
            return;
        }

        try (InputStream is = getContext().getContentResolver().openInputStream(uri);
             OutputStream os = new FileOutputStream(cachedFile)) {
            
            byte[] buffer = new byte[8192];
            int len;
            while ((len = is.read(buffer)) != -1) {
                os.write(buffer, 0, len);
            }
            
            JSObject ret = new JSObject();
            ret.put("path", cachedFile.getAbsolutePath());

            // NEW: Generate video thumbnail
            if (name.endsWith(".mp4")) {
                File thumbFile = new File(cacheDir, name + ".thumb.jpg");
                if (!thumbFile.exists()) {
                    try {
                        Bitmap bitmap = ThumbnailUtils.createVideoThumbnail(cachedFile.getAbsolutePath(), MediaStore.Video.Thumbnails.MINI_KIND);
                        if (bitmap != null) {
                            try (FileOutputStream thumbOs = new FileOutputStream(thumbFile)) {
                                bitmap.compress(Bitmap.CompressFormat.JPEG, 70, thumbOs);
                            }
                        }
                    } catch (Exception e) {
                        Log.e("Saf", "Failed to create thumb", e);
                    }
                }
                if (thumbFile.exists()) {
                    ret.put("thumbnail", thumbFile.getAbsolutePath());
                }
            }

            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Could not copy file", e);
        }
    }

    @PluginMethod
    public void shareFile(PluginCall call) {
        String path = call.getString("path");
        String type = call.getString("type", "image/*");
        if (path == null) {
            call.reject("Path is required");
            return;
        }

        File file = new File(path);
        if (!file.exists()) {
            call.reject("File does not exist");
            return;
        }

        Uri contentUri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", file);
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType(type);
        intent.putExtra(Intent.EXTRA_STREAM, contentUri);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        
        Intent chooser = Intent.createChooser(intent, "Share via");
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(chooser);
        
        call.resolve();
    }

    @PluginMethod
    public void saveToGallery(PluginCall call) {
        String uriStr = call.getString("uri");
        String name = call.getString("name");
        if (uriStr == null || name == null) {
            call.reject("Uri and name are required");
            return;
        }

        File targetDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM), "StatusSaver");
        if (!targetDir.exists()) {
            targetDir.mkdirs();
        }

        File targetFile = new File(targetDir, name);
        Uri uri = Uri.parse(uriStr);
        
        try (InputStream in = "file".equals(uri.getScheme()) ? 
                new FileInputStream(new File(uri.getPath())) : 
                getContext().getContentResolver().openInputStream(uri);
             OutputStream out = new FileOutputStream(targetFile)) {
            
            byte[] buffer = new byte[8192];
            int len;
            while ((len = in.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
            
            // Trigger media scanner
            Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            mediaScanIntent.setData(Uri.fromFile(targetFile));
            getContext().sendBroadcast(mediaScanIntent);

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("path", targetFile.getAbsolutePath());
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to save file", e);
        }
    }

    private String getMimeType(String name) {
        if (name.endsWith(".mp4")) return "video/mp4";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".gif")) return "image/gif";
        return "application/octet-stream";
    }

    private void saveUri(String key, String uri) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(key, uri).apply();
    }

    private String getSavedUri(String key) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return prefs.getString(key, null);
    }

    private boolean checkUriPermission(Uri uri) {
        try {
            return getContext().getContentResolver().getPersistedUriPermissions()
                    .stream()
                    .anyMatch(p -> p.getUri().equals(uri) && p.isReadPermission());
        } catch (Exception e) {
            return false;
        }
    }
}
