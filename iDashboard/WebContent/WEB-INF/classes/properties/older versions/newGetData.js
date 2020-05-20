
function getData(json)
{
	var allObj = g.V(json.keyNode).In().Except(g.V(json.keyNode).In("relation"));
	var attr = json.keyAttrFilter;
	var linkObjects = json.linkObjects;
	var grpAttr = json.keyGrpableList;
	var obj = null, values = [], linkedRelations=[], linkObj=null, finalData={}, temp={};
	finalData.summary={};
	finalData.aggregate={};
	attr.forEach(function(attjson){
		values = attjson.valueList;
		if(values.length>0)
		{
			values.forEach(function(value){
				if(value!="")
					if(obj==null)
						obj = allObj.Has(attjson.attrRelation,value);
					else
						obj = obj.Union(allObj.Has(attjson.attrRelation,value));
				
			});
		}
	});
	
	if(obj == null)
		obj=allObj;

	if(obj.ToArray().length ==1)
		finalData.summary = prepareSummary(obj,genArray(json.keyAttrList,"attrRelation"));
	
	if(grpAttr.length >0) {
		if(finalData.aggregate[(json.keyNode)] == undefined)
		{
			finalData.aggregate[(json.keyNode)] = {};
			finalData.aggregate[(json.keyNode)].distribution = {};
		}
		temp = finalData.aggregate[(json.keyNode)].distribution;
		
		temp = aggregate(obj,temp,grpAttr,[""],[]);
		finalData.aggregate[(json.keyNode)].distribution = temp;
	};
	
	linkObjects.forEach(function(linkData){
		
		if(finalData.aggregate[(linkData.primKey)] == undefined)
		{
			finalData.aggregate[(linkData.primKey)] = {};
			finalData.aggregate[(linkData.primKey)].distribution = {};
		}
		temp = finalData.aggregate[(linkData.primKey)].distribution;
		
		attr = linkData.grpableAttrVOList;
		linkedRelations = linkData.objLinks;
		
		temp = aggregate(obj,temp,attr,linkedRelations,linkData.attrFilterList);
		
		finalData.aggregate[(linkData.primKey)].distribution = temp;
	});
	g.Emit(finalData);
}

function aggregate(obj, aggData, data, objLinks, filterList)
{
	var linkObj = null, tempObj = null;
	objLinks.forEach(function(rel){		
		if(aggData[(rel)] == undefined)
			aggData[(rel)] = {};
	    if(rel == "")
	    	linkObj = obj;
	    else
	    	linkObj = obj.Both(rel);

	    filterList.forEach(function(filter){
	    	filter.valueList.forEach(function(value){
	    		if(value!="")
		            if(tempObj == null)
		            	tempObj = linkObj.Has(filter.attrRelation,value);
			    	else
			    		tempObj = tempObj.Union(linkObj.Has(filter.attrRelation,value));
	    	});
	    }); 
      if(tempObj!=null)
	    linkObj = tempObj;
		data.forEach(function(attjson){
			if(aggData[(rel)][(attjson.attrName)] == undefined)
				aggData[(rel)][(attjson.attrName)] = {};
			
			values = attjson.valueList;

			values.forEach(function(v){
				aggData[(rel)][(attjson.attrName)][v] = linkObj.Has(attjson.attrRelation,v).ToArray().length;
			});				
		});
		aggData[(rel)] = trimJson(aggData[(rel)]);
	});
	return aggData;
}

function genArray(jsonArray,key)
{
	var array=[];
	jsonArray.forEach(function(json){
		array.push(json[key]);
	});
	return array;
}

function trimJson(json)
{
	var innerKeys,outerKeys = Object.keys(json);
	var del=true;
	outerKeys.forEach(function(uKey){
		del = true;
		innerKeys = Object.keys(json[uKey]);
		innerKeys.forEach(function(iKey){
			del = del && (json[uKey][iKey] == 0);
		});
		if(del)
			delete json[uKey];
	});
	return json;
}

function prepareSummary(nodeObj,relations)
{

	var summary = {};
	var json = nodeObj.Out(relations).As("value").Out("is a").TagArray();
	json.forEach(function(data){
		summary[data.id] = data.value;
	});
	return summary;
}