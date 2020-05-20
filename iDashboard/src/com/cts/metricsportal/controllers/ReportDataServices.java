package com.cts.metricsportal.controllers;

import org.apache.log4j.Logger;

import java.io.IOException;
import java.util.ArrayList;
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
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.cts.metricsportal.RestAuthenticationFilter.AuthenticationService;
import com.cts.metricsportal.util.BaseException;
import com.cts.metricsportal.util.IdashboardConstantsUtil;
import com.cts.metricsportal.util.PropertyManager;
import com.cts.metricsportal.vo.ArcherDataVO;
import com.cts.metricsportal.vo.EthicalCriticalHighVO;
import com.cts.metricsportal.vo.TDMDataVO;

@Path("/reportDataServices")
public class ReportDataServices extends BaseMongoOperation {

	static final Logger logger = Logger.getLogger(ReportDataServices.class);

	/* @SuppressWarnings("unchecked") */
	@GET
	@Path("/getverticalData")
	@Produces(MediaType.APPLICATION_JSON)
	public String[] getverticaldata() throws Exception {
		String vertical = IdashboardConstantsUtil.NULL;
		if (vertical == null) {
			try {
				vertical = PropertyManager.getProperty("Vertical", "properties/reportData.properties");
			} catch (Exception e) {
				logger.error("vertical" + e.getMessage());
			}
		}

		String[] verticallist = null;
		if(vertical!=null)
		verticallist = vertical.split(",");

		return verticallist;

	}

	/*
	 * @GET
	 * 
	 * @Path("/getverticalData")
	 * 
	 * @Produces(MediaType.APPLICATION_JSON) public List<String>
	 * getgittypes(@HeaderParam("Authorization") String authString ) throws
	 * JsonParseException, JsonMappingException, IOException,
	 * NumberFormatException, BaseException, BadLocationException { List<String>
	 * verticallist = new ArrayList<String>(); AuthenticationService UserEncrypt
	 * = new AuthenticationService(); String userId =
	 * UserEncrypt.getUser(authString); boolean LCAccess =
	 * UserEncrypt.checkLCLayerAccess(authString); if(LCAccess){ verticallist =
	 * getMongoOperation().getCollection("TDMdata") .distinct("vertical");
	 * return verticallist;} else{ return verticallist; } }
	 */

	@GET
	@Path("/getGeoDropData")
	@Produces(MediaType.APPLICATION_JSON)

	public String[] getGeoDropData() throws Exception {
		String Geo = "";
			try {
				Geo = PropertyManager.getProperty("Geo", "properties/reportData.properties");
			} catch (Exception e) {
				logger.error("vertical" + e.getMessage());
			}
		

		String[] geolist;
		geolist = Geo.split(",");

		return geolist;

	}

	@GET
	@Path("/getTypeofSupportData")
	@Produces(MediaType.APPLICATION_JSON)

	public String[] getTypeofSupportData() throws Exception {
		String TypeOfSupport = "";
		
			TypeOfSupport = PropertyManager.getProperty("TypeOfSupport", "properties/reportData.properties");
		

		String[] supportdatalist;
		supportdatalist = TypeOfSupport.split(",");

		return supportdatalist;

	}

	@GET
	@Path("/getCoETrackData")
	@Produces(MediaType.APPLICATION_JSON)
	public String[] getCoETrackData() throws Exception {
		String CoETrack = IdashboardConstantsUtil.NULL;
		if (CoETrack == null) {
			CoETrack = PropertyManager.getProperty("CoETrack", "properties/reportData.properties");
		}
		String[] coEdatalist;
		coEdatalist = CoETrack.split(",");
		return coEdatalist;
	}

	@GET
	@Path("/getHighImpactData")
	@Produces(MediaType.APPLICATION_JSON)
	public String[] getHighImpactData() throws Exception {
		String highImpact = IdashboardConstantsUtil.NULL;
		if (highImpact == null) {
			highImpact = PropertyManager.getProperty("highImpact", "properties/reportData.properties");
		}

		String[] impactdatalist;
		impactdatalist = highImpact.split(",");
		return impactdatalist;
	}

	@GET
	@Path("/getTDMTableData")
	@Produces(MediaType.APPLICATION_JSON)

	public List<TDMDataVO> getTDMTableData(@HeaderParam("Authorization") String authString,
			@QueryParam("Vertical") String Vertical, @QueryParam("Geo") String Geo,
			@QueryParam("isItAHighiImpactContribution") String isItAHighiImpactContribution,
			@QueryParam("typeOfSupport") String typeOfSupport, @QueryParam("coETrack") String coETrack,
			@QueryParam("start_index") int start_index, @QueryParam("itemsPerPage") int itemsPerPage)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {

		List<TDMDataVO> TDMdata = null;
		/*
		 * long count = 0;
		 */
		AuthenticationService UserEncrypt = new AuthenticationService();
		boolean LCAccess = UserEncrypt.checkLCLayerAccess(authString);
		TDMdata = new ArrayList<TDMDataVO>();
		Query query1 = new Query();
		if (!Vertical.equalsIgnoreCase("undefined")) {
			query1.addCriteria(Criteria.where("vertical").is(Vertical));
		}
		if (!Geo.equalsIgnoreCase("undefined")) {
			query1.addCriteria(Criteria.where("geo").is(Geo));
		}
		if (!isItAHighiImpactContribution.equalsIgnoreCase("undefined")) {
			query1.addCriteria(Criteria.where("highImpactContribution").is(isItAHighiImpactContribution));
		}
		if (!typeOfSupport.equalsIgnoreCase("undefined")) {
			query1.addCriteria(Criteria.where("typeOfSupport").is(typeOfSupport));
		}
		if (!coETrack.equalsIgnoreCase("undefined")) {
			query1.addCriteria(Criteria.where("coETrack").is(coETrack));
		}
		query1.skip(itemsPerPage * (start_index - 1));
		query1.limit(itemsPerPage);

		TDMdata = getMongoOperation().find(query1, TDMDataVO.class);
		/* count= TDMdata.size(); */
		/* System.out.println("counnt"+count); */
		if (TDMdata.isEmpty()) {
			logger.error("TDM" + TDMdata);
			TDMdata = null;
			return TDMdata;
		} else {
			logger.error("tdm" + TDMdata);
			return TDMdata;

		}
	}

	// vertical selection

	/*
	 * @GET
	 * 
	 * @Path("/getVerticalTableData")
	 * 
	 * @Produces(MediaType.APPLICATION_JSON)
	 * 
	 * public List<TDMDataVO>
	 * getVerticalTableData( @HeaderParam("Authorization") String authString,
	 * 
	 * @QueryParam("Vertical") String Vertical,
	 * 
	 * @QueryParam("Geo") String Geo,
	 * 
	 * @QueryParam("isItAHighiImpactContribution") String
	 * isItAHighiImpactContribution,
	 * 
	 * @QueryParam("typeOfSupport") String typeOfSupport,
	 * 
	 * @QueryParam("coETrack") String coETrack) throws JsonParseException,
	 * JsonMappingException, IOException, NumberFormatException, BaseException,
	 * BadLocationException{
	 * 
	 * System.out.println("vertiiigg"); List<TDMDataVO> TDMdata = null;
	 * 
	 * 
	 * 
	 * AuthenticationService UserEncrypt = new AuthenticationService(); boolean
	 * LCAccess = UserEncrypt.checkLCLayerAccess(authString); TDMdata= new
	 * ArrayList<TDMDataVO>(); Query query1 = new Query(); if(Vertical!="null"){
	 * query1.addCriteria(Criteria.where("vertical").is(Vertical)); } TDMdata =
	 * getMongoOperation().find(query1,TDMDataVO .class); if(TDMdata.isEmpty()){
	 * System.out.println("TDM"+TDMdata); TDMdata=null; return TDMdata; } else{
	 * System.out.println("tdm"+TDMdata); return TDMdata;
	 * 
	 * } }
	 * 
	 * 
	 */

	// csv table details
	@GET
	@Path("/csvTableDetail")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TDMDataVO> getCsvTableDetails(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<TDMDataVO> tdminfoo = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = AuthServ.checkAdminUser(authString);

		tdminfoo = new ArrayList<TDMDataVO>();
		String sizequery = "{},{_id:0,userId:1}";
		Query query = new BasicQuery(sizequery);

		tdminfoo = getMongoOperation().find(query, TDMDataVO.class);
		/* if(tdminfoo.) */
		/* tdminfoo.remove('='); */
		logger.error("tdd" + tdminfoo);
		return tdminfoo;

	}

	// table details on page load

	@GET
	@Path("/tdmtable")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TDMDataVO> getTdmTableInfo(@HeaderParam("Authorization") String authString,
			@QueryParam("itemsPerPage") int itemsPerPage, @QueryParam("start_index") int start_index)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<TDMDataVO> tdminfo = null;
		AuthenticationService AuthServ = new AuthenticationService();
		boolean adminstatus = AuthServ.checkAdminUser(authString);

		tdminfo = new ArrayList<TDMDataVO>();
		String sizequery = "{},{_id:0,userId:1}";
		Query query = new BasicQuery(sizequery);
		query.skip(itemsPerPage * (start_index - 1));
		query.limit(itemsPerPage);

		tdminfo = getMongoOperation().find(query, TDMDataVO.class);
		logger.error("tdd" + tdminfo);
		return tdminfo;

	}

	// pagination count

	@GET
	@Path("/ReportDetailsCount")
	@Produces(MediaType.APPLICATION_JSON)
	public long dashboardTableRecordsCount(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService AuthServ = new AuthenticationService();

		boolean adminstatus = AuthServ.checkAdminUser(authString);
		long count = 0;

		String sizequery1 = "{},{_id:0,userId:1}";
		Query query = new BasicQuery(sizequery1);

		count = getMongoOperation().count(query1, TDMDataVO.class);
		logger.error("count" + count);
		return count;

	}

	@GET
	@Path("/ReportDetailsCounts")
	@Produces(MediaType.APPLICATION_JSON)
	public long dashboardTableRecordsCounts(@HeaderParam("Authorization") String authString,
			@QueryParam("Vertical") String Vertical, @QueryParam("Geo") String Geo,
			@QueryParam("isItAHighiImpactContribution") String isItAHighiImpactContribution,
			@QueryParam("typeOfSupport") String typeOfSupport, @QueryParam("coETrack") String coETrack)
			throws JsonParseException, JsonMappingException, IOException, BadLocationException {
		Query query1 = new Query();
		AuthenticationService AuthServ = new AuthenticationService();

		boolean adminstatus = AuthServ.checkAdminUser(authString);
		long count = 0;

		String sizequery1 = "{},{_id:0,userId:1}";
		Query query = new BasicQuery(sizequery1);
		if (!Vertical.equalsIgnoreCase("undefined")) {
			query.addCriteria(Criteria.where("vertical").is(Vertical));
		}
		if (!Geo.equalsIgnoreCase("undefined")) {
			query.addCriteria(Criteria.where("geo").is(Geo));
		}
		if (!isItAHighiImpactContribution.equalsIgnoreCase("undefined")) {
			query.addCriteria(Criteria.where("highImpactContribution").is(isItAHighiImpactContribution));
		}
		if (!typeOfSupport.equalsIgnoreCase("undefined")) {
			query.addCriteria(Criteria.where("typeOfSupport").is(typeOfSupport));
		}
		if (!coETrack.equalsIgnoreCase("undefined")) {
			query.addCriteria(Criteria.where("coETrack").is(coETrack));
		}

		count = getMongoOperation().count(query, TDMDataVO.class);
		logger.error("count" + count);
		return count;

	}

	// coEDashboardChart View

	@GET
	@Path("/typeOfSupport")
	@Produces({ "application/json" })
	public List<EthicalCriticalHighVO> typeOfSupport(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<TDMDataVO> qualysdata = new ArrayList();

		List<EthicalCriticalHighVO> trendvolist = null;
		AuthenticationService UserEncrypt = new AuthenticationService();
		/*
		 * boolean RiskComplianceLayerAccess =
		 * UserEncrypt.checkRiskComplianceLayerAccess(authString); if
		 * (RiskComplianceLayerAccess) {
		 */
		trendvolist = new ArrayList();

		Aggregation agg = Aggregation.newAggregation(
				new AggregationOperation[] { Aggregation.group(new String[] { "typeOfSupport" }).count().as("count"),
						Aggregation.project(new String[] { "count" }).and("typeOfSupport").previousOperation() });
		AggregationResults<TDMDataVO> groupResults = getMongoOperation().aggregate(agg, TDMDataVO.class,
				TDMDataVO.class);
		qualysdata = groupResults.getMappedResults();
		for (int i = 0; i < qualysdata.size(); i++) {
			String division1 = ((TDMDataVO) qualysdata.get(i)).getTypeOfSupport();
			int count = ((TDMDataVO) qualysdata.get(i)).getCount();
			EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
			trendvolist.add(tctrendvo);
		}
		return trendvolist;
	}

	@GET
	@Path("/coeChart")
	@Produces({ "application/json" })
	public List<EthicalCriticalHighVO> coeChart(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<TDMDataVO> qualysdata = new ArrayList();

		List<EthicalCriticalHighVO> trendvolist = null;
		AuthenticationService UserEncrypt = new AuthenticationService();
		/*
		 * boolean RiskComplianceLayerAccess =
		 * UserEncrypt.checkRiskComplianceLayerAccess(authString); if
		 * (RiskComplianceLayerAccess) {
		 */
		trendvolist = new ArrayList();

		Aggregation agg = Aggregation.newAggregation(
				new AggregationOperation[] { Aggregation.group(new String[] { "coETrack" }).count().as("count"),
						Aggregation.project(new String[] { "count" }).and("coETrack").previousOperation() });
		AggregationResults<TDMDataVO> groupResults = getMongoOperation().aggregate(agg, TDMDataVO.class,
				TDMDataVO.class);
		qualysdata = groupResults.getMappedResults();
		for (int i = 0; i < qualysdata.size(); i++) {
			String division1 = ((TDMDataVO) qualysdata.get(i)).getCoETrack();
			int count = ((TDMDataVO) qualysdata.get(i)).getCount();
			EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
			trendvolist.add(tctrendvo);
		}
		return trendvolist;
	}

	@GET
	@Path("/supportGroup")
	@Produces({ "application/json" })
	public List<EthicalCriticalHighVO> supportGroup(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<String> divisionList = new ArrayList();
		divisionList.add("Support");
		divisionList.add("Mind share");
		divisionList.add("Proposals");
		divisionList.add("Products");

		List<TDMDataVO> qualysdata = new ArrayList();

		List<EthicalCriticalHighVO> trendvolist = null;
		AuthenticationService UserEncrypt = new AuthenticationService();
		/*
		 * boolean RiskComplianceLayerAccess =
		 * UserEncrypt.checkRiskComplianceLayerAccess(authString); if
		 * (RiskComplianceLayerAccess) {
		 */
		trendvolist = new ArrayList();

		Aggregation agg = Aggregation.newAggregation(
				new AggregationOperation[] { Aggregation.match(Criteria.where("supportGroup").in(divisionList)),
						Aggregation.group(new String[] { "supportGroup" }).count().as("count"),
						Aggregation.project(new String[] { "count" }).and("supportGroup").previousOperation() });
		AggregationResults<TDMDataVO> groupResults = getMongoOperation().aggregate(agg, TDMDataVO.class,
				TDMDataVO.class);
		qualysdata = groupResults.getMappedResults();
		for (int i = 0; i < qualysdata.size(); i++) {
			String division1 = ((TDMDataVO) qualysdata.get(i)).getSupportGroup();
			int count = ((TDMDataVO) qualysdata.get(i)).getCount();
			EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
			trendvolist.add(tctrendvo);
		}
		return trendvolist;
	}

	@GET
	@Path("/geoChart")
	@Produces({ "application/json" })
	public List<EthicalCriticalHighVO> geoChart(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<TDMDataVO> qualysdata = new ArrayList();

		List<EthicalCriticalHighVO> trendvolist = null;
		AuthenticationService UserEncrypt = new AuthenticationService();
		/*
		 * boolean RiskComplianceLayerAccess =
		 * UserEncrypt.checkRiskComplianceLayerAccess(authString); if
		 * (RiskComplianceLayerAccess) {
		 */
		trendvolist = new ArrayList();

		Aggregation agg = Aggregation.newAggregation(
				new AggregationOperation[] { Aggregation.group(new String[] { "geo" }).count().as("count"),
						Aggregation.project(new String[] { "count" }).and("geo").previousOperation() });
		AggregationResults<TDMDataVO> groupResults = getMongoOperation().aggregate(agg, TDMDataVO.class,
				TDMDataVO.class);
		qualysdata = groupResults.getMappedResults();
		for (int i = 0; i < qualysdata.size(); i++) {
			String division1 = ((TDMDataVO) qualysdata.get(i)).getGeo();
			int count = ((TDMDataVO) qualysdata.get(i)).getCount();
			EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
			trendvolist.add(tctrendvo);
		}
		return trendvolist;
	}

	@GET
	@Path("/impactChart")
	@Produces({ "application/json" })
	public List<EthicalCriticalHighVO> impactChart(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<TDMDataVO> qualysdata = new ArrayList();

		List<EthicalCriticalHighVO> trendvolist = null;
		AuthenticationService UserEncrypt = new AuthenticationService();
		/*
		 * boolean RiskComplianceLayerAccess =
		 * UserEncrypt.checkRiskComplianceLayerAccess(authString); if
		 * (RiskComplianceLayerAccess) {
		 */
		trendvolist = new ArrayList();

		Aggregation agg = Aggregation.newAggregation(new AggregationOperation[] {
				Aggregation.group(new String[] { "highImpactContribution" }).count().as("count"),
				Aggregation.project(new String[] { "count" }).and("highImpactContribution").previousOperation() });
		AggregationResults<TDMDataVO> groupResults = getMongoOperation().aggregate(agg, TDMDataVO.class,
				TDMDataVO.class);
		qualysdata = groupResults.getMappedResults();
		for (int i = 0; i < qualysdata.size(); i++) {
			String division1 = ((TDMDataVO) qualysdata.get(i)).getHighImpactContribution();
			int count = ((TDMDataVO) qualysdata.get(i)).getCount();
			EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
			trendvolist.add(tctrendvo);
		}
		return trendvolist;
	}

	@GET
	@Path("/verticalChart")
	@Produces({ "application/json" })
	public List<EthicalCriticalHighVO> verticalChart(@HeaderParam("Authorization") String authString)
			throws JsonParseException, JsonMappingException, IOException, NumberFormatException, BaseException,
			BadLocationException {
		List<TDMDataVO> qualysdata = new ArrayList();

		List<EthicalCriticalHighVO> trendvolist = null;
		AuthenticationService UserEncrypt = new AuthenticationService();
		/*
		 * boolean RiskComplianceLayerAccess =
		 * UserEncrypt.checkRiskComplianceLayerAccess(authString); if
		 * (RiskComplianceLayerAccess) {
		 */
		trendvolist = new ArrayList();

		Aggregation agg = Aggregation.newAggregation(
				new AggregationOperation[] { Aggregation.group(new String[] { "vertical" }).count().as("count"),
						Aggregation.project(new String[] { "count" }).and("vertical").previousOperation() });
		AggregationResults<TDMDataVO> groupResults = getMongoOperation().aggregate(agg, TDMDataVO.class,
				TDMDataVO.class);
		qualysdata = groupResults.getMappedResults();
		for (int i = 0; i < qualysdata.size(); i++) {
			String division1 = ((TDMDataVO) qualysdata.get(i)).getVertical();
			int count = ((TDMDataVO) qualysdata.get(i)).getCount();
			EthicalCriticalHighVO tctrendvo = new EthicalCriticalHighVO(count, division1);
			trendvolist.add(tctrendvo);
		}
		return trendvolist;
	}

	/*
	 * @GET
	 * 
	 * @Path("/coEDashboardChartView")
	 * 
	 * @Produces(MediaType.APPLICATION_JSON) public List<TDMDataVO>
	 * getCoEDashboardChartView() throws JsonParseException,
	 * JsonMappingException, IOException, NumberFormatException, BaseException,
	 * BadLocationException {
	 * 
	 * List<TDMDataVO> tdmchartdata = null;
	 * 
	 * String query =
	 * "{},{_id:0,vertical:1,customer:1,geo:1,typeOfSupport:1,verticalPOC:1,coETrack:1,comments:1,highImpactContribution:1,month:1,emailCommunicationDates:1,supportGroup:1,solutionTrack:1}";
	 * Query query1 = new BasicQuery(query);
	 * 
	 * tdmchartdata = getMongoOperation().find(query1, TDMDataVO.class);
	 * 
	 * //System.out.println("Report Services : " + tdmdata);
	 * 
	 * return tdmchartdata;
	 * 
	 * }
	 */

}
