function getData(jsonArray, filteredObjectsList, offset, limit)
{
	var totalObjCount = 0, finalDataArray=[],finalDataJson={};
	var length1,temp,length2;
	var len=0;
	jsonArray.forEach(function(json){
		var allObj = g.V(json.keyNode).In("is a");
		var allLinkObj = null, linkObj = null, unionList = null;
		var obj = null, idMap = {}, idList =[], finalData = {};
		var filteredObjects = filteredObjectsList[json.keyNode];
		var linkObjCountJson = {}, tempJ = {};
		obj = [];
		filteredObjects.forEach(function(element){
			tempJ = {};
	        tempJ = _.extend(tempJ,element);
	        delete tempJ.count;
			delete tempJ.obj;
			obj.push(element.obj);
			linkObjCountJson[element.obj] = {};
			linkObjCountJson[element.obj] = tempJ;
			
		});
		
		length1 = obj.length;
		obj = obj.slice(offset).slice(0,limit);
		if(limit<=0)
			obj = [];
		length2 = obj.length;
		len = len+length2;
		limit = limit-length2;
		temp = offset-length1;
		if(temp>=0)
			offset=temp;
				
		
		if((filteredObjects != null)&&(filteredObjects.length == 1))
		{
			
			json.linkObjects.forEach(function(linkObject){
	          linkObj = filteredObjects[0][linkObject.primKey];
				
				if(linkObj == undefined)
					linkObj = [];
				
				length1 = linkObj.length;
				linkObj = linkObj.slice(offset).slice(0,limit);
				if(limit<=0)
					linkObj = [];
				length2 = linkObj.length;
				len = len+length2;
				limit = limit-length2;
				temp = offset-length1;
				if(temp>=0)
					offset=temp;
				
	          //linkObj = linkObj == null ? allLinkObj : linkObj;
				finalData[linkObject.primKey] = getAttributeData(linkObjCountJson,linkObject.primKey,linkObj,getUnionList(linkObject.attrVOList,linkObject.grpableAttrVOList));
				finalData[linkObject.primKey].groupableAttributes = getAttributes(linkObject.grpableAttrVOList);
				finalData[linkObject.primKey].AttributesType = 
								getAttrubuteType(linkObject.primKey,getAttributes(_.union(linkObject.grpableAttrVOList,linkObject.attrVOList)));
				finalData[linkObject.primKey].linkObj = linkObject.objLinks;
			});
		}
		
		finalData.summary = {};
		finalData.summary[json.keyNode] = getAttributeData(linkObjCountJson,json.keyNode,obj,getUnionList(json.keyAttrList,json.keyGrpableList));
		finalData.summary[json.keyNode].groupableAttributes = getAttributes(json.keyGrpableList);
		finalData.summary[json.keyNode].AttributesType = 
							getAttrubuteType(json.keyNode,getAttributes(_.union(json.keyAttrList,json.keyGrpableList)));
		
		finalDataArray.push(finalData);
	});
	finalDataJson.output = finalDataArray;
	finalDataJson.len = len;
	g.Emit(finalDataJson);
}


//combine two list based on the weight flag provided
function getUnionList(list1,list2)
{
	var json = {}, finalArray=[];
	[list1,list2].forEach(function(currentList){
		for(var i=0;i<currentList.length;i++)
		{
			if(json[currentList[i].weightFlag] == undefined)
				json[currentList[i].weightFlag] = [];
			json[currentList[i].weightFlag].push(currentList[i]);
		}
	});
	Object.keys(json).sort().reverse().forEach(function(i){
		finalArray.push.apply(finalArray,json[i]);
	});
	
	return finalArray;
	
}

function getAttrubuteType(object,attributes)
{
	var json = {}, array = [], obj = null, type;
	attributes.forEach(function(att){
		if(g.V(att).In("relation alias").Out("of type").ToValue() == "Relation")
			type = "link id";
		else
			type = g.V(att).Out("data type").ToValue();
		//type = obj.Out("data type").ToValue();
		if(json[type] == undefined)
			json[type] = [];
		json[type].push(att);
	});	
	return json;
}

function getAttributes(attributes)
{
	var array = [], att;
	attributes.forEach(function(attribute){
		if(g.V(attribute.attrName).Out("of type").ToValue() == "Object")
			array.push(g.V(attribute.attrRelation).Out("relation alias").ToValue());
		else
			array.push(attribute.attrName);		
	});
	return array;
}

function getAttributeData(linkObjCountJson,object,idArray,attrDetails)
{
	var innerJson={};
	innerJson.AttributesData = [];
	var tempJson = {}, count = 0;
	var keysToAddInOrder = [];
	
	if(Object.keys(linkObjCountJson).length != 0)
		keysToAddInOrder = Object.keys(linkObjCountJson[Object.keys(linkObjCountJson)[0]]);
	
	idArray.forEach(function(id){
		tempJson = prepareData(object,id,attrDetails,count);
		if(count==0)
		{
			innerJson.order = tempJson.order;
			innerJson.order.push.apply(innerJson.order, keysToAddInOrder);
			tempJson = tempJson.json;
		}
		tempJson = _.extend(tempJson,linkObjCountJson[id]);
		if(Object.keys(tempJson).length > 0 )
			innerJson.AttributesData.push(tempJson);
		count++;
	});
	return innerJson;
}

function prepareData(object,node,attrDetails,count)
{
	var lJson = {}, mJson = {}, temp={}, relation, name, isObject = false, rel, order=[] ;
	attrDetails.forEach(function(attribute){
		isObject = g.V(attribute.attrName).Out("of type").ToValue() == "Object";
		relation = attribute.attrRelation;
		if(isObject)
			name = g.V(attribute.attrRelation).Out("relation alias").ToValue();
		else
			name = attribute.attrName;		
		lJson = g.V(node).Out(relation).As(name).TagValue();
		if(lJson != null) {
			if(isObject)
			{
				//lJson[name] = g.V(lJson[name]).Out().As("Id").Out("is a").Has("data type","id").TagValue().Id;
				rel = g.V(attribute.attrName).Out("relation").As("rel").Out("relation").Has("data type","id").TagValue().rel;
				lJson[name] = g.V(lJson[name]).Out(rel).ToValue();
			}
				
			
			delete lJson.id; 
			if(count==0)
				order.push(name);
			mJson = _.extend(lJson,mJson);
		}
	});
	if(count==0)
	{
		temp = mJson;
		mJson = {};
		mJson.json = temp;
		mJson.order = order;
	}
	return mJson;
}