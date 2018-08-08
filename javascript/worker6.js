var start;
onconnect = function(e)
{
	var port = e.ports[0];
	port.onmessage = function(event)
	{
		var data = JSON.parse(event.data);
		if(!start){
			start = data.start;
		}
		var result = "";
		search:
		for (var n = start,count = 0 ; count < 10; n++)
		{
			for (var i = 2; i <= Math.sqrt(n); i ++)
			{
				if (n % i == 0)
				{
					continue search;
				}
			}
			result += (n + ",");
			start = n;
			count++; 
		}
		start++;
		
		port.postMessage(result);
	}
}