/*
 * Copyright Information © 2013, Cognizant Technology Solutions, All rights
 * reserved.
 * 
 * This document is protected by copyright. No part of this document may be
 * reproduced in any form by any means without prior written authorization of
 * Cognizant Technology Solutions and its licensors, if any.
 */

package com.cts.metricsportal.controllers;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import javax.swing.text.BadLocationException;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.cognizant.idashboard.iAuthentication;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.PropertyManager;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.MongoException;
import com.mongodb.ServerAddress;


public class BaseMongoOperation {

	// private static Logger logger = Logger.getLogger(BaseDao.class);

	public static String DB_NAME = null;

	public static String MONGO_HOST = null;
	public static int MONGO_PORT = 0;
	public static String PARAMETER_NAME = null;

	private static MongoOperations mongoOperation = null;
	private  static MongoClient mongoClient = null;
	

	public static String getDbName() throws Exception {

		if (DB_NAME == null) {
			DB_NAME = PropertyManager.getProperty("DB_NAME", "properties/mongoDBConfig.properties"); 
		}
		return DB_NAME;
	}

	public static String getMongoHost() throws Exception {
		
		if (MONGO_HOST == null) {
			try {
				MONGO_HOST = PropertyManager.getProperty("MONGO_HOST", "properties/mongoDBConfig.properties");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}  
			
		}
	return MONGO_HOST;
	}

	public static int getMongoPort() throws NumberFormatException, BaseException, BadLocationException {
		
		if (MONGO_PORT == 0) {
			try {
				MONGO_PORT = Integer.parseInt(PropertyManager.getProperty("MONGO_PORT", "properties/mongoDBConfig.properties"));
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}  

		}
		return MONGO_PORT;
	}
	
	public static MongoClient getMongoClient() {
		List<MongoCredential> credentails = new ArrayList<MongoCredential>();
		String username = "";
		String auth  = "";
		String db_name = "";
		if (mongoClient == null) {
			try {
				username = PropertyManager.getProperty("MONGO_USERNAME", "properties/mongoDBConfig.properties");
				auth  = iAuthentication.read(PropertyManager.getProperty("MONGO_AUTH", "properties/mongoDBConfig.properties"));
				db_name = getDbName();
				String is_authenticate = PropertyManager.getProperty("IS_AUTHENTICATE",
						"properties/mongoDBConfig.properties");
				credentails.add(MongoCredential.createScramSha1Credential(username, db_name, auth.toCharArray()));
				if (is_authenticate.equalsIgnoreCase("true")) {
					mongoClient = new MongoClient(new ServerAddress(getMongoHost(), getMongoPort()), credentails);

				}
			} catch (MongoException e) {
				throw new BaseException("Mongo failed");
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (BaseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return mongoClient;
	}

	public static MongoOperations getMongoOperation() throws NumberFormatException, BaseException, BadLocationException {

		if (mongoOperation == null) {
			try {
				mongoOperation = new MongoTemplate(getMongoClient(), getDbName());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return mongoOperation;
	}

	
	public static void closeMongoConnection() {
		if (mongoClient != null) {
				mongoClient.close();
		}
	}
	
	
}
