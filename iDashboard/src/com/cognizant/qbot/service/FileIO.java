package com.cognizant.qbot.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

public class FileIO 
{
	public void writeFile(List<String> content, String path) throws IOException
	{
		FileWriter file = new FileWriter(path);
		BufferedWriter writer = new BufferedWriter(file);
		
		try{
		//file = new FileWriter(path);
	  //  writer = new BufferedWriter(file);
		for(int i=0;i<content.size();i++)
		{
			writer.write(content.get(i));
		}}
		finally{
		writer.close(); file.close();}
	}
	
	public String readFile(String path)
	{
		StringBuilder stringBuilder = new StringBuilder();
		InputStream stream = null;
		stream = Thread.currentThread().getContextClassLoader().getResourceAsStream(path);
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(stream));
		String line;
        try {
			while ((line = bufferedReader.readLine()) != null) {
			       stringBuilder.append(line+"\n");
   }
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 

	   try {
		bufferedReader.close();
	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	   return stringBuilder.toString();
	}
}
