function NER(sentence)
{
	var words = sentence.split(" "), tempObj, count=0, prevIndex;
	var array = [], temp, output=[], tempArray=[], copyArray, elements=[];
	for(var i=0;i<words.length;i++){
		if(g.V(words[i]).In("tokenize").ToValue() == null)
			output = getType(output,words[i]);
		else
			array.push(i);
	}
	copyArray = array;
	array.forEach(function(currenIndex){
		if((count == 0)||(currenIndex-1 != prevIndex))
		{
			count=1;
			prevIndex=currenIndex;
			elements=[];
			elements.push(currenIndex);
			tempObj = g.V(words[currenIndex]).In("tokenize");
		}
		else if(currenIndex-1 == prevIndex)
		{	
			tempObj = tempObj.Intersect(g.V(words[currenIndex]).In("tokenize"));
			if(tempObj.ToArray().length == 0)
            {
				count=1;
				prevIndex=currenIndex;
				elements=[];
				elements.push(currenIndex);
				tempObj = g.V(words[currenIndex]).In("tokenize");
              
            }
			else
			{
				count++;
				prevIndex=currenIndex;
				elements.push(currenIndex);
				tempArray = tempObj.ToArray();
				for(var i=0;i<tempArray.length;i++)
				{
					if(tempArray[i].split(" ").length == count)
					{
						output = getType(output,tempArray[i]);
						copyArray = _.difference(copyArray,elements);
						count=0;
						elements=[];
						break;
					}
				}
			}
		}
	});
	array.forEach(function(element){
		output = getType(output,words[element]);
	});
	
	g.Emit(output);
}

function getType(output,value)
{
	var isA = null, ofType = null;
	var type=[], json={};
	
	isA = g.V(value).Out("is a");
	ofType = g.V(value).Out("of type");
	type = isA.Union(ofType).ToArray();
	if(type.length != 0)
	{
		json.key=value;
		json.type=type;
		output.push(json);
	}
	  
	return output;
}
