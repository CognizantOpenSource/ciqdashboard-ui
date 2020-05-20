package com.cts.metricsportal.bo;

import java.io.IOException;
import java.text.ParseException;

import javax.swing.text.BadLocationException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.cts.metricsportal.util.BaseException;

public interface MetricSummary {
	public String getMetricValue(int customTemplateMetricId, String authString, String dashboardName, String domain,
			String project, String vardtfrom, String vardtto, String rollingPeriod, long levelId) throws JsonParseException, JsonMappingException, NumberFormatException, BaseException, IOException, BadLocationException, ParseException;
}
