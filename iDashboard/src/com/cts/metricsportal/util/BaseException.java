package com.cts.metricsportal.util;

public class BaseException extends RuntimeException{

	
	/**
	 * overloaded method to handle msg and exception
	 *
	 * @param msg
	 * @param ex
	 */
	public BaseException(String msg, Throwable ex) {
		super(msg, ex);
		

	}

	
	/**
	 * overloaded method to handle only msg
	 *
	 * @param msg
	 * @param ex
	 */
	public BaseException(String msg) {
		super(msg);
		
	}
}
