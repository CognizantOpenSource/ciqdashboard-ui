/*
 * Copyright Information  2015, Cognizant Technology Solutions, All rights
 * reserved.
 * 
 * This document is protected by copyright. No part of this document may be
 * reproduced in any form by any means without prior written authorization of
 * Cognizant Technology Solutions and its licensors, if any.
 */
package com.cognizant.qbot.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Properties;

import com.cognizant.qbot.exception.BaseException;
import com.cts.metricsportal.LicenseReader.LicenseReader;


public class PropertyManager {
	
	
	private static HashMap<String, Properties> property = new HashMap<String, Properties>();

	public static String getProperty(String key, String filepath) throws BaseException {
		String value = null;
		
		LicenseReader readFile = new LicenseReader();
		String securedFilePath = readFile.cleanString(filepath);
		
		Properties props = getProperties(securedFilePath);
		value = props.getProperty(key);

		return value;
	}
	public static Properties getProperties(String filepath) throws BaseException {
		//This method will return the property value associated with key and filepath
		Properties props = property.get(filepath);
		
		if (props == null) {
			props = new Properties();
			props = loadProperties(filepath);			
			property.put(filepath, props);
		}


		return props;
		
	}
	
	public static Properties loadPropertiesFromFile(String fileName) throws BaseException, FileNotFoundException{
		Properties propertyList = new Properties();
		FileInputStream fileStream = new FileInputStream(new File(fileName));
		try {
			propertyList.load(fileStream);
		}catch (IOException e) {
			throw new BaseException("While opening property file", e);
		}
		finally{
			try {
				fileStream.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return propertyList;
	}
	
	//This method will load the property files
	private static Properties loadProperties(String fileName) throws BaseException{
		InputStream propertiesInputStream = null;
		Properties propertyList = null;
		
		LicenseReader readFile = new LicenseReader();
		String securedFilePath = readFile.cleanString(fileName);
				
		try {
			propertiesInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(securedFilePath);
			
			propertyList = new Properties();
			propertyList.load(propertiesInputStream);
		}catch (IOException e) {
			throw new BaseException("While opening property file", e);
		}
		finally{
			try {
				propertiesInputStream.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}	
		}
		return propertyList;
	}

}
