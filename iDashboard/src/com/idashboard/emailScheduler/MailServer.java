package com.idashboard.emailScheduler;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.UserVO;


public class MailServer extends BaseMongoOperation
{

    public void sendMail(String subject, String body, String sender, int daysRemaining, Date expiryDate, String user) throws Exception
    {	
    	/*String mailProtocol = PropertyManager.getProperty("MAIL_PROTOCOL", "properties/notificationMailConfig.properties");
    	String mailPort = PropertyManager.getProperty("MAIL_PORT", "properties/notificationMailConfig.properties");
    	String mailAuth = PropertyManager.getProperty("MAIL_AUTH", "properties/notificationMailConfig.properties");
        String mailhost = PropertyManager.getProperty("MAIL_HOST", "properties/notificationMailConfig.properties");
        String senderEmail = PropertyManager.getProperty("SENDER_EMAIL", "properties/notificationMailConfig.properties");
        Session session;  

        	Properties props = System.getProperties();
        	props.put("mail.transport.protocol", mailProtocol);
        	props.put("mail.smtp.port", mailPort); 
        	props.put("mail.smtp.host", mailhost); 
        	props.put("mail.smtp.auth", mailAuth);

        	session = Session.getDefaultInstance(props,null);
        	
        	List<UserVO> userinfo = null;
    		List<String> recipientEmail = new ArrayList<String>();
            
            Query query = new Query();
    		query.addCriteria(Criteria.where("isAdmin").is(true));
    		userinfo = getMongoOperation().find(query, UserVO.class);
    		
    		DateFormat dateFormat = new SimpleDateFormat("dd MMM, yyyy");
    		
    		for(int i=0; i<userinfo.size(); i++){
    		recipientEmail.add(userinfo.get(i).getEmail());
    		}    
    		    		
    		String msgBody = body.replace("{no of days}", Integer.toString(daysRemaining));
    		String finalMsg = msgBody.replace("{expiration}", dateFormat.format(expiryDate));
    		String finalMsgBody = finalMsg.replace("{user}", user);

        MimeMessage msg = new MimeMessage(session);
        try {
			msg.setFrom(new InternetAddress(senderEmail, sender));
			
			for(int i=0; i<recipientEmail.size(); i++){
				msg.addRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail.get(i)));
			}
	        msg.setSubject(subject);
	        msg.setContent(finalMsgBody,"text/html");
		} catch (MessagingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
        
        List<UserVO> userinfos = null;
        
        Date currentDate = new Date ();
        
        Query querys = new Query();
		querys.addCriteria(Criteria.where("isAdmin").is(true));
		userinfos = getMongoOperation().find(querys, UserVO.class);
				
		Date lastTimeStamp = userinfos.get(0).getLastNotifiedTimeStamp();
		
		if((lastTimeStamp == null) || !(lastTimeStamp.getDate() == currentDate.getDate() && 
				lastTimeStamp.getMonth() == currentDate.getMonth() && 
				lastTimeStamp.getYear() == currentDate.getYear())){
				Transport.send(msg);
		     //   System.out.println("Mail Sent");
		        
		        Update update = new Update();
				update.set("lastNotifiedTimeStamp", currentDate);
				
		        Query query1 = new Query();
				query1.addCriteria(Criteria.where("isAdmin").is(true));
				getMongoOperation().updateMulti(query1, update, UserVO.class);
		        }*/
    }
  
}