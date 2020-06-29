package com.cts.metricsportal.LicenseReader;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.NetworkInterface;
import java.net.Socket;
import java.net.SocketException;
import java.net.URL;
import java.net.UnknownHostException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import com.cognizant.qbot.clientservice.JerseyClient;
import com.cognizant.qbot.service.FileIO;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.LicenseVO;
import org.apache.log4j.Logger;

public class LicenseReader extends HttpServlet {

	// into fn
	static final Logger logger = Logger.getLogger(LicenseReader.class);

	public List<LicenseVO> getReaderValues() throws ServletException, ParseException {
		
		List<LicenseVO> licenseDetails = new ArrayList<LicenseVO>();

		try {

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}

		// Get License file location
		// URL url = getClass().getResource("iDashboardLicense.elf");
		String filePath = null;
		String securedFilePath = null;
		try {
			filePath = PropertyManager.getProperty("LICENSE_FILE_PATH", "properties/dashboardConfig.properties");
			securedFilePath = cleanString(filePath);
		} catch (Exception e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}

		File file = new File(securedFilePath);

		boolean macIdVerify = false;
		Date startDate = null;
		Date endDate = null;
		String user = null;
		String macId = null;
		String layerAccess;
		long nofdays = 0;
		String version = null;
		ArrayList<String> toollist = new ArrayList<String>();

		// File file = new File(url.getPath());
		String commonEntryPoint = "seventhparameter";

		byte[] bytes = null;

		try {
			bytes = EncryptDecrypt.readSmallBinaryFile(file.getAbsolutePath());
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			System.out.println("IO Exception :: File does not exist");
			licenseDetails =null;
			return licenseDetails;
			
			
		}

		

		if (!(bytes == null)) {
			// Decrypt License file
			String encryptedDeatils = new String(bytes);
			String iv = "RandomInitVector";
			String decyptedString = EncryptDecrypt.decrypt(commonEntryPoint, iv, encryptedDeatils);

			if (!(decyptedString == null)) {

				String[] details = decyptedString.split("\n");

				// Get version and toollist from decrypt
				/*
				 * startDate = new Date(details[0]); endDate = new Date(details[1]);
				 */
				DateFormat formatter = new SimpleDateFormat("E MMM dd HH:mm:ss Z yyyy");
				startDate = (Date) formatter.parse(details[0].toString());
				endDate = (Date) formatter.parse(details[1].toString());

				user = details[2];
				macId = details[3];
				layerAccess = details[4];

				if (layerAccess.isEmpty()) {

					layerAccess = layerAccess.replaceAll("\\[", "").replaceAll("\\]", "");

					String[] layers = layerAccess.split(",");

					int index = 0;

					version = layers[1];

					for (int i = 1; i <= (layers.length / 3); i++) {
						toollist.add(layers[(i * 3) - 1]);
					}
				}

				String macAddress = getSystemMac();

				// MAC ID Verify
				if (macAddress.equalsIgnoreCase(macId)) {
					// System.out.println("MAC ID Verified");
					macIdVerify = true;
				}

				// Verify License Duration
				Date date = new Date();

				nofdays = (endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

				// System.out.println("Expiry Date ::::"+endDate);

				if (nofdays < 1) {
					System.out.println("License Expired");
				}

			}
			LicenseVO lvo = new LicenseVO();

			lvo.setUser(user);
			lvo.setMacId(macId);
			lvo.setStartDate(startDate);
			lvo.setEndDate(endDate);
			lvo.setVersion(version);
			lvo.setTools(toollist);
			lvo.setDaysRemaining(nofdays);
			lvo.setMacIdVerify(macIdVerify);

			licenseDetails.add(lvo);
		}
		return licenseDetails;

	}
	
	/** 
     * Method for get System Mac Address
     * @return  MAC Address
     */
	public static String getSystemMac(){
        try{
            String OSName=  System.getProperty("os.name");
            if(OSName.contains("Windows")){
                return (getMAC4Windows());
            }
            else{
                String mac=getMAC4Linux("eth0");
                if(mac==null){
                    mac=getMAC4Linux("eth1");
                    if(mac==null){
                        mac=getMAC4Linux("eth2");
                        if(mac==null){
                            mac=getMAC4Linux("usb0");
                        }
                    }
                }	
                return mac;
            }
        }
        catch(Exception E){
            System.err.println("System Mac Exp : "+E.getMessage());
            return null;
        }
    }
	
	/**
     * Method for get MAc of Linux Machine
     * @param name
     * @return 
     */
    private static String getMAC4Linux(String name){
        try {
            NetworkInterface network = NetworkInterface.getByName(name);
            byte[] mac = network.getHardwareAddress();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < mac.length; i++){
                sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));        
            }
            return (sb.toString());
        }
        catch (Exception E) {
            System.err.println("System Linux MAC Exp : "+E.getMessage());
            return null;
        } 
    } 
	
    /**
     * Method for get Mac Address of Windows Machine
     * @return 
     */
    private static String getMAC4Windows(){
        try{
            InetAddress      addr     =InetAddress.getLocalHost();
            NetworkInterface network  =NetworkInterface.getByInetAddress(addr);

            byte[] mac = network.getHardwareAddress();

            StringBuilder sb = new StringBuilder();
            for(int i=0;i<mac.length;i++){
                sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));		
            }
            
            return sb.toString();
        }
        catch(Exception E){
            System.err.println("System Windows MAC Exp : "+E.getMessage());
            return null;
        }
    }

	public String cleanString(String aString) {

		if (aString == null)
			return null;

		String cleanString = "";

		for (int i = 0; i < aString.length(); ++i) {

			cleanString += cleanChar(aString.charAt(i));

		}

		return cleanString;

	}

	private char cleanChar(char aChar) {

		// 0 - 9

		for (int i = 48; i < 58; ++i) {

			if (aChar == i)
				return (char) i;

		}

		// 'A' - 'Z'

		for (int i = 65; i < 91; ++i) {

			if (aChar == i)
				return (char) i;

		}

		// 'a' - 'z'

		for (int i = 97; i < 123; ++i) {

			if (aChar == i)
				return (char) i;

		}

		// other valid characters

		switch (aChar) {

		case '/':

			return '/';

		case '\\':

			return '\\';

		case ':':

			return ':';

		case '.':

			return '.';

		case '-':

			return '-';

		case '_':

			return '_';

		case ' ':

			return ' ';

		}

		return '%';

	}

}