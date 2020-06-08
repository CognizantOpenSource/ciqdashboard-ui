package com.idashboard.admin.daoImpl;

import java.io.FileWriter;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.QueryParam;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.controllers.BaseMongoOperation;
import com.cts.metricsportal.util.PropertyManager;
import com.idashboard.LicenseReader.LicenseReader;
import com.idashboard.admin.dao.LicenseMongoInterface;
import com.idashboard.admin.vo.LicenseVO;
import com.idashboard.admin.vo.UserVO;
import com.idashboard.emailScheduler.MailScheduler;

public class LicenseMongoInterfaceImpl extends BaseMongoOperation implements LicenseMongoInterface {

	static final Logger logger = Logger.getLogger(LicenseMongoInterfaceImpl.class);

	public List<LicenseVO> License_ExecuteQuery_GetLicenseDetails() {

		LicenseReader lr = new LicenseReader();
		List<LicenseVO> readerValues = new ArrayList<LicenseVO>();

		try {
			readerValues = lr.getReaderValues();
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		try {

			if (readerValues.get(0).getisMacIdVerify()) {
				readerValues = readerValues;
			} else {
				readerValues = null;
			}

			String user = null;

			if (!(readerValues == null)) {

				user = readerValues.get(0).getUser();

				Date expiryDate = readerValues.get(0).getEndDate();
				int daysRemaining = (int) readerValues.get(0).getDaysRemaining();

				if (readerValues.get(0).getDaysRemaining() < 5 && !(readerValues.get(0).getDaysRemaining() <= 0)) {
					MailScheduler mailschedule = new MailScheduler();
					mailschedule.TimerTaskForMail(daysRemaining, expiryDate, user, false);
				}

				if (readerValues.get(0).getDaysRemaining() <= 0) {
					MailScheduler mailschedule = new MailScheduler();
					mailschedule.TimerTaskForMail(daysRemaining, expiryDate, user, true);
				}

				String version = readerValues.get(0).getVersion();

				if (version != null) {
					if (version.equalsIgnoreCase(" Lite Version")) {
						Update update = new Update();
						update.set("isQbot", false);
						Query query1 = new Query();
						getMongoOperation().updateMulti(query1, update, UserVO.class);
					}
				}
			}

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		return readerValues;

	}
	
	public boolean License_ExecuteQuery_UpdateLicenseKey(String authString, String licenseKey) {

		boolean change = false;
		try {
			AuthenticationService AuthServ = new AuthenticationService();
			boolean adminstatus = LayerAccess.getAdminLayerAccess(authString);

			String licenseKeyFinal = licenseKey.replaceAll("%2B", "+");

			String filePath = null;
			try {
				filePath = PropertyManager.getProperty("LICENSE_FILE_PATH", "properties/dashboardConfig.properties");
			} catch (Exception e2) {
				// TODO Auto-generated catch block
				logger.error(e2.getMessage());
			}

			LicenseReader readFile = new LicenseReader();
			String securedFilePath = readFile.cleanString(filePath);

			FileWriter fw = new FileWriter(securedFilePath);
			// BufferedWriter br = null;
			
			try {
				// fw = new FileWriter(filePath);
				fw.write(licenseKeyFinal);
				change = true;
			} catch (Exception e) {
				logger.error("Didnt update");
			} finally {
				fw.close();
			}

			
			
		}catch(Exception ex){
			logger.error(ex.getMessage());
		}
		return change;
	}

}
