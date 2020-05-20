package com.cts.metricsportal.emailScheduler;

import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import javax.swing.text.BadLocationException;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.UserVO;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

public class MailScheduler extends BaseMongoOperation
{	    	
	int days;
	public void TimerTaskForMail(int daysRemaining, final Date expiryDate, final String user, boolean isExpired) {

		 final Timer timer = new Timer("Timer");
		 
		 days = daysRemaining;
	
	TimerTask repeatedTask = new TimerTask() {
		public void run() {
			
          String senderName= null ;
   		  String mailSubject = null ;
   		  String mailBody = null ;
   		  boolean isExpired = false;
   		  
   		  if(days<=0){
   			  isExpired = true; 
   		  }
   		  
   		try {
   			  senderName = PropertyManager.getProperty("SENDER_NAME", "properties/notificationMailConfig.properties");
   			  //recipientEmail = PropertyManager.getProperty("RECIPIENT_EMAIL", "properties/notificationMailConfig.properties"); 
   			  mailSubject = PropertyManager.getProperty("MAIL_SUBJECT", "properties/notificationMailConfig.properties");
   			 
   			  if(!isExpired){
   			  mailBody = PropertyManager.getProperty("MAIL_BODY", "properties/notificationMailConfig.properties");
   			  }
   			  else{
 			  mailBody = PropertyManager.getProperty("MAIL_BODY_EXPIRED", "properties/notificationMailConfig.properties");}
			  } 
   		
   			catch (Exception e1) {
   			// TODO Auto-generated catch block
   			e1.printStackTrace();
   		}

            MailServer mail = new MailServer();
            try {
				mail.sendMail(mailSubject, mailBody, senderName, days, expiryDate, user);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        
            if(days==0) {
            	timer.cancel();
            }
            days = days-1;            
        }
       
    };

    long delay = 1000L;
    long period = 1000L * 60L * 60L * 24L;
  
    timer.scheduleAtFixedRate(repeatedTask, delay, period);
}	
	
};