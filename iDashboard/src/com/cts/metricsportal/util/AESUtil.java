package com.cts.metricsportal.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Random;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;
import org.springframework.util.Assert;

/*
 *Added by adhish 
 */
public class AESUtil {
	
		private final int keySize;
		private final int iterationCount;
		private final Cipher cipher;
		private final String randomString[] = { "b", "F", "M", "e", "D", "5", "7", "h", "A", "9", "7", "t", "R", "D", "T",
				"S", "m", "r", "d", "O", "4", "V", "A", "p", "g", "t", "9", "u", "n", "5", "n", "g", "2", "A", "Q", "w",
				"V", "5", "7", "i", "u", "U", "m", "3", "X", "8", "B", "B", "3", "W", "I", "P", "3", "h", "R", "I", "n",
				"9", "2", "N", "Q", "C", "I", "U", "7", "W", "o", "j", "I", "w", "m", "y", "s", "n", "G", "W", "q", "H",
				"C", "3", "Z", "A", "4", "f", "p", "2", "Q", "c", "J", "P", "N", "d", "V", "R", "h", "c", "M", "K", "k",
				"A", "b", "c", "t" };

		final private Random rng = new SecureRandom();

		public AESUtil(int keySize, int iterationCount) {
			this.keySize = keySize;
			this.iterationCount = iterationCount;
			try {
				cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			} catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
				throw fail(e);
			}
		}
		
		private String[] generateKey() {
			String[] keys = new String[2];
			String t = "";
			String n = "";
			int r = 0;
			for (r = 0; r < 10; r++) {
				int o = rng.nextInt(99);
				t += randomString[o];
				if (o > 9) {
					n += o;
				} else {
					n += ("0" + o);
				}
			}
			keys[0] = n;
			keys[1] = t;
			return keys;
		}
		

		private String generateRandomData() {
			String data = "";
			for (int r = 0; r < 16; r++) {
				int o = rng.nextInt(randomString.length);
				data += randomString[o];
			}
			return data;
		}
		
		private static String encryptString(String orginalString) {
			String encodedString = null;
			AESUtil aesUtil = new AESUtil(256, 100);
			encodedString = aesUtil.encrypt(orginalString);
			return encodedString;
		}

		private String encrypt(String originalString) {
			try {
				String[] keys = generateKey();
				String tempkey = keys[1];
				String passphrase = keys[0];

				String salt = generateRandomData();
				String iv = generateRandomData();

				SecretKey secretKey = generateEncryptKey(salt.getBytes(), tempkey);
				cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(iv.getBytes()));
				byte[] encryptedData = cipher.doFinal(originalString.getBytes());

				String finalData = enCodehex(salt.getBytes()) + ":" + enCodehex(iv.getBytes()) + ":"
						+ encodeBase64(encryptedData) + ":" + passphrase;
				return java.util.Base64.getEncoder().encodeToString(finalData.getBytes());
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}
		
		private SecretKey generateEncryptKey(byte[] salt, String passphrase) {
			try {
				SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
				KeySpec spec = new PBEKeySpec(passphrase.toCharArray(), salt, iterationCount, keySize);
				SecretKey key = new SecretKeySpec(factory.generateSecret(spec).getEncoded(), "AES");
				return key;
			} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
				return null;
			}
		}

		public static String decryptHeader(String encrypted) {
			Assert.notNull(encrypted, "Encrypted string must not null!");
			Assert.hasLength(encrypted, "Encrypted string must not empty!");
			String decHeader = null;
			encrypted = encrypted.replaceFirst("Basic" + " ", "");
			String decryptedPassword = new String(java.util.Base64.getDecoder().decode(encrypted));
			AESUtil aesUtil = new AESUtil(256, 100);

			if (decryptedPassword != null && decryptedPassword.split(":").length == 4) {
				String salt = decryptedPassword.split(":")[0];
				String iv = decryptedPassword.split(":")[1];
				String passphrase = aesUtil.getPassPhrase(decryptedPassword.split(":")[3]);
				String ciphertext = decryptedPassword.split(":")[2];
				decHeader = aesUtil.decrypt(salt, iv, passphrase, ciphertext);
			}
			decryptedPassword = null;
			return decHeader;
		}

		private String decrypt(String salt, String iv, String passphrase, String ciphertext) {
			try {
				SecretKey key = generateKey(salt, passphrase);
				byte[] decrypted = doFinal(Cipher.DECRYPT_MODE, key, iv, decodeBase64(ciphertext));
				return new String(decrypted, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				return null;
			} catch (Exception e) {
				return null;
			}
		}

		private byte[] doFinal(int encryptMode, SecretKey key, String iv, byte[] bytes) {
			try {
				cipher.init(encryptMode, key, new IvParameterSpec(hex(iv)));
				return cipher.doFinal(bytes);
			} catch (InvalidKeyException | InvalidAlgorithmParameterException | IllegalBlockSizeException
					| BadPaddingException e) {
				return null;
			}
		}

		private SecretKey generateKey(String salt, String passphrase) {
			try {
				SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
				KeySpec spec = new PBEKeySpec(passphrase.toCharArray(), hex(salt), iterationCount, keySize);
				SecretKey key = new SecretKeySpec(factory.generateSecret(spec).getEncoded(), "AES");
				return key;
			} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
				return null;
			}
		}

		private static byte[] decodeBase64(String str) {
			return Base64.decodeBase64(str);
		}

		private static String encodeBase64(byte[] str) {
			return Base64.encodeBase64String(str);
		}

		private static byte[] hex(String str) {
			try {
				return Hex.decodeHex(str.toCharArray());
			} catch (DecoderException e) {
				throw new IllegalStateException(e);
			}
		}

		private static String enCodehex(byte[] str) {
			try {
				return Hex.encodeHexString(str);
			} catch (Exception e) {
				throw new IllegalStateException(e);
			}
		}

		private IllegalStateException fail(Exception e) {
			return null;
		}

		private String getPassPhrase(String locString) {
			StringBuilder pass = new StringBuilder();
			char[] charArray = locString.toCharArray();
			for (int i = 0; i < charArray.length; i += 2) {
				int loc = Integer.parseInt(charArray[i] + "" + charArray[i + 1]);
				pass.append(randomString[loc]);
			}
			return pass.toString();
		}
}
