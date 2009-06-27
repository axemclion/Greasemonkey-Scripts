<%
	for (int i =0 ; i< 20000; i++)
		for (int j =0 ; j< 65555; j++);					
%>


{"twords": [{"optmap": {"YEH": ["Y", "", "H"]}, "word": true, "options": ["YEH"]}], "itrans": "<%=request.getParameter("inString").toUpperCase()%>", "inString": "<%= request.getParameter("inString")%>"}