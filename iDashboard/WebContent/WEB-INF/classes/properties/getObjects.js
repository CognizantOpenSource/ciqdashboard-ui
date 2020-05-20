function getObjects(jsonArray)
{
	var mainArray={};
	jsonArray.forEach(function(json){
		var opArray = [], allObj = g.V(json.keyNode).In("is a");
		var allLinkObj = null, linkObj = null, unionList = null;
		var obj = null, idMap = {}, idList =[], finalData = {};
      var opJson ={},subAgg={};
      
		obj = filterObjects(json.keyAttrFilter,allObj);
		obj = filterOutgoing(obj,json.relationsfilter);
		
		
		 //g.Emit(obj.ToArray())
      obj.ToArray().forEach(function(val){
	        opJson={};
	        if(json.linkObjects.length == 0)
	        {
	        	opJson.obj = val;
	        	//opArray.push(opJson);
	        }
			json.linkObjects.forEach(function(linkObject){
	          allLinkObj = null;
				linkObject.objLinks.forEach(function(link){
					if(allLinkObj == null)
						allLinkObj = g.V(val).In(link);
					else
						allLinkObj = allLinkObj.Union(g.V(val).In(link));
				});
	          
				linkObj = filterObjects(linkObject.attrFilterList,allLinkObj);
				 if((json.aggregation.mainAggregation.length=0) && (json.aggregation.subAggregation.length=0)) 
	             {
	               	opJson[linkObject.primKey] = linkObj.ToArray();
	               //len=linkObj.ToArray().length;
	              // g.Emit(len);
	               //opJson[linkObject.primKey]=len;
	               
	             }
				temp = json.aggregation.subAggregation;
				for(var i=0;i<temp.length;i++){
					if(temp[i].object == linkObject.primKey)
					{
						subAgg = temp[i];
						break;
					}
				}
             // g.Emit(json.aggregation.subAgg);
			if(Object.keys(subAgg).length != 0)
			{
			 opJson = subAggregator(opJson,subAgg.operation,subAgg.number,linkObject.primKey,val,linkObj.ToArray());
			 keycount=linkObject.primKey + " count";
             length = linkObj.ToArray().length;
             opJson[keycount]= length;	
			}
			else
			{
				//if((json.aggregation.mainAggregation.length=0) && (json.aggregation.subAggregation.length=0))
					
				if(Object.keys(opJson).length == 0)
				{
					opJson.obj = val;
					opJson.count = linkObj.ToArray().length;
					opJson[linkObject.primKey] = linkObj.ToArray();
				}
				else
				{
					opJson[linkObject.primKey] = linkObj.ToArray();
					opJson.count = opJson.count + linkObj.ToArray().length;
				}
			
			}
             /* var tempArray = linkObj.ToArray();
              if(tempArray.length > 5)
              {
                opJson.obj=val
              	opJson.defects=linkObj.ToArray().length;
                opJson.array=tempArray;
                opArray.push(opJson)
              }*/
             // g.Emit(val)
             // g.Emit(linkObj.ToArray())
              
			});
			if((Object.keys(opJson).length != 0)&&((opJson.count > 0)||(json.aggregation.subAggregation.length == 0)))
				opArray.push(opJson);
		});
		if(Object.keys(json.aggregation.mainAggregation).length != 0)
			opArray = mainAggregator(opArray,json.aggregation.mainAggregation.operation,json.aggregation.mainAggregation.number);
		mainArray[json.keyNode] = opArray ;
	});
  // g.Emit(opArray)
 
  /*opArray.sort(function(a, b) {
    if(a.defects > b.defects)
      return 1;
    else if(b.defects > a.defects)
      return -1;
    else 
      return 0
});*/
  g.Emit(mainArray)
}

function mainAggregator(array,operation,number)
{

	var returnValue = 1;
	if((operation == "bottom")||(operation == "low"))
		returnValue = -1;
	//g.Emit(array);
 // g.Emit("+++")
	array.sort(function(a, b) {
      if(b.count > a.count)
		  return returnValue;
		else if(a.count > b.count)
		  return -(returnValue);
		else 
		  return 0;
	});

	array = array.slice(0,number);

  return array;
}

function subAggregator(opJson,operation,number,linkObject,object,linkObjArray)
{
	var flag;
	switch(operation)
	{
		case "more":
			flag = (linkObjArray.length > number);
			break;
		case "less":
			flag = (linkObjArray.length < number)
			break;
      case "atleast":
			flag = (linkObjArray.length >= number);
			break;
      case "atmost":
			flag = (linkObjArray.length <= number);
			break;
      case "minimum":
			flag = (linkObjArray.length >= number);
			break;
      case "maximum":
			flag = (linkObjArray.length <= number);
			break;
      case "min":
			flag = (linkObjArray.length >= number);
			break;
      case "max":
			flag = (linkObjArray.length <= number);
			break;
	}
	
	if(flag)
	{
		if(Object.keys(opJson).length == 0)
		{
			opJson.obj = object;
			opJson.count = linkObjArray.length;
			//opJson[linkObject] = linkObjArray;
		}
		else
		{
			//opJson[linkObject] = linkObjArray;
			opJson.count = opJson.count + linkObjArray.length;
		}
	}
	else
		opJson = {}
	
	return opJson;
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