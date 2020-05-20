package com.cognizant.qbot.spellchecker;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.entity.StringEntity;

import com.cognizant.qbot.GData.ReadGraphUtil;
import com.cognizant.qbot.service.DictionaryVO;
//import org.apache.el.parser.ParseException;

public class SpellCheckBuilder 
{
	private static DictionarySpeller dictSpeller;
    private static final String GET_SPELLCHECK_DATA = "g.V().Has(\"is NLPable\",\"true\").All();"+
    "g.V().Has(\"of type\",\"Relation\").All();";    
    final static char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
    public static List<DictionaryVO> dictVOItems = null;
    
    public SpellCheckBuilder(){
    	
    }
    
    public void trainSpellChecker()
	{
	
        dictSpeller = new DictionarySpeller();        
		dictVOItems = new ArrayList<DictionaryVO>();
		
		try {
			dictVOItems = ReadGraphUtil.mapDictionaryValues(new StringEntity(GET_SPELLCHECK_DATA));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
						
		dictSpeller.build(dictVOItems);
	
	}
	
    public String printSuggestions(String input) {
    	String output = dictSpeller.contains(input);
    	if(!output.equalsIgnoreCase("-1")){
    		
    		return output;// new Bucket().get(input);
    	}else{
    		
	        StringBuilder sb = new StringBuilder();
	        ArrayList<String> print = makeSuggestions(input);
	       
	        if (print.size() == 0) {
	            return input;
	        }
	        //sb.append("perhaps you meant:\n");
	        for (String s : print) {
	            sb.append(s);
	        }
	        return sb.toString();
    	}
    }

    private ArrayList<String> makeSuggestions(String input) {
        ArrayList<String> toReturn = new ArrayList<String>();
        toReturn.addAll(charAppended(input));
        toReturn.addAll(charMissing(input));
        toReturn.addAll(charsSwapped(input));
        return toReturn;
    }
    
    
    private ArrayList<String> charAppended(String input) { 
    	
        ArrayList<String> toReturn = new ArrayList<String>();
        for (char c : alphabet) {
            String atFront = c + input;
            String atBack = input + c;
            String outputfront = dictSpeller.contains(atFront);
            String outputback = dictSpeller.contains(atBack);
            if (!outputfront.equalsIgnoreCase("-1")) {
                toReturn.add(outputfront);
            }
            if (!outputback.equalsIgnoreCase("-1")) {
            	
                toReturn.add(outputback);
            }
        }
        
        
        return toReturn;
    }

    private ArrayList<String> charMissing(String input) {   
        ArrayList<String> toReturn = new ArrayList<String>();

        int len = input.length() - 1;
        String outputsub = dictSpeller.contains(input.substring(1));
        //try removing char from the front
        if (!outputsub.equalsIgnoreCase("-1")) {
        	
            toReturn.add(outputsub);
           
        }
        for (int i = 1; i < len; i++) {
        	
            //try removing each char between (not including) the first and last
            String working = input.substring(0, i);
          
            working = working.concat(input.substring((i + 1), input.length()));
            String outputworking = dictSpeller.contains(working);
            if (!outputworking.equalsIgnoreCase("-1")) {
            	
                toReturn.add(outputworking);
            }
        }
        String outputsublen = dictSpeller.contains(input.substring(0, len));
        if (!outputsublen.equalsIgnoreCase("-1")) {
        	
            toReturn.add(outputsublen);
        }
        return toReturn;
    }

    private ArrayList<String> charsSwapped(String input) {   
        ArrayList<String> toReturn = new ArrayList<String>();
        
        for (int i = 0; i < input.length() - 1; i++) {
        	
            String working = input.substring(0, i);// System.out.println("    0:" + working);
            working = working + input.charAt(i + 1);  //System.out.println("    1:" + working);
            working = working + input.charAt(i); //System.out.println("    2:" + working);
         
            working = working.concat(input.substring((i + 2)));//System.out.println("    FIN:" + working); 
            String outputwork = dictSpeller.contains(working);
            if (!outputwork.equalsIgnoreCase("-1")) {
                toReturn.add(outputwork);
            }
        }
        String backswap=input.substring(0, input.length() - 1);
    	for (char e : alphabet) {
            String atBack = backswap + e;
            String outputback2 = dictSpeller.contains(atBack);
            if (!outputback2.equalsIgnoreCase("-1")) {
            	
                toReturn.add(outputback2);
                
            }
        }
        return toReturn;
    }
    
    
    
	}
