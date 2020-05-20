package com.cognizant.qbot.spellchecker;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.security.SecureRandom;
import java.util.Set;

import com.cognizant.qbot.service.DictionaryVO;
import com.cognizant.qbot.spellchecker.DictionarySpeller.Bucket.Node;

public class DictionarySpeller {
		
	private static Set<Character> dictAlphabetSet = new HashSet<Character>();
    private int M = 1319; //prime number
    private Bucket[] dictArray;
    private Bucket[] lowerDictArray;
    
    
    
    public DictionarySpeller() {
        this.M = M;

        dictArray = new Bucket[M];
        lowerDictArray = new Bucket[M];
        for (int i = 0; i < M; i++) {
        	dictArray[i] = new Bucket();
        	lowerDictArray[i] = new Bucket();
        }
    }

    private int hash(String key) {
        return (key.toLowerCase().hashCode() & 0x7fffffff) % M;
    }

    //call hash() to decide which bucket to put it in, do it.
    public void add(String key) {
    	dictArray[hash(key)].put(key);
    	
    }


    public void addLowerValue(String key) {
    	
    	Locale.setDefault(new Locale("en", "US", "WIN")); 
    	lowerDictArray[hash(key)].put(key.toLowerCase(Locale.ENGLISH));
    	
    	
    }

    
    //call hash() to find what bucket it's in, get it from that bucket. 
    public String contains(String input) {
 
       //input = input.toLowerCase();
      
        return dictArray[hash(input)].get(input);
    }

    public void build(List<DictionaryVO> dictVOItems) {
        
    	for(int i=0;i<dictVOItems.size();i++)
		{
			DictionaryVO dictVO = dictVOItems.get(i);
			
			for(String spellTerm : dictVO.getId().split(" "))
			{
				spellTerm.toCharArray();
			
				addToDictSet(spellTerm);
				add(spellTerm);		
				//addLowerValue(spellTerm);
			}
			
			
		}    	    	    	

    }
    
    private void addToDictSet(String spellTerm){
    	char [] spellTermArr = spellTerm.toLowerCase().toCharArray();
    	
    	for(int i = 0; i < spellTermArr.length; i++){
    			dictAlphabetSet.add(spellTermArr[i]);
    		}
    }
    
    //this method is used in my unit tests
    public String[] getRandomEntries(int num){
        String[] toRet = new String[num];
        SecureRandom ranGen = new SecureRandom();
        for (int i = 0; i < num; i++){
            //pick a random bucket, go out a random number 
            Node n = dictArray[(int)ranGen.nextInt(10)*M].first;
            int rand = (int)ranGen.nextInt(10)*(int)Math.sqrt(num);

            for(int j = 0; j<rand && n.next!= null; j++) n = n.next;
            toRet[i]=n.word;


        }
        return toRet;
    }

    class Bucket {

        private Node first;

        public String get(String in) {  
        //return key true if key exists
            Node next = first;
        
            while (next != null) {            	
           // System.out.println(next.word);
           // System.out.println(in);
                if (next.word.equalsIgnoreCase(in)) {
                
                    return next.word;
                }
                next = next.next;
            }
            return "-1";
        }

        public void put(String key) {
            for (Node curr = first; curr != null; curr = curr.next) {
                if (key.equals(curr.word)) {
                    return;                     //search hit: return
                }
            }
            first = new Node(key, first); //search miss: add new node
        }

        class Node {

            String word;
            Node next;

            public Node(String key, Node next) {
                this.word = key;
                this.next = next;
            }

        }

    }
}