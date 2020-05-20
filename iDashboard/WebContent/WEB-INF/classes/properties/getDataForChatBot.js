
function getData(jsonArray)
{
 var value,count,rel;
var list,desc;
var length,attributerealtion,x,obj;
  var js={},key={};
  var jsArray=[];
  var allObj=[];
  ;
   jsonArray.forEach(function(json)
    {
      var nodekey=json.keyNode
            allObj=g.V(json.keyNode).In("is a");
      
     
      
           obj = filterObjects(json.keyAttrFilter,allObj);
      
      
      jsArray=AttributeList(_.union(json.keyAttrList,json.keyGrpableList),obj.ToArray())
      list=obj.ToArray();
     
        count= list.length;
      key[nodekey]=count;
         rel = g.V(json.keyNode).Out("relation").As("rel").Out("relation").Has("data type","id").TagValue().rel;
        
      desc=obj.Out(rel).ToArray();  
});
     if(jsonArray.length>1)
      {
        g.Emit(key);
      }
      else if((jsonArray[0].keyAttrList.length == 0)&&(jsonArray[0].keyGrpableList.length == 0))
      {
        g.Emit(desc);
      }
      else
      {
      g.Emit(jsArray);
      }

}


function filterObjects(filterJson,allObj)
{
	var obj = null, tempObj = null, innerObj = null;	
    
	filterJson.forEach(function(filter){
		innerObj = null;
		filter.valueList.forEach(function(value){
			if((value != null)&&(value != ""))
              if(innerObj == null){
                innerObj = g.V(value).In(filter.attrRelation); }
          else{
            innerObj = innerObj.Union(g.V(value).In(filter.attrRelation));}
         
		});
if(innerObj != null)
      
		if((obj != null)&&(innerObj != null))
			obj = obj.Intersect(innerObj);
		else if(innerObj != null)
			obj = innerObj;
     
		
	});
	
	if(obj != null)
		obj = allObj.Intersect(obj);
	else
		obj = allObj;
	return obj;
  
}
  
  function AttributeList(AttrJson,allObj)
{
var js={}, jsArray=[];
  
  
     allObj.forEach(function(iterate){
     AttrJson.forEach(function(relation){
	 
	  value= g.V(iterate).Out(relation.attrRelation).ToValue();
    
	  attributerelation=relation.attrName;
       js={};
	    
	     js[attributerelation]=value;
     });   
       
       jsArray.push(js);
 });
     
 
return jsArray;
}




