package com.cts.metricsportal.bo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.cts.metricsportal.util.IdashboardConstantsUtil;

public class DateTimeCalc {

	SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");

	private Date startDate;
	private Date endDate;
	private Date dateBefore7Days;
	
	public DateTimeCalc()
	{
		this.startDate = null;
		this.endDate = null;
		this.dateBefore7Days = null;
	}
	
	public Date getStartDate(String vardtfrom) throws ParseException
	{
		if(!vardtfrom.equalsIgnoreCase("-")){
			 startDate = formatter.parse(vardtfrom);
		}
		return startDate;	 
	}
	
	public Date getEndDate(String vardtto) throws ParseException
	{
		if(!vardtto.equalsIgnoreCase("-")){
			 endDate = formatter.parse(vardtto);
			 }
		return endDate;
	}
		
	
	
	public Date getDateForTimeperiod(String timeperiod)
	{
		if(!timeperiod.equalsIgnoreCase(IdashboardConstantsUtil.UNDEFINED) && !timeperiod.equalsIgnoreCase(IdashboardConstantsUtil.NULL)){
			int noofdays = 0;
			if(timeperiod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_30_DAYS)){
				noofdays = 30;
			}
			else if(timeperiod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_60_DAYS)){
				noofdays = 60;
			}
			else if(timeperiod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_90_DAYS)){
				noofdays = 90;
			}
			else if(timeperiod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_180_DAYS)){
				noofdays = 180;
			}
			else if(timeperiod.equalsIgnoreCase(IdashboardConstantsUtil.LAST_365_DAYS)){
				noofdays = 365;
			}
		Date dates=new Date(); //current date
		Calendar cal = Calendar.getInstance();
		cal.setTime(dates);
		cal.add(Calendar.DATE, -(noofdays));
		cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0); cal.set(Calendar.SECOND, 1);
		dateBefore7Days = cal.getTime();
		}
		return dateBefore7Days;
	}
}
