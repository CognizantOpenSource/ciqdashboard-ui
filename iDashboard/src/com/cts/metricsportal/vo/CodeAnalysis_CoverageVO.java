package com.cts.metricsportal.vo;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ca_detail")
public class CodeAnalysis_CoverageVO {
	
	private String coverage;
	private String line_coverage;
	private String lines_to_cover;
	private String skipped_tests;
	private String test_error;
	private String test_failures;
	private String tests;
	private String test_success_density;
	private String test_execution_time;
	private String uncovered_lines;
	
	
	private String date;
	private String lines;
	private String new_lines_to_cover;

	
	public String getNew_lines_to_cover() {
		return new_lines_to_cover;
	}
	public void setNew_lines_to_cover(String new_lines_to_cover) {
		this.new_lines_to_cover = new_lines_to_cover;
	}
	public String getLines() {
		return lines;
	}
	public void setLines(String lines) {
		this.lines = lines;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getCoverage() {
		return coverage;
	}
	public void setCoverage(String coverage) {
		this.coverage = coverage;
	}
	public String getLine_coverage() {
		return line_coverage;
	}
	public void setLine_coverage(String line_coverage) {
		this.line_coverage = line_coverage;
	}
	public String getLines_to_cover() {
		return lines_to_cover;
	}
	public void setLines_to_cover(String lines_to_cover) {
		this.lines_to_cover = lines_to_cover;
	}
	public String getSkipped_tests() {
		return skipped_tests;
	}
	public void setSkipped_tests(String skipped_tests) {
		this.skipped_tests = skipped_tests;
	}
	public String getTest_error() {
		return test_error;
	}
	public void setTest_error(String test_error) {
		this.test_error = test_error;
	}
	public String getTest_failures() {
		return test_failures;
	}
	public void setTest_failures(String test_failures) {
		this.test_failures = test_failures;
	}
	public String getTests() {
		return tests;
	}
	public void setTests(String tests) {
		this.tests = tests;
	}
	public String getTest_success_density() {
		return test_success_density;
	}
	public void setTest_success_density(String test_success_density) {
		this.test_success_density = test_success_density;
	}
	public String getTest_execution_time() {
		return test_execution_time;
	}
	public void setTest_execution_time(String test_execution_time) {
		this.test_execution_time = test_execution_time;
	}
	public String getUncovered_lines() {
		return uncovered_lines;
	}
	public void setUncovered_lines(String uncovered_lines) {
		this.uncovered_lines = uncovered_lines;
	}
	
}
