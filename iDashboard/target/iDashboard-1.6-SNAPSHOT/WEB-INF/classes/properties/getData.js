function getData(keyword)
{
	
	var dataOut = {};
	var datacountList = [];
	var temp = [];
	var tempType = "";

	temp = getDataCountByObject(keyword);

	if(temp != null && temp.length>0) {
		tempType = "Object";
		//datacountList.push(temp);
	}


	temp = getDataCountById(keyword);

	if(temp != null && temp.length>0) {
	
		if(tempType == "") {
			tempType = "Value";
		}else {
			datacountList = datacountList.concat(temp);
		}
	}
	
	temp = getDataCountByAttribute(keyword);  
	if(temp != null && temp.length>0) {
	
		if(tempType == "") {
			tempType = "Attribute";
		}else {

			datacountList = datacountList.concat(temp);
            
		}
	}	
    
	dataOut.countSet = datacountList;

	if (tempType != "") {
	
      
		if(tempType == "Object") {
			temp = getDataByObject(keyword);
        
			temp = getIndividualData(temp, dataOut);
			dataOut.aggregate = aggregate(temp);
          
		}
      
		if(tempType == "Value") {
			temp = getDataById(keyword);
			temp = getIndividualData(temp, dataOut);
			dataOut.aggregate = aggregate(temp);
		}
		if(tempType == "Attribute") {

			temp = getDataByAttribute(keyword);
			temp = getIndividualData(temp, dataOut);
			dataOut.aggregate = aggregate(temp);
		}
	}
	

	//alert(JSON.stringify(aggdata));
		
	g.Emit(dataOut);
}

function readRelatedData(data)
{
	return getAttributeValueCount(data);
}

function getAttributeValueCount(data)
{
	var type=g.V(data.type).In("alias").ToValue();
	var json=g.V(data.id).Out("is a").Is(type).Out("relation").ToArray();
	var finalJson={}, array=[];
	json.forEach(function(relation){	
		finalJson = generateJsonCount(g.V(data.id).Out(relation),relation);
		finalJson.src = data.id;
		finalJson.srcType=data.type;
		array.push(finalJson);
	});
	
	json=g.V(data.id).Out("is a").Has("of type","Attribute").Union(g.V(data.id).In("is a").Has("of type","Property")).ToArray();

	json.forEach(function(relation){
		finalJson = generateJsonCount(g.V(data.id).In(relation),relation);
		finalJson.src = data.id;
		finalJson.srcType=data.type;
		array.push(finalJson);
	});
 
	return array;
}

function generateJsonCount(node,rel)
{
	var fJson={};
	fJson.count=node.ToArray().length;
	fJson.relation=rel;
	fJson.type=node.Out("is a").ToValue();
	fJson.classification=node.Out("is a").Out("of type").ToValue();
	
	return fJson;
}


function getIndividualData(data, finalJson) {

var checkData = [], jsonData={}, countedData=[], id=[], type=[];
var summary = {}, relation=[],groupAttributes=[],linkedObjects=[];
var tempsum = {};
var nm;

  
data.forEach(function(json){

	id = _.union(id,json[json.typeCategory]);
	type = _.union(type,json.typeCategory);
	
});

if ((id.length == 1)&&(type.length == 1)) {
	jsonData.id=id[0];
	jsonData.type=type[0];
	countedData = readRelatedData(jsonData);

  prepareSummary(summary,data);
  data=[];
	//step 1: get count =1 and value for relations "not object type"
	countedData.forEach(function(countSet){
		if((countSet.count==1)&&(countSet.classification!="Object"))
		{
			//for future use
			relation.push(countSet.relation);
		}
		//pass above data to the below function
		//step 2) count>1 and value for relations "not object type"
		
		//data from above step, change typeCategory to "direct" and change the object type to the data of typecategory
		//concat above data inside data variable
		if((countSet.count>1)&&(countSet.classification!="Object"))
		{
			groupAttributes.push(countSet);
		}
		//step 3) get attribute of object type and then get values of those attributes using filter (id and object type and then relation)
		
		//data from above step, change typeCategory to "relation" and change the object type to the data of typecategory
		//concat above data inside data variable
		if(countSet.classification=="Object")
		{
			linkedObjects.push(countSet);
		}
	});//g.Emit(linkedObjects);
	var odata = addObjectData(linkedObjects);
	var adata = addAttData(groupAttributes);
	data = data.concat(odata);
	data = data.concat(adata);
	//g.Emit(odata)

}
 

  finalJson.summary = summary;
  return data;
}

function addObjectData(data)
{
	var array=[], tempArray=[], arraySet=[];
	data.forEach(function(json) {
		tempArray=g.V(json.src).Both(json.relation).ToArray();
		tempArray.forEach(function(val){
			arraySet = getIdData(val,json.type);
			arraySet.forEach(function(d){
				d.groupCategory = getAlias(json.relation);
			});
          array = array.concat(arraySet);
		});
	});
	return array;
}

function addAttData(data)
{
	var array=[], tempJson={}, tempArray=[];
	data.forEach(function(json){
		tempArray.g.V(json.src).Has("is a",json.srcType).Out(json.relation).ToArray();
		tempArray.forEach(function(val){
			tempJson[getAlias(json.srcType)]=json.src;
			tempJson.key = getAlias(json.relation);
			tempJson.typeCategory = getAlias(json.srcType);
			tempJson.value = val; 
          array.push(tempJson);
		});
	});
  return array;
}

function prepareSummary(summary, data)
{
	summary[data[0].typeCategory]=data[0][data[0].typeCategory];
	data.forEach(function(jsonobj){
		data.forEach(function(jsonobj){
			summary[jsonobj.key]=jsonobj.value;      
		});
	});
}

function aggregate(data) {
  //g.Emit(data);
var aggjson = {};
var checkData = [];
var aggdata={}; 

data.forEach(function(json){

	aggjson = {};
	
		if(aggdata[json.typeCategory] == undefined ) {
      
			aggdata[json.typeCategory] = {};
			aggjson = aggdata[json.typeCategory];
			aggjson.total = 0;
			aggjson.distribution = {};
			aggjson.distribution[json.groupCategory] = {};
			
		}else {
			aggjson = aggdata[json.typeCategory];
		}
  
  	  
  
      if (checkData.indexOf(json[json.typeCategory]) == -1) {
        aggjson.total += 1;
        checkData.push(json[json.typeCategory]);
      }
	
    if(aggjson.distribution[json.groupCategory] == undefined) {
    	aggjson.distribution[json.groupCategory] = {};
  	}

	if(aggjson.distribution[json.groupCategory][json.key] == undefined) {
		aggjson.distribution[json.groupCategory][json.key] = {};
	}
	
	if(aggjson.distribution[json.groupCategory][json.key][json.value] == undefined) {
		aggjson.distribution[json.groupCategory][json.key][json.value] = 0;
	}

	aggjson.distribution[json.groupCategory][json.key][json.value] += 1;
	
});

    
return aggdata;

}

function getDataCountByObject(keyword)
{
	var cnt=g.V(keyword).In("is a").ToArray().length;
	var array=[], json={};
	if(cnt>0)
	{
		json={};
		json.count=cnt;
		json.type=keyword;
		json.by="Object";
		array.push(json);
	}
	
	//json = [{count:10,type:"Test Case",by:"Priority"},{count:13,type:"Defect",by:"Priority"}];
	return array;
	
	//list of Object value count , type and relation
}

function getDataCountByAttribute(keyword)
{
	var array=[],json={};
	
	g.V(keyword).Out("is a").Has("of type","Attribute").ForEach(function(relation){
		json={};
		json.count = g.V(keyword).In(relation.id).ToArray().length;
		json.type = g.V(keyword).In(relation.id).Out("is a").ToValue();
		json.by = g.V(keyword).Out("is a").Out("alias").ToValue();
		array.push(json);
	});
	//getDataCountByAttribute = [{count:10,type:"Test Case",by:"Priority"},{count:13,type:"Defect",by:"Priority"}];
	return array;
	//list of Object value count , type and relation
}

function getDataCountById(keyword)
{
	var array=[], json={};
	
	g.V(keyword).Out("is a").Has("of type","Object").ForEach(function(tp){
		json={};
		json.count=1;
		json.type=tp.id;
		json.by="Value";
		array.push(json);
	});
	//getDataCountById = [{count:1,type:"Test Case",by:"Value"}];
	return array;
	//list of Object value count , type and relation
}

function getDataByObject(keyword)
{
var temp = [];
var node=g.V(keyword).Out("of type").Is("Object").ToArray();
  
  
	if(node!="")
	{
		temp = getObjectData(keyword);
	}
	
return temp;
//list of Object value count , type and relation
}

function getDataByAttribute(keyword)
{

var temp = [];
node=g.V(keyword).Out("is a").Out("of type").Is("Attribute").ToArray();

	if(node!="")
	{
		temp = getAttributeData(keyword);
	}

return temp;
//list of Object value count , type and relation
}

function getDataById(keyword)
{
	var temp = [];
	node=g.V(keyword).Out("is a").Out("of type").Is("Object").ToArray();
	if(node!="")
	{
		var arr=g.V(keyword).Out("is a").Out("of type").Is("Object").ToArray();
		if(arr.length>1)
			getProperties=false;
		else
		{
			getProperties=true;
		}
    	temp = getIdData(keyword,"");
	}
return temp;
//list of Object value count , type and relation
}

function getObjectData(keyword)
{
	var relations=[];
	relations= getRelations(keyword);

	return getAttributes(g.V(keyword).In("is a"),relations);		
}

function getAttributes(nodeObj,relations)
{
	var finalData = [];
	var source=g.V(relations[0]).In("relation").Out("alias").ToValue();
	var json={},attrDistr="",data=[];
	relations.forEach(function(rel) {
		json=nodeObj.As(source).Out(rel,["key"]).As("value").TagArray();
    	for(var i=0;i<json.length;i++)
		{
			if(json[i].id!="Object")
			{
				attrDistr=getAlias(json[i].key);
				json[i].key=attrDistr; 				
				json[i].typeCategory=source;
				json[i].groupCategory="";
				finalData.push(json[i]);
			}
		}		
	});    
	return finalData;
}


function getAttributeData(keyword){
	var temp = [], lJson={}, type="";
	var idArray=[], groupData=false, relationArray=[], dummyJson="", jsonArray=[], json={};
	json=g.V(keyword).Out("is a").Has("of type","Attribute").ToArray(); //list of attribute types (user_name, tc_name..)

	for(var i=0;i<json.length;i++)
	{
		idArray=g.V(keyword).In(json[i]).ToArray(); //list of id's assosiated with the particular object type

		for(var j=0;j<idArray.length;j++)
		{
			type=g.V(idArray[j]).Out("is a").Has("of type","Object").Has("relation",json[i]).ToValue();
          	temp = temp.concat(getIdData(idArray[j],type));
          
		}
	}	  
	
	return temp;
}

function getAlias(node)
{
	return g.V(node).Out("alias").ToValue();
}

function getIdData(keyword,type)
{
	var temp = [], tmpjs={};
	var relations=[], objects=[];
	if(type!=""){
		tmpjs.type=type;
		objects.push(tmpjs);
	}
	else
		objects=g.V(keyword).Out("is a").As("type").Out("of type").Is("Object").TagArray();
	for(var i=0;i<objects.length;i++)
	{
		relations=[];
		relations=getRelations(objects[i].type);
		temp = temp.concat(getAttributes(g.V(keyword),relations));
	}	
	return temp;
}
function getRelations(node)
{
	return g.V(node).Out("relation").ToArray();
}

function getObjectType(id)
{
	var json=g.V(id).Out("is a").As("source").Out("of type").Is("Object").TagValue();
	return g.V(json.source).Out("alias").ToValue();
}

function classifyKey(keywordsArray,attrArray,objArray)
{
	var idObj = null, id = null;
	keywordsArray.forEach(function(keyword){
		var isObj=g.V(keyword).Has("of type","Object").ToValue()!=null;
		var isId=g.V(keyword).Out("is a").Has("of type","Object").ToValue()!=null;
		var isAttr=g.V(keyword).Out("is a").Has("of type","Attribute").ToValue()!=null; //future use
		if(isObj)
		{
			idObj = g.V(keyword).In("is a");
			objArray.push(g.V(keyword).ToValue());
		}
		else if(isAttr)
			attrArray.push(keyword);
		else if(isId)
			id = ( id==null? g.V(keyword) : id.Union(g.V(keyword)) ); 
	});
	if(idObj != null)
	{
		if(id != null)
			id = id.Intersect(idObj);
		else
			id = idObj;
	}
	return id;
}

function getCommonId(idObj,attributes)
{
	var attFilter;
	if(idObj==null)
	{
		idObj=g.V(attributes[0]).In();
	}
	if(idObj!=null)
	{
		attributes.forEach(function(attr){
			attFilter=g.V(attr).In();
			idObj=idObj.Intersect(attFilter);
		});
	}
	return idObj;
}

function getMultiData(str)
{
	var array=str.split("$$"), objArray = [], idObj=null, attributes=[], objects, data=[], dataOut={}, tempId;
	
	idObj=classifyKey(array,attributes,objArray);
	/*array.forEach(function(keyword){
		if(idObj!=null)
			attributes.push(keyword);
		else
			idObj=classifyKey(keyword,attributes,objArray);
	});*/
	tempId = idObj;
	idObj = getCommonId(idObj,attributes);
	if(idObj.ToArray().length==0) {
		//attributes.push(_.difference(str.split("$$"),attributes)[0]);
		idObj=null;
		attributes.push(tempId.ToValue());
		idObj = getCommonId(idObj,attributes);
	}
	if(objArray.length==0)
		objects=idObj.Out("is a").Has("of type","Object").ToArray();
	else
		objects=objArray;
	objects.forEach(function(obj){
		data = data.concat(getAttributes(g.V(obj).In("is a").Intersect(idObj),getRelations(obj)));
	});
	data = getIndividualData(data, dataOut);
	dataOut.aggregate = aggregate(data);
	g.Emit(dataOut);
}
