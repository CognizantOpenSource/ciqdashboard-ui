/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cts.metricsportal.LicenseReader;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 *
 * @author 464258
 */
public class EncryptDecrypt {

    static byte[] readSmallBinaryFile(String aFileName) throws IOException {
    	
    	LicenseReader readFile = new LicenseReader();
		String securedFilePath = readFile.cleanString(aFileName);
		
        Path path = Paths.get(securedFilePath);
        return Files.readAllBytes(path);
    }

    public static String decrypt(String key, String initVector, String encrypted) {
        try {
            String encoding = "UTF-8";
            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes(encoding));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(encoding), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
            byte[] original = cipher.doFinal(Base64.getDecoder().decode(encrypted));
            return new String(original);
        } catch (Exception ex) {
          /*  Logger.getLogger(LicenseGeneratorController.class.getName()).log(Level.SEVERE, "Exception in decrypting the license file", ex);*/
        }
        return null;
    }

    public static String encrypt(String key, String initVector, String value) {
        try {
            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
            byte[] encrypted = cipher.doFinal(value.getBytes());
            System.out.println("encrypted string: " + Base64.getEncoder().encodeToString(encrypted));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }


    public SecretKeySpec getSecretKey(String filename, String algorithm) throws IOException {
        byte[] keyBytes = Files.readAllBytes(new File(filename).toPath());
        return new SecretKeySpec(keyBytes, algorithm);
    }

    public SecretKeySpec getSecretKey(byte[] keyBytes, String algorithm) throws IOException {
        return new SecretKeySpec(keyBytes, algorithm);
    }


    public PrivateKey getPrivate(String filename, String algorithm) throws Exception {
        byte[] keyBytes = Files.readAllBytes(new File(filename).toPath());
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance(algorithm);
        return kf.generatePrivate(spec);
    }

    
}
