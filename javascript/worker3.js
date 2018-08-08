onmessage = function(event)
{
	var data = JSON.parse(event.data);
	var start = data.start;
	var end = data.end;
	var result = "";
	search:
	for (var n = start ; n <= end ; n++)
	{
		for (var i = 2; i <= Math.sqrt(n); i ++)
		{
			if (n % i == 0)
			{
				continue search;
			}
		}
		result += (n + ",");
	}
	postMessage(result);
}