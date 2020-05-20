/*
 * Copyright Information © 2015, Cognizant Technology Solutions, All rights
 * reserved.
 * 
 * This document is protected by copyright. No part of this document may be
 * reproduced in any form by any means without prior written authorization of
 * Cognizant Technology Solutions and its licensors, if any.
 */
package com.cts.metricsportal.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Properties;
 
import javax.swing.text.BadLocationException;
public class PropertyManager {
	
	
	private static HashMap<String, Properties> property = new HashMap<String, Properties>();

	public static String getProperty(String key, String filepath) throws Exception{
		String value = null;
		
		Properties props = getProperties(filepath);
		value = props.getProperty(key);

		return value;
	}
	public static Properties getProperties(String filepath) throws Exception {
		//This method will return the property value associated with key and filepath
		Properties props = property.get(filepath);
		
		if (props == null) {
			props = new Properties();
			props = loadProperties(filepath);			
			property.put(filepath, props);
		}


		return props;
		
	}
	
	public static Properties loadPropertiesFromFile(String fileName) throws  Exception{
		Properties propertyList = new Properties();
		FileInputStream fileStream =  new FileInputStream(new File(fileName));
		try {
			//propertyList = new Properties();
			//fileStream = new FileInputStream(new File(fileName));
			propertyList.load(fileStream);
		}catch (IOException e) {
			throw new  Exception("While opening property file", e);
		}
		finally{
			fileStream.close();
		}
		return propertyList;
	}
	
	//This method will load the property files
	private static Properties loadProperties(String fileName) throws  Exception{
		InputStream propertiesInputStream = null;
		Properties propertyList = null;
		
		try {
			propertiesInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
			propertyList = new Properties();
			propertyList.load(propertiesInputStream);
		}catch (IOException e) {
			throw new  Exception("While opening property file", e);
		}
		finally{
			propertiesInputStream.close();	
		}
		return propertyList;
	}

}
