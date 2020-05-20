package com.cts.metricsportal.util;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

public class logj4config {
	static {
		init();
	}
	private final static Logger logger = Logger.getLogger(logj4config.class);

	public static void main(String[] args) {
		logger.debug("My Debug Log");
		logger.info("My Info Log");
		logger.warn("My Warn Log");
		logger.error("My error log");
		logger.fatal("My fatal log");
	}

	/** * method to init log4j configurations */
	private static void init() {
		PropertyConfigurator.configure("properties/log4j.properties");
	}
}
