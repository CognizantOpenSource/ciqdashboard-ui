function isAvailable(node)
{
	var json = {};
	try
	{
		json.isTokenizer = g.V(node).In("tokenize").ToValue() != null
		json.isWholeWord = (g.V(node).Out().ToValue() != null);
		json.isObject = ((g.V(node).Has("of type","Object").ToValue() != null)||(g.V(node).In("tokenize").Has("of type","Object").ToValue() != null));
	}
	catch(e)
	{
		json.isWholeWord = (false);
	}
	g.Emit(json);
}

function isValueAvailable(attributeRelation,value)
{
	g.Emit(g.V().Has(attributeRelation,value).ToArray().length > 0)
}