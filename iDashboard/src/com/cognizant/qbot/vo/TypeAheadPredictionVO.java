package com.cognizant.qbot.vo;

import java.util.List;

public class TypeAheadPredictionVO 
{
	private List<PredictedValuesVO> predictedValues;
	
	/*TypeAheadPredictionVO(List<String> values)
	{
		PredictedValuesVO predictedValuesVO = new PredictedValuesVO();
	}*/
	
	public List<PredictedValuesVO> getPredictedValues() {
		return predictedValues;
	}

	public void setPredictedValues(List<PredictedValuesVO> predictedValues) {
		this.predictedValues = predictedValues;
	}
}
