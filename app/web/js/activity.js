var _invoice = function()
{	
	var p ={
		costArr:[],
	};
	var head, main, footer;
	
	this.init = function()
	{
		creatHeader();
		createTable();
	}	
	
	function creatHeader()
	{
		head = document.createElement("div");
		var title = document.createElement("div");
		$(head).attr("id","header");
		$(title).attr("id","title").css({
			"display": "table-cell",
			"vertical-align": "middle"
		});
		
		
		$("#page-wrapper").append(head);
		$(head).append(title);
		$(title).html("Building Name");
	}
	function createTable()
	{
		main = document.createElement("div");
		$(main).attr("id","container");
		$("#page-wrapper").append(main);
		
		var tbl = document.createElement('table');
		$(tbl).attr("class","invoice_table");
		
		tbl.style.width = '100%';
		tbl.setAttribute('border', '1');
		
		var tbdy = document.createElement('tbody');
		$(tbdy).attr("class","invoice_table");
		
		for (var i = 0; i < elementJson.length; i++) 
		{
			var tr = document.createElement('tr');
			var _c = 0;
			
			for (var j in elementJson[i]) 
			{
				_c++;
				var td = document.createElement('td');
				i == 0 ? $(td).attr("class","cellBorder") : $(td).attr("class","tableCell");				
				tr.appendChild(td);
				
				$(td).text(elementJson[i][j]);
				console.log(Object.keys(elementJson[i]).length);
				if(_c == Object.keys(elementJson[i]).length && i!= 0)
				{
					$(td).addClass("_center");
					p.costArr.push(elementJson[i][j])
				}
				
				if(_c == 1)
				{
					$(td).css({"width":"10%"}).addClass("_center");
					i!= 0 ? $(td).text(i) : null; 
				}
			}
			tbdy.appendChild(tr);
		}
		
		//--total
		var tr = document.createElement('tr');
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		$(td1).addClass("cellBorder");
		$(td2).addClass("cellBorder");
		$(td3).addClass("cellBorder");
		
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		
		var _total = 0; 
		// console.clear();
		// console.log(p.costArr);
		// console.log(p.costArr.length);
		
		for(var i = 0; i< p.costArr.length; i++)
		{
			// console.log(_total);
			// console.log(p.costArr[i]);
			_total = _total + (p.costArr[i]*1);
		}
		console.log(_total)
		$(td1).text();
		$(td2).text("Total : ");
		$(td3).text(_total);
		
		tbdy.appendChild(tr);
		
		tbl.appendChild(tbdy);
		$("#page-wrapper").append(tbl);
	}
}
var table_incoive = new _invoice();
var tableJson;
$(document).ready(function(e) 
{	
	console.log(elementJson)
	// tableJson = JSON.parse(data);
	table_incoive.init();
});