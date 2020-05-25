var ObjectsLimit = 500;

function getData(jsonArray,offset,limit)
{
	var totalObjCount = 0;
	var length1,temp,length2;
	var iterate=0;
	var key, finalDataArray=[],finalDataJson={};
	jsonArray.forEach(function(json){
		var allObj = g.V(json.keyNode).In("is a");
		var allLinkObj = null, linkObj = null, unionList = null;
		var obj = null, idMap = {}, idList =[], finalData = {};
		
		obj = filterObjects(json.keyAttrFilter,allObj);
		obj = filterOutgoing(obj,json.relationsfilter);
		 length1= obj.ToArray().length;
		obj=obj.Skip(offset).Limit(limit);
		if(limit<=0)
	         obj = g.V(0).Out();
		length2=obj.ToArray().length;
		 iterate=iterate+length2;
		limit=limit-length2;
		temp= offset-length1;
		
		if(temp>=0)
		{
			offset=temp;
	    }
		//obj=obj.Limit(ObjectsLimit);
		ObjectsLimit= ObjectsLimit-obj.ToArray().length;
		
		totalObjCount += obj.ToArray().length;
		
		
		if((obj != null)&&(obj.ToArray().length == 1)) 
		{
			json.linkObjects.forEach(function(linkObject){
	          
	          allLinkObj = null;
				linkObject.objLinks.forEach(function(link){
					if(allLinkObj == null)
						allLinkObj = obj.In(link);
					else
						allLinkObj = allLinkObj.Union(obj.In(link));
				});
	          
				linkObj = filterObjects(linkObject.attrFilterList,allLinkObj);
				
				 length1= linkObj.ToArray().length;
		linkObj=linkObj.Skip(offset).Limit(limit);
		if(limit<=0)
			linkObj = g.V(0).Out();
		length2=linkObj.ToArray().length;
		 iterate=iterate+length2;
		 limit=limit-length2;
		temp= offset-length1;
		
		if(temp>=0)
		{
			offset=temp;
	    }
		//linkObj=linkObj.Limit(ObjectsLimit);
				ObjectsLimit= ObjectsLimit-linkObj.ToArray().length;
				
				totalObjCount += linkObj.ToArray().length;
				
				
	          //linkObj = linkObj == null ? allLinkObj : linkObj;
			
				finalData[linkObject.primKey] = getAttributeData(linkObject.primKey,linkObj.ToArray(),getUnionList(linkObject.attrVOList,linkObject.grpableAttrVOList));
				finalData[linkObject.primKey].groupableAttributes = getAttributes(linkObject.grpableAttrVOList);
				finalData[linkObject.primKey].AttributesType = 
								getAttrubuteType(linkObject.primKey,getAttributes(_.union(linkObject.grpableAttrVOList,linkObject.attrVOList)));
				finalData[linkObject.primKey].linkObj = linkObject.objLinks;
			});
		}

		finalData.summary = {};
		finalData.summary[json.keyNode] = getAttributeData(json.keyNode,obj.ToArray(),getUnionList(json.keyAttrList,json.keyGrpableList));
		finalData.summary[json.keyNode].groupableAttributes = getAttributes(json.keyGrpableList);
		finalData.summary[json.keyNode].AttributesType = 
							getAttrubuteType(json.keyNode,getAttributes(_.union(json.keyAttrList,json.keyGrpableList)));


		finalDataArray.push(finalData)
	});
	finalDataJson.output = finalDataArray;
	finalDataJson.len = iterate;
	g.Emit(finalDataJson)
}
 
function filterOutgoing(obj,filterArray)
{
	var outObj = null, relations = [], filteredObj = null;
	filterArray.forEach(function(filter){
		relations = filter.relationslist;
		filter.valueList.forEach(function(value){
			if((value!="")&&(value!=null))
			if(outObj == null)
				outObj = g.V(value).In(filter.attrRelation);
			else
				outObj = outObj.Union(g.V(value).In(filter.attrRelation));
		});
		relations.forEach(function(relation){
			if(filteredObj==null)
				filteredObj = outObj.In(relation);
			else
				filteredObj = filteredObj.Union(outObj.In(relation));
		});
	});	
	
	if(filteredObj != null)
		obj = obj.Intersect(filteredObj);
	return obj;
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

function getAttributeData(object,idArray,attrDetails)
{
	var innerJson={};
	innerJson.AttributesData = [];
	var tempJson = {}, count = 0;
	idArray.forEach(function(id){
		tempJson = prepareData(object,id,attrDetails,count);
		if(count==0)
		{
			innerJson.order = tempJson.order;
			tempJson = tempJson.json;
		}
		if(Object.keys(tempJson).length > 0 )
			innerJson.AttributesData.push(tempJson);
		count++;
	});
	return innerJson;
}

function filterObjects(filterJson,allObj)
{
	var obj = null, tempObj = null, innerObj = null;	  
	filterJson.forEach(function(filter){
		innerObj = null;
		filter.valueList.forEach(function(value){
			if((value != null)&&(value != ""))
				if(innerObj == null)
					innerObj = g.V(value).In(filter.attrRelation);
				else
					innerObj = innerObj.Union(g.V(value).In(filter.attrRelation));
		});
		if((obj != null)&&(innerObj != null))
			obj = obj.Intersect(innerObj);
		else if(innerObj != null)
			obj = innerObj;
		/*tempObj = null;
		filter.valueList = _.union(filter.valueList);
		filter.valueList.forEach(function(value){
			if((value!="")&&(value!=null))
			{
				if(tempObj == null)
					tempObj = allObj.Has(filter.attrRelation,value);
				else
					tempObj = tempObj.Union(allObj.Has(filter.attrRelation,value));
			}
		});
		if(obj == null)
			obj = tempObj;
		else
			obj = obj.Intersect(tempObj);*/
	});
	
	if(obj != null)
		obj = allObj.Intersect(obj);
	else
		obj = allObj;
	return obj;
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