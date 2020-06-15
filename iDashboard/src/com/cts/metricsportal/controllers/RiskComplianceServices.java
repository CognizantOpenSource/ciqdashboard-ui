




package com.cts.metricsportal.controllers;

import com.idashboard.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.bo.LayerAccess;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.ArcherHighCriticalVO;
import com.cts.metricsportal.vo.ArcherDataVO;
import com.cts.metricsportal.vo.ArcherTrendVO;
import com.cts.metricsportal.vo.CommitTrendVO;
import com.cts.metricsportal.vo.EthicalCriticalHighVO;
import com.cts.metricsportal.vo.EthicalHacksVO;
import com.cts.metricsportal.vo.EthicalTrendVO;
import com.cts.metricsportal.vo.NetworkPenetrationVO;
import com.cts.metricsportal.vo.QualysTrendVO;
import com.cts.metricsportal.vo.QualysVulnerabiltyVO;
import com.cts.metricsportal.vo.TDMDataVO;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.io.PrintStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.swing.text.BadLocationException;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation.GroupOperationBuilder;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation.ProjectionOperationBuilder;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

@Path("/RiskComplianceServices")
public class RiskComplianceServices 
  extends BaseMongoOperation
{

	static final Logger logger = Logger.getLogger(RiskComplianceServices.class);
	
	
	@GET
	@Path("/openRiskTableDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<EthicalHacksVO> getCsvTableDetails(@HeaderParam("Authorization") String authString) throws JsonParseException,
			JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException {
		List<EthicalHacksVO> tdminfoo = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean authenticateToken = LayerAccess.authenticateToken(authString);

			tdminfoo = new ArrayList<EthicalHacksVO>();
			String sizequery = "{},{_id:0,userId:1}";
			Query query = new BasicQuery(sizequery);
			

			
			tdminfoo = getMongoOperation().find(query,EthicalHacksVO.class);
			/*if(tdminfoo.)*/
		/*	tdminfoo.remove('=');*/
			logger.error("openRiskTableDetails"+tdminfoo);
			return tdminfoo;
		
	}
	
	//table of ethical data
	@GET
	@Path("/ethicalDetailsData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<EthicalHacksVO> getEthicalDetailsData(@HeaderParam("Authorization")String authString,@QueryParam("division") String division) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<EthicalHacksVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();

		ethicaldata = new ArrayList<EthicalHacksVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division));

		ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
	
	
	//for network data
	
	
	@GET
	@Path("/networkDetailsData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<NetworkPenetrationVO> networkDetailsData(@HeaderParam("Authorization")String authString,@QueryParam("division") String division) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<NetworkPenetrationVO> networkdata = null;
		AuthenticationService AuthServ = new AuthenticationService();

		networkdata = new ArrayList<NetworkPenetrationVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division));

		networkdata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
		logger.error("tdd" + networkdata);
		return networkdata;

	
	}
	
	
	
	//for archer data
	@GET
	@Path("/archerDetailsData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArcherDataVO> archerDetailsData(@HeaderParam("Authorization")String authString,@QueryParam("division") String division) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ArcherDataVO> archerdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		archerdata = new ArrayList<ArcherDataVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("status").ne("X4 Closed").andOperator(Criteria.where("status").ne("X1 Cancelled").andOperator(Criteria.where("status").ne("X2 Rejected").andOperator(Criteria.where("status").ne("X3 Closed - Pending Reacceptance")
	    		)))));
	    
	    archerdata = getMongoOperation().find(query1, ArcherDataVO.class);
		logger.error("tdd" + archerdata);
		return archerdata;

	
	}
	
	//ethical data download for ovberdue risk 
	
	@GET
	@Path("/ethicalDetailsDataForOverdue")
	@Produces(MediaType.APPLICATION_JSON)
	public List<EthicalHacksVO> ethicalDetailsDataForOverdue(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("vardtfrom") String vardtfrom ) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<EthicalHacksVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		
		Date startDate = new Date(vardtfrom);
	      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
	      String strDate = dateFormat.format(startDate); 
	      
		ethicaldata = new ArrayList<EthicalHacksVO>();
	
		Query query1 = new Query();
		
	 
	
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("remediationDueDate").lt(strDate)));

		ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
	
	
	//archer daat for overdue risk 
	@GET
	@Path("/archerDetailsDataForOverdue")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArcherDataVO> archerDetailsDataForOverdue(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("vardtfrom") String vardtfrom ) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ArcherDataVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		
		Date startDate = new Date(vardtfrom);
	      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
	      String strDate = dateFormat.format(startDate); 
	      
		ethicaldata = new ArrayList<ArcherDataVO>();
	
		Query query1 = new Query();
		
	 
	
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("expirationDate").lt(strDate)));

		ethicaldata = getMongoOperation().find(query1, ArcherDataVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
	//archer detail data for chart archer by division
	
	
	@GET
	@Path("/archerChartDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArcherDataVO> archerChartDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ArcherDataVO> archerdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		archerdata = new ArrayList<ArcherDataVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division));
	    
	    archerdata = getMongoOperation().find(query1, ArcherDataVO.class);
		logger.error("tdd" + archerdata);
		return archerdata;

	
	}
	
	//for qualys pie chart data 
	
	
	@GET
	@Path("/qualysChartDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<QualysVulnerabiltyVO> qualysChartDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<QualysVulnerabiltyVO> archerdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		archerdata = new ArrayList<QualysVulnerabiltyVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division));
	    
	    archerdata = getMongoOperation().find(query1, QualysVulnerabiltyVO.class);
		logger.error("tdd" + archerdata);
		return archerdata;

	
	}
	
	
	@GET
	@Path("/ethicalChartDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<EthicalHacksVO> ethicalChartDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division ) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<EthicalHacksVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		
		
	      
		ethicaldata = new ArrayList<EthicalHacksVO>();
	
		Query query1 = new Query();
		
	 
	
	    query1.addCriteria(Criteria.where("division").is(division));

		ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
	
	@GET
	@Path("/networkChartDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<NetworkPenetrationVO> networkChartDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division ) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<NetworkPenetrationVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		
		
		ethicaldata = new ArrayList<NetworkPenetrationVO>();
	
		Query query1 = new Query();
		
	 
	
	    query1.addCriteria(Criteria.where("division").is(division));
		ethicaldata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;
	}
	// network data download for overdue risk 
	@GET
	@Path("/networkDetailsDataForOverdue")
	@Produces(MediaType.APPLICATION_JSON)
	public List<NetworkPenetrationVO> networkDetailsDataForOverdue(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("vardtfrom") String vardtfrom ) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<NetworkPenetrationVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		
		Date startDate = new Date(vardtfrom);
	      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
	      String strDate = dateFormat.format(startDate); 
	      
		ethicaldata = new ArrayList<NetworkPenetrationVO>();
	
		Query query1 = new Query();
		
	 
	
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("slaDate").lt(strDate)));

		ethicaldata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;
	}
	
	
	//qualys data for overdue risk
	
	@GET
	@Path("/qualysDetailsDataForOverdue")
	@Produces(MediaType.APPLICATION_JSON)
	public List<QualysVulnerabiltyVO> qualysDetailsDataForOverdue(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("vardtfrom") String vardtfrom ) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<QualysVulnerabiltyVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		
		Date startDate = new Date(vardtfrom);
	      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
	      String strDate = dateFormat.format(startDate); 
	      
		ethicaldata = new ArrayList<QualysVulnerabiltyVO>();
	
		Query query1 = new Query();
		
	 
	
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("slaDate").lt(strDate)));

		ethicaldata = getMongoOperation().find(query1, QualysVulnerabiltyVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
	
	@GET
	@Path("/qualysDetailsData")
	@Produces(MediaType.APPLICATION_JSON)
	public List<QualysVulnerabiltyVO> qualysDetailsData(@HeaderParam("Authorization")String authString,@QueryParam("division") String division) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<QualysVulnerabiltyVO> qualysdata = null;
		AuthenticationService AuthServ = new AuthenticationService();

		qualysdata = new ArrayList<QualysVulnerabiltyVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division));

		qualysdata = getMongoOperation().find(query1, QualysVulnerabiltyVO.class);
		logger.error("tdd" + qualysdata);
		return qualysdata;

	
	}
	
	
	
	
	
	
	//risk by 60 daya ethical data

	
 	
 	@GET
 	@Path("/ethicalDetailsDataForDays")
 	@Produces(MediaType.APPLICATION_JSON)
 	public List<EthicalHacksVO> ethicalDetailsDataForDays(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("vardtfrom") String vardtfrom ) 
 			
 			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
 			BadLocationException {
 		List<EthicalHacksVO> ethicaldata = null;
 		AuthenticationService AuthServ = new AuthenticationService();
 		
 		 Date startDate = new Date(vardtfrom);
 	     LocalDateTime localDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
 	     localDateTime = localDateTime.plusYears(0L).plusMonths(0L).plusDays(60L);
 	     Date currentDatePlusSixtyDay = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
 	     DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
 	     String strDate = dateFormat.format(currentDatePlusSixtyDay);
 	      
 		ethicaldata = new ArrayList<EthicalHacksVO>();
 	
 		Query query1 = new Query();
 		
 	 
 	
 	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("remediationDueDate").lt(strDate)));

 		ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
 		logger.error("tdd" + ethicaldata);
 		return ethicaldata;

 	
 	}
 	//risk by days for network data
 	
 	@GET
 	@Path("/networkDetailsDataForDays")
 	@Produces(MediaType.APPLICATION_JSON)
 	public List<NetworkPenetrationVO> networkDetailsDataForDays(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("vardtfrom") String vardtfrom ) 
 			
 			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
 			BadLocationException {
 		List<NetworkPenetrationVO> ethicaldata = null;
 		AuthenticationService AuthServ = new AuthenticationService();
 		
 		 Date startDate = new Date(vardtfrom);
 	     LocalDateTime localDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
 	     localDateTime = localDateTime.plusYears(0L).plusMonths(0L).plusDays(60L);
 	     Date currentDatePlusSixtyDay = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
 	     DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
 	     String strDate = dateFormat.format(currentDatePlusSixtyDay);
 	      
 		ethicaldata = new ArrayList<NetworkPenetrationVO>();
 	
 		Query query1 = new Query();
 		
 	 
 	
 	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("slaDate").lt(strDate)));

 		ethicaldata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
 		logger.error("tdd" + ethicaldata);
 		return ethicaldata;

 	
 	}
 	//risk by days for archer daat 
 	@GET
 	@Path("/archerDetailsDataForDays")
 	@Produces(MediaType.APPLICATION_JSON)
 	public List<ArcherDataVO> archerDetailsDataForDays(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("vardtfrom") String vardtfrom ) 
 			
 			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
 			BadLocationException {
 		List<ArcherDataVO> ethicaldata = null;
 		AuthenticationService AuthServ = new AuthenticationService();
 		
 		 Date startDate = new Date(vardtfrom);
 	     LocalDateTime localDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
 	     localDateTime = localDateTime.plusYears(0L).plusMonths(0L).plusDays(60L);
 	     Date currentDatePlusSixtyDay = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
 	     DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
 	     String strDate = dateFormat.format(currentDatePlusSixtyDay);
 	      
 		ethicaldata = new ArrayList<ArcherDataVO>();
 	
 		Query query1 = new Query();
 		
 	 
 	
 	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("slaDate").lt(strDate)));

 		ethicaldata = getMongoOperation().find(query1, ArcherDataVO.class);
 		logger.error("tdd" + ethicaldata);
 		return ethicaldata;

 	
 	}
	//risk by 60 days for qualys data 
 	@GET
	@Path("/qualysDetailsDataForDays")
	@Produces(MediaType.APPLICATION_JSON)
	public List<QualysVulnerabiltyVO> qualysDetailsDataForDays(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("vardtfrom") String vardtfrom ) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<QualysVulnerabiltyVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		
		Date startDate = new Date(vardtfrom);
	     LocalDateTime localDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
	     localDateTime = localDateTime.plusYears(0L).plusMonths(0L).plusDays(60L);
	     Date currentDatePlusSixtyDay = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
	     DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
	     String strDate = dateFormat.format(currentDatePlusSixtyDay);
	      
		ethicaldata = new ArrayList<QualysVulnerabiltyVO>();
	
		Query query1 = new Query();
		
	 
	
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("slaDate").lt(strDate)));

		ethicaldata = getMongoOperation().find(query1, QualysVulnerabiltyVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
 	
 	//ethical critical data download 
 	
 	@GET
	@Path("/ethicalcriticalDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<EthicalHacksVO> ethicalcriticalDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("severity") long severity) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<EthicalHacksVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		ethicaldata = new ArrayList<EthicalHacksVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("severity").is(severity)));

		ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
 	//for ethical medium data 
 	@GET
	@Path("/ethicalmediumDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<EthicalHacksVO> ethicalmediumDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("severity") long severity) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<EthicalHacksVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		ethicaldata = new ArrayList<EthicalHacksVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("severity").is(severity)));

		ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
 	//ethical high data details
 	@GET
	@Path("/ethicalhighDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<EthicalHacksVO> ethicalhighDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("severity") long severity) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<EthicalHacksVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		ethicaldata = new ArrayList<EthicalHacksVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("severity").is(severity)));

		ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
	//for archer entrprise high data 
 	@GET
	@Path("/archerEntripriseHighDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArcherDataVO> archerEntripriseHighDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("businessRisk") String businessRisk) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ArcherDataVO> archerdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		archerdata = new ArrayList<ArcherDataVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("businessRisk").is(businessRisk)));

	    archerdata = getMongoOperation().find(query1, ArcherDataVO.class);
		logger.error("tdd" + archerdata);
		return archerdata;

	
	}
	//for archer enterprise critical data 
	@GET
	@Path("/archerEntripriseCriticalDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArcherDataVO> archerEntripriseCriticalDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("businessRisk") String businessRisk) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ArcherDataVO> archerdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		archerdata = new ArrayList<ArcherDataVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("businessRisk").is(businessRisk)));

	    archerdata = getMongoOperation().find(query1, ArcherDataVO.class);
		logger.error("tdd" + archerdata);
		return archerdata;

	
	}
	//for archer business critical data
	@GET
	@Path("/archerBusinessCriticalDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArcherDataVO> archerBusinessCriticalDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("businessRisk") String businessRisk) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ArcherDataVO> archerdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		archerdata = new ArrayList<ArcherDataVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("businessRisk").is(businessRisk)));

	    archerdata = getMongoOperation().find(query1, ArcherDataVO.class);
		logger.error("tdd" + archerdata);
		return archerdata;

	
	}
	//for archer business high data
	@GET
	@Path("/archerBusinessHighDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArcherDataVO> archerBusinessHighDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("businessRisk") String businessRisk) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ArcherDataVO> archerdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		archerdata = new ArrayList<ArcherDataVO>();
	
		Query query1 = new Query();
	
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("businessRisk").is(businessRisk)));

	    archerdata = getMongoOperation().find(query1, ArcherDataVO.class);
		logger.error("tdd" + archerdata);
		return archerdata;

	
	}
 	//network critical data in details
 	@GET
	@Path("/networkCriticalDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<NetworkPenetrationVO> networkCriticalDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("severity") long severity) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<NetworkPenetrationVO> networkdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		networkdata = new ArrayList<NetworkPenetrationVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("severity").is(severity)));

		networkdata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
		logger.error("tdd" + networkdata);
		return networkdata;

	
	}
//for network low data
 	
 	
 	@GET
	@Path("/networkLowDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<NetworkPenetrationVO> networkLowDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("severity") long severity) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<NetworkPenetrationVO> networkdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		networkdata = new ArrayList<NetworkPenetrationVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("severity").is(severity)));

		networkdata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
		logger.error("tdd" + networkdata);
		return networkdata;

	
	}
 	
 	//for network medium data 
	@GET
	@Path("/networkMediumDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<NetworkPenetrationVO> networkMediumDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("severity") long severity) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<NetworkPenetrationVO> networkdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		networkdata = new ArrayList<NetworkPenetrationVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("severity").is(severity)));

		networkdata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
		logger.error("tdd" + networkdata);
		return networkdata;

	
	}
 	//for network high data 
	@GET
	@Path("/networkHighDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<NetworkPenetrationVO> networkHighDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("division") String division,@QueryParam("severity") long severity) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<NetworkPenetrationVO> networkdata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		networkdata = new ArrayList<NetworkPenetrationVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("division").is(division).andOperator(Criteria.where("severity").is(severity)));

		networkdata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
		logger.error("tdd" + networkdata);
		return networkdata;

	
	}
 	
	/////bar chart by status
	@GET
	  @Path("/EthicalByStatus")
	  @Produces({"application/json"})
	  public List<EthicalCriticalHighVO> EthicalByStatus(@HeaderParam("Authorization") String authString)
	    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
	  {
	    List<EthicalHacksVO> qualysdata = new ArrayList();
	    
	    List<EthicalCriticalHighVO> trendvolist = null;
	    AuthenticationService UserEncrypt = new AuthenticationService();
	    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
	    if (RiskComplianceLayerAccess)
	    {*/
	      trendvolist = new ArrayList();
	      
	      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.group(new String[] { "remediationStatus" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("remediationStatus").previousOperation() });
	      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, EthicalHacksVO.class);
	      qualysdata = groupResults.getMappedResults();
	      for (int i = 0; i < qualysdata.size(); i++)
	      {
	        String status = ((EthicalHacksVO)qualysdata.get(i)).getRemediationStatus();
	        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
	        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, status);
	        trendvolist.add(tctrendvo);
	      }
	  	logger.error("EthicalByStatus"+trendvolist);
	      return trendvolist;
	    }
	// ethical status bar chart detail data 

	
	@GET
	@Path("/ethicalStatusChartDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<EthicalHacksVO> ethicalStatusChartDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("status") String status) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<EthicalHacksVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		ethicaldata = new ArrayList<EthicalHacksVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("remediationStatus").is(status));

		ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
	//archer by status details 
	
	@GET
	@Path("/archerStatusChartDataDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ArcherDataVO> archerStatusChartDataDetails(@HeaderParam("Authorization")String authString,@QueryParam("status") String status) 
			
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<ArcherDataVO> ethicaldata = null;
		AuthenticationService AuthServ = new AuthenticationService();
		

		ethicaldata = new ArrayList<ArcherDataVO>();
	
		Query query1 = new Query();
		
	    query1.addCriteria(Criteria.where("status").is(status));

		ethicaldata = getMongoOperation().find(query1, ArcherDataVO.class);
		logger.error("tdd" + ethicaldata);
		return ethicaldata;

	
	}
	@GET
	  @Path("/ArcherByStatus")
	  @Produces({"application/json"})
	  public List<EthicalCriticalHighVO> ArcherByStatus(@HeaderParam("Authorization") String authString)
	    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
	  {
		 List<String> divisionList = new ArrayList();
		    divisionList.add("iDashboard");
		    divisionList.add("TDM");
		    divisionList.add("IOT");
		    divisionList.add("QI BOTS");
		    divisionList.add("ADPART");
		    divisionList.add("Automation");
		    divisionList.add("Smart Stub");
	    List<ArcherDataVO> qualysdata = new ArrayList();
	    
	    List<EthicalCriticalHighVO> trendvolist = null;
	    AuthenticationService UserEncrypt = new AuthenticationService();
	    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
	    if (RiskComplianceLayerAccess)
	    {*/
	      trendvolist = new ArrayList();
	      
	      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.match(Criteria.where("division").in(divisionList)),Aggregation.group(new String[] { "status" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("status").previousOperation() });
	      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, ArcherDataVO.class);
	      qualysdata = groupResults.getMappedResults();
	      for (int i = 0; i < qualysdata.size(); i++)
	      {
	        String status = ((ArcherDataVO)qualysdata.get(i)).getStatus();
	        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
	        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, status);
	        trendvolist.add(tctrendvo);
	      }
	  	logger.error("ArcherByStatus"+trendvolist);
	      return trendvolist;
	    }
	//////
	
	
	/// pie chart by division
	

	
	
	 @GET
	  @Path("/ArcherBydivision")
	  @Produces({"application/json"})
	  public List<EthicalCriticalHighVO> ArcherBydivision(@HeaderParam("Authorization") String authString)
	    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
	  {
	    List<ArcherDataVO> qualysdata = new ArrayList();
	    
	    List<EthicalCriticalHighVO> trendvolist = null;
	    AuthenticationService UserEncrypt = new AuthenticationService();
	    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
	    if (RiskComplianceLayerAccess)
	    {*/
	      trendvolist = new ArrayList();
	      
	      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
	      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, ArcherDataVO.class);
	      qualysdata = groupResults.getMappedResults();
	      for (int i = 0; i < qualysdata.size(); i++)
	      {
	        String division1 = ((ArcherDataVO)qualysdata.get(i)).getDivision();
	        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
	        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
	        trendvolist.add(tctrendvo);
	      }
	  	logger.error("ArcherBydivision"+trendvolist);
	      return trendvolist;
	    }
	
	
	 @GET
	  @Path("/QualysBydivision")
	  @Produces({"application/json"})
	  public List<EthicalCriticalHighVO> QualysBydivision(@HeaderParam("Authorization") String authString)
	    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
	  {
	    List<QualysVulnerabiltyVO> qualysdata = new ArrayList();
	    
	    List<EthicalCriticalHighVO> trendvolist = null;
	    AuthenticationService UserEncrypt = new AuthenticationService();
	    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
	    if (RiskComplianceLayerAccess)
	    {*/
	      trendvolist = new ArrayList();
	      
	      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
	      AggregationResults<QualysVulnerabiltyVO> groupResults = getMongoOperation().aggregate(agg, QualysVulnerabiltyVO.class, QualysVulnerabiltyVO.class);
	      qualysdata = groupResults.getMappedResults();
	      for (int i = 0; i < qualysdata.size(); i++)
	      {
	        String division1 = ((QualysVulnerabiltyVO)qualysdata.get(i)).getDivision();
	        int count = ((QualysVulnerabiltyVO)qualysdata.get(i)).getCount();
	        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
	        trendvolist.add(tctrendvo);
	      }
	  	logger.error("QualysBydivision"+trendvolist);
	      return trendvolist;
	    }
	
	
	 @GET
	  @Path("/EthicalBydivision")
	  @Produces({"application/json"})
	  public List<EthicalCriticalHighVO> EthicalBydivision(@HeaderParam("Authorization") String authString)
	    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
	  {
	    List<EthicalHacksVO> qualysdata = new ArrayList();
	    
	    List<EthicalCriticalHighVO> trendvolist = null;
	    AuthenticationService UserEncrypt = new AuthenticationService();
	    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
	    if (RiskComplianceLayerAccess)
	    {*/
	      trendvolist = new ArrayList();
	      
	      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
	      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, EthicalHacksVO.class);
	      qualysdata = groupResults.getMappedResults();
	      for (int i = 0; i < qualysdata.size(); i++)
	      {
	        String division1 = ((EthicalHacksVO)qualysdata.get(i)).getDivision();
	        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
	        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
	        trendvolist.add(tctrendvo);
	      }
	  	logger.error("EthicalBydivision"+trendvolist);
	      return trendvolist;
	    }
	
	 @GET
	  @Path("/NetworkBydivision")
	  @Produces({"application/json"})
	  public List<EthicalCriticalHighVO> NetworkBydivision(@HeaderParam("Authorization") String authString)
	    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
	  {
	    List<NetworkPenetrationVO> qualysdata = new ArrayList();
	    
	    List<EthicalCriticalHighVO> trendvolist = null;
	    AuthenticationService UserEncrypt = new AuthenticationService();
	    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
	    if (RiskComplianceLayerAccess)
	    {*/
	      trendvolist = new ArrayList();
	      
	      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
	      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, NetworkPenetrationVO.class);
	      qualysdata = groupResults.getMappedResults();
	      for (int i = 0; i < qualysdata.size(); i++)
	      {
	        String division1 = ((NetworkPenetrationVO)qualysdata.get(i)).getDivision();
	        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
	        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
	        trendvolist.add(tctrendvo);
	      }
	  	logger.error("NetworkBydivision"+trendvolist);
	      return trendvolist;
	    }
	///////
	
  @GET
  @Path("/openRisksArcherDataUSAgencyCount")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> openRisksArcherDataUSAgencyCount(@HeaderParam("Authorization") String authString)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      List<String> divisionList = new ArrayList();
      divisionList.add("iDashboard");
      divisionList.add("TDM");
      divisionList.add("IOT");
      divisionList.add("QI BOTS");
      divisionList.add("ADPART");
      divisionList.add("Automation");
      divisionList.add("Smart Stub");
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.match(Criteria.where("status").ne("X4 Closed")), Aggregation.match(Criteria.where("status").ne("X1 Cancelled")), Aggregation.match(Criteria.where("status").ne("X2 Rejected")), Aggregation.match(Criteria.where("status").ne("X3 Closed - Pending Reacceptance")), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division1 = ((ArcherDataVO)qualysdata.get(i)).getDivision();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
        trendvolist.add(tctrendvo);
      }
  	logger.error("openRisksArcherDataUSAgencyCount"+trendvolist);
      return trendvolist;
    }
  /*  return trendvolist;
  }*/
  
  @GET
  @Path("/openRisksEthicalDataUSAgencyCount")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> openRisksEthicalDataUSAgencyCount(@HeaderParam("Authorization") String authString)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division1 = ((EthicalHacksVO)qualysdata.get(i)).getDivision();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
        trendvolist.add(tctrendvo);
      }
  	logger.error("openRisksEthicalDataUSAgencyCount"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/openRisksNetworkDataUSAgencyCount")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> openRisksNetworkDataUSAgencyCount(@HeaderParam("Authorization") String authString)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division1 = ((NetworkPenetrationVO)qualysdata.get(i)).getDivision();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
        trendvolist.add(tctrendvo);
      }
  	logger.error("openRisksNetworkDataUSAgencyCount"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/openRisksUSAgencyCount")

  public List<EthicalCriticalHighVO> openRisksUSAgencyCount(@HeaderParam("Authorization") String authString)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	 
    List<QualysVulnerabiltyVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
  	  
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<QualysVulnerabiltyVO> groupResults = getMongoOperation().aggregate(agg, QualysVulnerabiltyVO.class, QualysVulnerabiltyVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division1 = ((QualysVulnerabiltyVO)qualysdata.get(i)).getDivision();
        int count = ((QualysVulnerabiltyVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
        trendvolist.add(tctrendvo);
      }
  	logger.error("openRisksUSAgencyCount"+trendvolist);
      return trendvolist;
    }
    
  
  
  @GET
  @Path("/usAgencyTrendQualysCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> getcommits(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
 
    List<QualysTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
/*    boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);*/
    
    Date startDate = null;
    Date endDate = null;
    if (!fromdate.equalsIgnoreCase("-"))
    {
      startDate = new Date(fromdate);
    }
    else
    {
      Calendar cal1 = Calendar.getInstance();
      cal1.setTime(new Date());
      cal1.add(5, 65171);
      startDate = cal1.getTime();
    }
    if (!todate.equalsIgnoreCase("-")) {
      endDate = new Date(todate);
    } else {
      endDate = new Date();
    }
    /*if (RiskComplianceLayerAccess)
    */
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<QualysTrendVO> groupResults = getMongoOperation().aggregate(agg, QualysTrendVO.class, 
        QualysTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((QualysTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((QualysTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
     
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
  	logger.error("usAgencyTrendQualysCount"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  

@GET
  @Path("/usAgencyTrendArcherCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> usAgencyTrendArcherCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    
    List<ArcherTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<ArcherTrendVO> groupResults = getMongoOperation().aggregate(agg, ArcherTrendVO.class, 
        ArcherTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((ArcherTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((ArcherTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
     /*   Date date = new Date();
        date = dateString;*/
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
  	logger.error("usAgencyTrendArcherCount"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }
  */
  @GET
  @Path("/usAgencyTrendEthicalCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> usAgencyTrendEthicalCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
 
    List<EthicalTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<EthicalTrendVO> groupResults = getMongoOperation().aggregate(agg, EthicalTrendVO.class, 
        EthicalTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((EthicalTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((EthicalTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
     /*   Date date = new Date();
        date = dateString;*/
      /*  SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
  	logger.error("usAgencyTrendEthicalCount"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/subAccountingTrendQualysCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> subAccountingTrendQualysCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error("In the method");
    List<QualysTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
/*    boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);*/
    
    Date startDate = null;
    Date endDate = null;
    if (!fromdate.equalsIgnoreCase("-"))
    {
      startDate = new Date(fromdate);
    }
    else
    {
      Calendar cal1 = Calendar.getInstance();
      cal1.setTime(new Date());
      cal1.add(5, 65171);
      startDate = cal1.getTime();
    }
    if (!todate.equalsIgnoreCase("-")) {
      endDate = new Date(todate);
    } else {
      endDate = new Date();
    }
    /*if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<QualysTrendVO> groupResults = getMongoOperation().aggregate(agg, QualysTrendVO.class, 
        QualysTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((QualysTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((QualysTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
       /* Date date = new Date();
        date = dateString;*/
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
  	logger.error("subAccountingTrendQualysCount"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @SuppressWarnings("unchecked")
@GET
  @Path("/subAccountingTrendArcherCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> subAccountingTrendArcherCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<ArcherTrendVO> groupResults = getMongoOperation().aggregate(agg, ArcherTrendVO.class, 
        ArcherTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((ArcherTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((ArcherTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
      /*  Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
  	logger.error("subAccountingTrendArcherCount"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/subAccountingTrendEthicalCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> subAccountingTrendEthicalCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
//    boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
//    if (RiskComplianceLayerAccess)
//    {
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<EthicalTrendVO> groupResults = getMongoOperation().aggregate(agg, EthicalTrendVO.class, 
        EthicalTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((EthicalTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((EthicalTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
     /*   Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error("subAccountingTrendEthicalCount"+trendvolist);
      return trendvolist;
    }
//    return trendvolist;
//  }
  
  @GET
  @Path("/onCoreTrendQualysCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> onCoreTrendQualysCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
      logger.error("onCoreTrendQualysCount");
    List<QualysTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
/*    boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);*/
    
    Date startDate = null;
    Date endDate = null;
    if (!fromdate.equalsIgnoreCase("-"))
    {
      startDate = new Date(fromdate);
    }
    else
    {
      Calendar cal1 = Calendar.getInstance();
      cal1.setTime(new Date());
      cal1.add(5, 65171);
      startDate = cal1.getTime();
    }
    if (!todate.equalsIgnoreCase("-")) {
      endDate = new Date(todate);
    } else {
      endDate = new Date();
    }
    /*if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<QualysTrendVO> groupResults = getMongoOperation().aggregate(agg, QualysTrendVO.class, 
        QualysTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((QualysTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((QualysTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error("onCoreTrendQualysCount"+trendvolist);
      return trendvolist;
    }
    /*eturn trendvolist;
  }*/
  
  @GET
  @Path("/onCoreTrendArcherCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> onCoreTrendArcherCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error("onCoreTrendArcherCount method");
    List<ArcherTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<ArcherTrendVO> groupResults = getMongoOperation().aggregate(agg, ArcherTrendVO.class, 
        ArcherTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((ArcherTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((ArcherTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error("onCoreTrendArcherCount method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/onCoreTrendEthicalCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> onCoreTrendEthicalCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" onCoreTrendEthicalCount method");
    List<EthicalTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<EthicalTrendVO> groupResults = getMongoOperation().aggregate(agg, EthicalTrendVO.class, 
        EthicalTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((EthicalTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((EthicalTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
       /* Date date = new Date();
        date = dateString;*/
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error("onCoreTrendEthicalCount method"+ trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/alternativeInvestmentTrendQualysCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> alternativeInvestmentTrendQualysCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" alternativeInvestmentTrendQualysCount method");
    List<QualysTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
/*    boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);*/
    
    Date startDate = null;
    Date endDate = null;
    if (!fromdate.equalsIgnoreCase("-"))
    {
      startDate = new Date(fromdate);
    }
    else
    {
      Calendar cal1 = Calendar.getInstance();
      cal1.setTime(new Date());
      cal1.add(5, 65171);
      startDate = cal1.getTime();
    }
    if (!todate.equalsIgnoreCase("-")) {
      endDate = new Date(todate);
    } else {
      endDate = new Date();
    }
   /* if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<QualysTrendVO> groupResults = getMongoOperation().aggregate(agg, QualysTrendVO.class, 
        QualysTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((QualysTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((QualysTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" alternativeInvestmentTrendQualysCount method"+trendvolist);
      
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/alternativeInvestmentTrendArcherCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> alternativeInvestmentTrendArcherCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" alternativeInvestmentTrendArcherCount method");
    List<ArcherTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
//    boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
//    if (RiskComplianceLayerAccess)
//    {
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<ArcherTrendVO> groupResults = getMongoOperation().aggregate(agg, ArcherTrendVO.class, 
        ArcherTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((ArcherTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((ArcherTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" alternativeInvestmentTrendArcherCount method"+trendvolist);
      return trendvolist;
    }
//    return trendvolist;
//  }
//  
  @SuppressWarnings("unchecked")
@GET
  @Path("/alternativeInvestmentTrendEthicalCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> alternativeInvestmentTrendEthicalCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	    logger.error(" alternativeInvestmentTrendEthicalCount method");
    List<EthicalTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<EthicalTrendVO> groupResults = getMongoOperation().aggregate(agg, EthicalTrendVO.class, 
        EthicalTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((EthicalTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((EthicalTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
       /* Date date = new Date();
        date = dateString;*/
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
	    logger.error(" alternativeInvestmentTrendEthicalCount method"+trendvolist);
      return trendvolist;
    }
//    return trendvolist;
//  }
  
  @SuppressWarnings("unchecked")
@GET
  @Path("/giarsTrendQualysCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> giarsTrendQualysCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" giarsTrendQualysCount method");
    List<QualysTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
  /*  boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);*/
    
    Date startDate = null;
    Date endDate = null;
    if (!fromdate.equalsIgnoreCase("-"))
    {
      startDate = new Date(fromdate);
    }
    else
    {
      Calendar cal1 = Calendar.getInstance();
      cal1.setTime(new Date());
      cal1.add(5, 65171);
      startDate = cal1.getTime();
    }
    if (!todate.equalsIgnoreCase("-")) {
      endDate = new Date(todate);
    } else {
      endDate = new Date();
    }
    /*if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<QualysTrendVO> groupResults = getMongoOperation().aggregate(agg, QualysTrendVO.class, 
        QualysTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((QualysTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((QualysTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" giarsTrendQualysCount method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/giarsTrendArcherCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> giarsTrendArcherCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	     logger.error(" giarsTrendArcherCount method");
    List<ArcherTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<ArcherTrendVO> groupResults = getMongoOperation().aggregate(agg, ArcherTrendVO.class, 
        ArcherTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((ArcherTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((ArcherTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
       /* Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" giarsTrendArcherCount method"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/giarsTrendEthicalCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> giarsTrendEthicalCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" giarsTrendEthicalCount method");
   
    List<EthicalTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<EthicalTrendVO> groupResults = getMongoOperation().aggregate(agg, EthicalTrendVO.class, 
        EthicalTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((EthicalTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((EthicalTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
//        String date = new Date();
//        date = dateString;
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" giarsTrendEthicalCount method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/emeaTrendQualysCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> emeaTrendQualysCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	   logger.error(" emeaTrendQualysCount method");
    List<QualysTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();/*
    boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    */
    Date startDate = null;
    Date endDate = null;
    if (!fromdate.equalsIgnoreCase("-"))
    {
      startDate = new Date(fromdate);
    }
    else
    {
      Calendar cal1 = Calendar.getInstance();
      cal1.setTime(new Date());
      cal1.add(5, 65171);
      startDate = cal1.getTime();
    }
    if (!todate.equalsIgnoreCase("-")) {
      endDate = new Date(todate);
    } else {
      endDate = new Date();
    }
 /*   if (RiskComplianceLayerAccess)
    {
      */
    trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<QualysTrendVO> groupResults = getMongoOperation().aggregate(agg, QualysTrendVO.class, 
        QualysTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((QualysTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((QualysTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
     /*   Date date = new Date();
        date = dateString;*/
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" emeaTrendQualysCount method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/emeaTrendArcherCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> emeaTrendArcherCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	   logger.error(" emeaTrendArcherCount method");
    List<ArcherTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<ArcherTrendVO> groupResults = getMongoOperation().aggregate(agg, ArcherTrendVO.class, 
        ArcherTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((ArcherTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((ArcherTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
//        String str = formatter.format(dateString);
      }
      logger.error(" emeaTrendArcherCount method"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/emeaTrendEthicalCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> emeaTrendEthicalCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" emeaTrendEthicalCount method");
    List<EthicalTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<EthicalTrendVO> groupResults = getMongoOperation().aggregate(agg, EthicalTrendVO.class, 
        EthicalTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((EthicalTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((EthicalTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" emeaTrendEthicalCount method"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/globalFundTrendQualysCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> globalFundTrendQualysCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" globalFundTrendQualysCount method");
    List<QualysTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);*/
    
    Date startDate = null;
    Date endDate = null;
    if (!fromdate.equalsIgnoreCase("-"))
    {
      startDate = new Date(fromdate);
    }
    else
    {
      Calendar cal1 = Calendar.getInstance();
      cal1.setTime(new Date());
      cal1.add(5, 65171);
      startDate = cal1.getTime();
    }
    if (!todate.equalsIgnoreCase("-")) {
      endDate = new Date(todate);
    } else {
      endDate = new Date();
    }
   /* if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<QualysTrendVO> groupResults = getMongoOperation().aggregate(agg, QualysTrendVO.class, 
        QualysTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((QualysTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((QualysTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" globalFundTrendQualysCount method"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/globalFundTrendArcherCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> globalFundTrendArcherCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" globalFundTrendArcherCount method");
    List<ArcherTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<ArcherTrendVO> groupResults = getMongoOperation().aggregate(agg, ArcherTrendVO.class, 
        ArcherTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((ArcherTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((ArcherTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
        /*Date date = new Date();
        date = dateString;*/
       /* SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" globalFundTrendArcherCount method"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/globalFundTrendEthicalCount")
  @Produces({"application/json"})
  public List<CommitTrendVO> globalFundTrendEthicalCount(@HeaderParam("Authorization") String authString, @QueryParam("division") String division, @QueryParam("fromdate") String fromdate, @QueryParam("todate") String todate)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
	  logger.error(" globalFundTrendEthicalCount method");
    List<EthicalTrendVO> qualysdata = new ArrayList();
    
    List<CommitTrendVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "dateCreated" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("dateCreated").previousOperation(), Aggregation.sort(Sort.Direction.ASC, new String[] { "dateCreated" }) });
      AggregationResults<EthicalTrendVO> groupResults = getMongoOperation().aggregate(agg, EthicalTrendVO.class, 
        EthicalTrendVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        Date dateString = ((EthicalTrendVO)qualysdata.get(i)).getDateCreated();
        int count = ((EthicalTrendVO)qualysdata.get(i)).getCount();
        CommitTrendVO tctrendvo = new CommitTrendVO(dateString, count);
        trendvolist.add(tctrendvo);
       /* Date date = new Date();
        date = dateString;*/
        /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String str = formatter.format(dateString);*/
      }
      logger.error(" globalFundTrendEthicalCount method"+trendvolist);
      return trendvolist;
    }
//    return trendvolist;
//  }
  
  @GET
  @Path("/ArcherURagencyOverdueOpenRisks")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> ArcherURagencyOverdueOpenRisks(@HeaderParam("Authorization") String authString, @QueryParam("vardtfrom") String vardtfrom)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
  /*  boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      Date startDate = new Date(vardtfrom);
      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
      String strDate = dateFormat.format(startDate);
      List<String> divisionList = new ArrayList();
      divisionList.add("iDashboard");
      divisionList.add("TDM");
      divisionList.add("IOT");
      divisionList.add("QI BOTS");
      divisionList.add("ADPART");
      divisionList.add("Automation");
      divisionList.add("Smart Stub");
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("expirationDate").lt(strDate)), Aggregation.match(Criteria.where("status").ne("X4 Closed")), Aggregation.match(Criteria.where("status").ne("X1 Cancelled")), Aggregation.match(Criteria.where("status").ne("X2 Rejected")), Aggregation.match(Criteria.where("status").ne("X3 Closed - Pending Reacceptance")), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division = ((ArcherDataVO)qualysdata.get(i)).getDivision();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division);
        trendvolist.add(tctrendvo);
      }
      logger.error(" ArcherURagencyOverdueOpenRisks method"+trendvolist);
      return trendvolist;
    }
//    return trendvolist;
//  }
  
  @GET
  @Path("/EthicalURagencyOverdueOpenRisks")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> EthicalURagencyOverdueOpenRisks(@HeaderParam("Authorization") String authString, @QueryParam("vardtfrom") String vardtfrom)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      Date startDate = new Date(vardtfrom);
      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
      String strDate = dateFormat.format(startDate);
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("remediationDueDate").lt(strDate)), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division = ((EthicalHacksVO)qualysdata.get(i)).getDivision();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division);
        trendvolist.add(tctrendvo);
      }
      logger.error(" EthicalURagencyOverdueOpenRisks method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/networkURagencyOverdueOpenRisks")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> networkURagencyOverdueOpenRisks(@HeaderParam("Authorization") String authString, @QueryParam("vardtfrom") String vardtfrom)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
  /*  boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      Date startDate = new Date(vardtfrom);
      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
      String strDate = dateFormat.format(startDate); 
      
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("slaDate").lt(strDate)), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
    		  NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division = ((NetworkPenetrationVO)qualysdata.get(i)).getDivision();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division);
        trendvolist.add(tctrendvo);
      }
      logger.error(" networkURagencyOverdueOpenRisks method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/URagencyOverdueOpenRisksCount")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> URagencyOverdueOpenRisksCount(@HeaderParam("Authorization") String authString, @QueryParam("vardtfrom") String vardtfrom)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<QualysVulnerabiltyVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      Date startDate = new Date(vardtfrom);
      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
      String strDate = dateFormat.format(startDate);
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("slaDate").lt(strDate)), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<QualysVulnerabiltyVO> groupResults = getMongoOperation().aggregate(agg, QualysVulnerabiltyVO.class, 
        QualysVulnerabiltyVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division = ((QualysVulnerabiltyVO)qualysdata.get(i)).getDivision();
        int count = ((QualysVulnerabiltyVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division);
        trendvolist.add(tctrendvo);
      }
      logger.error(" URagencyOverdueOpenRisksCount method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/URagencyOpenRisksByDays")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> URagencyOpenRisksByDays(@HeaderParam("Authorization") String authString, @QueryParam("vardtfrom") String vardtfrom)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<QualysVulnerabiltyVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      Date startDate = new Date(vardtfrom);
      LocalDateTime localDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
      localDateTime = localDateTime.plusYears(0L).plusMonths(0L).plusDays(60L);
      Date currentDatePlusSixtyDay = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
      String strDate = dateFormat.format(currentDatePlusSixtyDay);
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("slaDate").lt(strDate)), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<QualysVulnerabiltyVO> groupResults = getMongoOperation().aggregate(agg, QualysVulnerabiltyVO.class, 
        QualysVulnerabiltyVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division = ((QualysVulnerabiltyVO)qualysdata.get(i)).getDivision();
        int count = ((QualysVulnerabiltyVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division);
        trendvolist.add(tctrendvo);
      }
      logger.error(" URagencyOpenRisksByDays method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/URagencyOpenRisksByDaysArcher")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> URagencyOpenRisksByDaysArcher(@HeaderParam("Authorization") String authString, @QueryParam("vardtfrom") String vardtfrom)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      Date startDate = new Date(vardtfrom);
      LocalDateTime localDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
      localDateTime = localDateTime.plusYears(0L).plusMonths(0L).plusDays(60L);
      Date currentDatePlusSixtyDay = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
      String strDate = dateFormat.format(currentDatePlusSixtyDay);
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("expirationDate").lt(strDate)), Aggregation.match(Criteria.where("status").ne("X4 Closed")), Aggregation.match(Criteria.where("status").ne("X1 Cancelled")), Aggregation.match(Criteria.where("status").ne("X2 Rejected")), Aggregation.match(Criteria.where("status").ne("X3 Closed - Pending Reacceptance")), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division = ((ArcherDataVO)qualysdata.get(i)).getDivision();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division);
        trendvolist.add(tctrendvo);
      }
      logger.error(" URagencyOpenRisksByDaysArcher method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/URagencyOpenRisksByDaysEthical")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> URagencyOpenRisksByDaysEthical(@HeaderParam("Authorization") String authString, @QueryParam("vardtfrom") String vardtfrom)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      Date startDate = new Date(vardtfrom);
      LocalDateTime localDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
      localDateTime = localDateTime.plusYears(0L).plusMonths(0L).plusDays(60L);
      Date currentDatePlusSixtyDay = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
      String strDate = dateFormat.format(currentDatePlusSixtyDay);
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("remediationDueDate").lt(strDate)), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division = ((EthicalHacksVO)qualysdata.get(i)).getDivision();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division);
        trendvolist.add(tctrendvo);
      }
      logger.error(" URagencyOpenRisksByDaysEthical method"+trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/URagencyOpenRisksByDaysNetwork")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> URagencyOpenRisksByDaysNetwork(@HeaderParam("Authorization") String authString, @QueryParam("vardtfrom") String vardtfrom)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      Date startDate = new Date(vardtfrom);
      LocalDateTime localDateTime = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
      localDateTime = localDateTime.plusYears(0L).plusMonths(0L).plusDays(60L);
      Date currentDatePlusSixtyDay = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
      DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
      String strDate = dateFormat.format(currentDatePlusSixtyDay);
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("slaDate").lt(strDate)), Aggregation.group(new String[] { "division" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("division").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
    		  NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String division = ((NetworkPenetrationVO)qualysdata.get(i)).getDivision();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division);
        trendvolist.add(tctrendvo);
      }
      logger.error(" URagencyOpenRisksByDaysNetwork method"+trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/archerByDivision")
  @Produces({"application/json"})
  public List<ArcherDataVO> archerByDivision()
    throws JsonParseException, JsonMappingException, IOException, BaseException, BadLocationException
  {
    List<ArcherDataVO> archerchartdata = null;
    
    String query = "{},{_id:0,division:1,status:1}";
    List<String> divisionList = new ArrayList();
    divisionList.add("iDashboard");
    divisionList.add("TDM");
    divisionList.add("IOT");
    divisionList.add("QI BOTS");
    divisionList.add("ADPART");
    divisionList.add("Automation");
    divisionList.add("Smart Stub");
    
    Query query1 = new BasicQuery(query);
    query1.addCriteria(Criteria.where("division").in(divisionList));
    
    archerchartdata = getMongoOperation().find(query1, ArcherDataVO.class);
    logger.error(" archerByDivision method"+archerchartdata);
    return archerchartdata;
  }
  
  @GET
  @Path("/ethicalHacksFindingsByDivision")
 
  public List<EthicalHacksVO> ethicalHacksFindingsByDivision()
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> ethicalchartdata = null;
    
    String query = "{},{_id:0,division:1,severity:1,remediationStatus:1,dataSteward:1}";
    List<String> divisionList = new ArrayList();
    divisionList.add("iDashboard");
    divisionList.add("TDM");
    divisionList.add("IOT");
    divisionList.add("QI BOTS");
    divisionList.add("ADPART");
    divisionList.add("Automation");
    divisionList.add("Smart Stub");
    
    Query query1 = new BasicQuery(query);
    query1.addCriteria(Criteria.where("division").in(divisionList));
    
    ethicalchartdata = getMongoOperation().find(query1, EthicalHacksVO.class);
    logger.error(" ethicalHacksFindingsByDivision method"+ethicalchartdata);
    return ethicalchartdata;
  }
  
  @GET
  @Path("/networkPenetrationByDivision")
  @Produces({"application/json"})
  public List<NetworkPenetrationVO> networkPenetrationByDivision()
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> networkcharttdata = null;
    
    String query = "{},{_id:0,division:1,severity:1,remediationStatus:1,dataSteward:1}";
    List<String> divisionList = new ArrayList();
    divisionList.add("iDashboard");
    divisionList.add("TDM");
    divisionList.add("IOT");
    divisionList.add("QI BOTS");
    divisionList.add("ADPART");
    divisionList.add("Automation");
    divisionList.add("Smart Stub");
    
    Query query1 = new BasicQuery(query);
    query1.addCriteria(Criteria.where("division").in(divisionList));
    
    networkcharttdata = getMongoOperation().find(query1, NetworkPenetrationVO.class);
    logger.error(" networkPenetrationByDivision method"+  networkcharttdata);
    return networkcharttdata;
  }
  
  @GET
  @Path("/ethicalstatusRowChart")
  @Produces({"application/json"})
  public List<EthicalHacksVO> ethicalstatusRowChart()
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> ethicaldata = null;
    
    String query = "{},{_id:0,division:1,dataSteward:1,remediationStatus:1}";
    
    List<String> divisionList = new ArrayList();
    divisionList.add("iDashboard");
    divisionList.add("TDM");
    divisionList.add("IOT");
    divisionList.add("QI BOTS");
    divisionList.add("ADPART");
    divisionList.add("Automation");
    divisionList.add("Smart Stub");
    
    Query query1 = new BasicQuery(query);
    query1.addCriteria(Criteria.where("division").in(divisionList));
    
    ethicaldata = getMongoOperation().find(query1, EthicalHacksVO.class);
    logger.error(" ethicalstatusRowChart method"+  ethicaldata);
    return ethicaldata;
  }
  
  @GET
  @Path("/archerStatusRowChart")
  @Produces({"application/json"})
  public List<ArcherDataVO> archerStatus()
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> archerdata = null;
    
    String query = "{},{_id:0,division:1,dataSteward:1,status:1}";
    Query query1 = new BasicQuery(query);
    List<String> divisionList = new ArrayList();
    divisionList.add("iDashboard");
    divisionList.add("TDM");
    divisionList.add("IOT");
    divisionList.add("QI BOTS");
    divisionList.add("ADPART");
    divisionList.add("Automation");
    divisionList.add("Smart Stub");
    
    List<String> statusList = new ArrayList();
    statusList.add("08 Exception Approved");
    statusList.add("03 Pending Acceptor Signoff");
    statusList.add("06 Level 2 Review");
    statusList.add("02 Pending Assessor Signoff");
    statusList.add("M1 Pending Mitigation");
    statusList.add("01 Draft");
    statusList.add("D1 In Delegator Review");
    statusList.add("03.3 Quality Check");
    statusList.add("02.3 Regional Governance");
    statusList.add("04 Pending Sector Head Signoff");
    statusList.add("04 Pending GISO Signoff");
    statusList.add("06 Pending RMSC Signoff");
    statusList.add("M2 Pending Mitigation Approval");
    statusList.add("05 Level 1 Review");
    statusList.add("M3 Mitigation Not Accepted");
    statusList.add("05 Pending CTSD EC Signoff");
    
    query1.addCriteria(Criteria.where("status").in(statusList)).addCriteria(Criteria.where("division").in(divisionList));
    archerdata = getMongoOperation().find(query1, ArcherDataVO.class);
    logger.error(" archerStatusRowChart method"+  archerdata);
    return archerdata;
  }
  
  @GET
  @Path("/qualysVulnerabilitiesByDivisionChart")
  @Produces({"application/json"})
  public List<QualysVulnerabiltyVO> qualysVulnerabilitiesByDivisionChart()
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<QualysVulnerabiltyVO> qualysdata = null;
    
    String query = "{},{_id:0,division:1,dataSteward:1}";
    List<String> divisionList = new ArrayList();
    divisionList.add("iDashboard");
    divisionList.add("TDM");
    divisionList.add("IOT");
    divisionList.add("QI BOTS");
    divisionList.add("ADPART");
    divisionList.add("Automation");
    divisionList.add("Smart Stub");
    
    Query query1 = new BasicQuery(query);
    query1.addCriteria(Criteria.where("division").in(divisionList));
    
    qualysdata = getMongoOperation().find(query1, QualysVulnerabiltyVO.class);
    logger.error(" qualysVulnerabilitiesByDivisionChart method"+  qualysdata);
    return qualysdata;
  }
  
  @GET
  @Path("/usAgencyArcherCriticalHighByDivision")
  @Produces({"application/json"})
  public List<ArcherHighCriticalVO> usAgencyArcherCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
   
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<ArcherHighCriticalVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "businessRisk" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("businessRisk").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String riskClass = ((ArcherDataVO)qualysdata.get(i)).getBusinessRisk();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        ArcherHighCriticalVO tctrendvo = new ArcherHighCriticalVO(riskClass, count);
        trendvolist.add(tctrendvo);
      }
      logger.error(" usAgencyArcherCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/subAccountingArcherCriticalHighByDivision")
  @Produces({"application/json"})
  public List<ArcherHighCriticalVO> subAccountingArcherCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<ArcherHighCriticalVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "businessRisk" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("businessRisk").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String riskClass = ((ArcherDataVO)qualysdata.get(i)).getBusinessRisk();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        ArcherHighCriticalVO tctrendvo = new ArcherHighCriticalVO(riskClass, count);
        trendvolist.add(tctrendvo);
      }
      logger.error(" subAccountingArcherCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/onCoreArcherCriticalHighByDivision")
  @Produces({"application/json"})
  public List<ArcherHighCriticalVO> onCoreArcherCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<ArcherHighCriticalVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "businessRisk" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("businessRisk").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String riskClass = ((ArcherDataVO)qualysdata.get(i)).getBusinessRisk();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        ArcherHighCriticalVO tctrendvo = new ArcherHighCriticalVO(riskClass, count);
        trendvolist.add(tctrendvo);
      }
      logger.error(" onCoreArcherCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/emeaArcherCriticalHighByDivision")
  @Produces({"application/json"})
  public List<ArcherHighCriticalVO> emeaArcherCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<ArcherHighCriticalVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
//    boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
//    if (RiskComplianceLayerAccess)
//    {
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "businessRisk" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("businessRisk").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String riskClass = ((ArcherDataVO)qualysdata.get(i)).getBusinessRisk();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        ArcherHighCriticalVO tctrendvo = new ArcherHighCriticalVO(riskClass, count);
        trendvolist.add(tctrendvo);
      }
      logger.error(" emeaArcherCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/giarsArcherCriticalHighByDivision")
  @Produces({"application/json"})
  public List<ArcherHighCriticalVO> giarsArcherCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<ArcherHighCriticalVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "businessRisk" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("businessRisk").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String riskClass = ((ArcherDataVO)qualysdata.get(i)).getBusinessRisk();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        ArcherHighCriticalVO tctrendvo = new ArcherHighCriticalVO(riskClass, count);
        trendvolist.add(tctrendvo);
      }
      logger.error(" giarsArcherCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   
  
  @GET
  @Path("/alternativeArcherCriticalHighByDivision")
  @Produces({"application/json"})
  public List<ArcherHighCriticalVO> alternativeArcherCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<ArcherHighCriticalVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "businessRisk" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("businessRisk").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String riskClass = ((ArcherDataVO)qualysdata.get(i)).getBusinessRisk();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        ArcherHighCriticalVO tctrendvo = new ArcherHighCriticalVO(riskClass, count);
        trendvolist.add(tctrendvo);
      }
      logger.error(" alternativeArcherCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/globalArcherCriticalHighByDivision")
  @Produces({"application/json"})
  public List<ArcherHighCriticalVO> globalArcherCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<ArcherDataVO> qualysdata = new ArrayList();
    
    List<ArcherHighCriticalVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "businessRisk" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("businessRisk").previousOperation() });
      AggregationResults<ArcherDataVO> groupResults = getMongoOperation().aggregate(agg, ArcherDataVO.class, 
        ArcherDataVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        String riskClass = ((ArcherDataVO)qualysdata.get(i)).getBusinessRisk();
        int count = ((ArcherDataVO)qualysdata.get(i)).getCount();
        ArcherHighCriticalVO tctrendvo = new ArcherHighCriticalVO(riskClass, count);
        trendvolist.add(tctrendvo);
      }
      logger.error(" globalArcherCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/subaccountingEthicalCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> subaccountingEthicalCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((EthicalHacksVO)qualysdata.get(i)).getSeverity();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" subaccountingEthicalCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
  /*  return trendvolist;
  }*/
  
  @GET
  @Path("/usAgencyEthicalCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> usAgencyEthicalCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((EthicalHacksVO)qualysdata.get(i)).getSeverity();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" usAgencyEthicalCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/oncoreEthicalCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> oncoreEthicalCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((EthicalHacksVO)qualysdata.get(i)).getSeverity();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" oncoreEthicalCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/alternativeEthicalCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> alternativeEthicalCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((EthicalHacksVO)qualysdata.get(i)).getSeverity();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" alternativeEthicalCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/giarsEthicalCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> giarsEthicalCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((EthicalHacksVO)qualysdata.get(i)).getSeverity();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" giarsEthicalCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/emeaEthicalCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> emeaEthicalCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((EthicalHacksVO)qualysdata.get(i)).getSeverity();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" emeaEthicalCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }
  */
  @GET
  @Path("/globalEthicalCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> globalEthicalCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<EthicalHacksVO> groupResults = getMongoOperation().aggregate(agg, EthicalHacksVO.class, 
        EthicalHacksVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((EthicalHacksVO)qualysdata.get(i)).getSeverity();
        int count = ((EthicalHacksVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" globalEthicalCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/usAgencyNetworkCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> usAgencyNetworkCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
    		  NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((NetworkPenetrationVO)qualysdata.get(i)).getSeverity();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" usAgencyNetworkCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/subaccountingNetworkCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> subaccountingNetworkCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
    /*boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
        NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((NetworkPenetrationVO)qualysdata.get(i)).getSeverity();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" subaccountingNetworkCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/oncoreNetworkCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> oncoreNetworkCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
        NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((NetworkPenetrationVO)qualysdata.get(i)).getSeverity();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" oncoreNetworkCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/alternativeNetworkCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> alternativeNetworkCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
        NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((NetworkPenetrationVO)qualysdata.get(i)).getSeverity();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" alternativeNetworkCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/giarsNetworkCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> giarsNetworkCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
        NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((NetworkPenetrationVO)qualysdata.get(i)).getSeverity();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" giarsNetworkCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
   /* return trendvolist;
  }*/
  
  @GET
  @Path("/emeaNetworkCriticalHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> emeaNetworkCriticalHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
        NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((NetworkPenetrationVO)qualysdata.get(i)).getSeverity();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" emeaNetworkCriticalHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/globalNetworkHighByDivision")
  @Produces({"application/json"})
  public List<EthicalCriticalHighVO> globalNetworkHighByDivision(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<NetworkPenetrationVO> qualysdata = new ArrayList();
    
    List<EthicalCriticalHighVO> trendvolist = null;
    AuthenticationService UserEncrypt = new AuthenticationService();
   /* boolean RiskComplianceLayerAccess = UserEncrypt.checkRiskComplianceLayerAccess(authString);
    if (RiskComplianceLayerAccess)
    {*/
      trendvolist = new ArrayList();
      
      Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] { Aggregation.match(Criteria.where("division").is(division)), Aggregation.group(new String[] { "severity" }).count().as("count"), Aggregation.project(new String[] { "count" }).and("severity").previousOperation() });
      AggregationResults<NetworkPenetrationVO> groupResults = getMongoOperation().aggregate(agg, NetworkPenetrationVO.class, 
        NetworkPenetrationVO.class);
      qualysdata = groupResults.getMappedResults();
      for (int i = 0; i < qualysdata.size(); i++)
      {
        long severity = ((NetworkPenetrationVO)qualysdata.get(i)).getSeverity();
        int count = ((NetworkPenetrationVO)qualysdata.get(i)).getCount();
        EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, severity);
        trendvolist.add(tctrendvo);
      }
      logger.error(" globalNetworkHighByDivision method"+  trendvolist);
      return trendvolist;
    }
    /*return trendvolist;
  }*/
  
  @GET
  @Path("/usAgencyEthicalDetails")
  @Produces({"application/json"})
  public List<EthicalHacksVO> usAgencyEthicalDetails(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> usAgencylist = null;
    AuthenticationService AuthServ = new AuthenticationService();
    
    usAgencylist = new ArrayList();
    String sizequery = "{},{_id:0,division:1}";
    Query query = new BasicQuery(sizequery);
    query.addCriteria(Criteria.where("division").is(division));
    
    usAgencylist = getMongoOperation().find(query, EthicalHacksVO.class);
    logger.error(" usAgencyEthicalDetails method"+  usAgencylist);

    return usAgencylist;
  }
  
  @GET
  @Path("/subAccountingEthicalDetails")
  @Produces({"application/json"})
  public List<EthicalHacksVO> subAccountingEthicalDetails(@HeaderParam("Authorization") String authString, @QueryParam("division") String division)
    throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException, BadLocationException
  {
    List<EthicalHacksVO> subAccountinglist = null;
    AuthenticationService AuthServ = new AuthenticationService();
    
    subAccountinglist = new ArrayList();
    String sizequery = "{},{_id:0,division:1}";
    Query query = new BasicQuery(sizequery);
    query.addCriteria(Criteria.where("division").is(division));
    
    subAccountinglist = getMongoOperation().find(query, EthicalHacksVO.class);
    logger.error(" subAccountingEthicalDetails method"+  subAccountinglist);
    
    return subAccountinglist;
  }
}
