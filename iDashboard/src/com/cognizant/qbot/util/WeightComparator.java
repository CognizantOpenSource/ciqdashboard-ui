package com.cognizant.qbot.util;

import java.util.Comparator;

import com.cognizant.qbot.graph.vo.AttributeVO;

public class WeightComparator implements Comparator<AttributeVO>
{
	public int compare(AttributeVO a1, AttributeVO a2) {
		String weight1 = a1.getWeightFlag();
		String weight2 = a2.getWeightFlag();

		return weight2.compareTo(weight1);
	}

}
