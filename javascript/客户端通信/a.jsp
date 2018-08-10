<%@ page contentType="text/html; charset=GBK" language="java" errorPage=""
	import="java.io.*"%>
<%
// Ê¹ÓÃIOÁ÷¶ÁÈ¡¿Í»§¶ËBeacon·¢ËÍµÄÊý¾Ý
BufferedReader br = new BufferedReader(
	new InputStreamReader(request.getInputStream(), "utf-8"));
System.out.println("½ÓÊÕµ½µÄÊý¾Ý---" + br.readLine());
%>