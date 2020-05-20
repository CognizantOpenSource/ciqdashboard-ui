package com.cognizant.qbot.cors;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.sun.jersey.spi.container.ContainerRequest;
import com.sun.jersey.spi.container.ContainerResponse;
import com.sun.jersey.spi.container.ContainerResponseFilter;

public class CORSResponseFilter implements ContainerResponseFilter {

    public ContainerResponse filter(ContainerRequest req, ContainerResponse ContResponse) {
    	 
        ResponseBuilder crunchifyResponseBuilder = Response.fromResponse(ContResponse.getResponse());
        
        // *(allow from all servers) OR http://crunchify.com/ OR http://example.com/
        crunchifyResponseBuilder.header("Access-Control-Allow-Origin", "*")
        
        // As a part of the response to a request, which HTTP methods can be used during the actual request.
        .header("Access-Control-Allow-Methods", "API, CRUNCHIFYGET, GET, POST, PUT, UPDATE, OPTIONS")
        
        // How long the results of a request can be cached in a result cache.
        .header("Access-Control-Max-Age", "151200")
        
        // As part of the response to a request, which HTTP headers can be used during the actual request.
        .header("Access-Control-Allow-Headers", "x-requested-with,Content-Type");
 
        String RequestHeader = req.getHeaderValue("Access-Control-Request-Headers");
 
        if (null != RequestHeader && !RequestHeader.equals(null)) {
            crunchifyResponseBuilder.header("Access-Control-Allow-Headers", RequestHeader);
        }
 
        ContResponse.setResponse(crunchifyResponseBuilder.build());
        return ContResponse;
    }
}