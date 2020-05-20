/*
 * Copyright 2011, Cognizant Technology Solutions, All rights
 * reserved.
 *
 * This document is protected by copyright. No part of this document may be
 * reproduced in any form by any means without prior written authorization of
 * Cognizant Technology Solutions and its licensors, if any.
 */
package com.cognizant.qbot.exception;

/**
 *
 * All application exceptions should inherit this
 *
 * @author 105490
 *
 */
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
