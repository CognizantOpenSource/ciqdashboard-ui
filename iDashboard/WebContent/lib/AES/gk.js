const randomString="bFMeD57hA97tRDTSmrdO4VApgt9un5ng2AQwV57iuUm3X8BB3WIP3hRIn92NQCIU7WojIwmysnGWqHC3ZA4fp2QcJPNdVRhcMKkAbct".split("");
var gk=function(){
	for(var t="",n="",r=0;r<10;r++){
		var o=Math.floor(100*Math.random());t+=randomString[o],n+=("0"+o).slice(-2)}return[n,t]};gk();