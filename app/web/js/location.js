$(document).ready(function()
{
	var progress = new progressClass();
	initialize();
	clockon();
	progress.init();

	$.simpleWeather({
	    location: 'Mumbai, MH',
	    woeid: '',
	    unit: 'C',
	    success: function(weather) 
	    {
	    	console.log(weather);

			html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
			html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
			html += '<li class="currently">'+weather.currently+'</li>';
			html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';

			$("#weather").html(html);
			
	    },
	    error: function(error)
	    {
			$("#weather").html('<p>'+error+'</p>');
    	}
  	});  
	//========================================================================
	function clockon() 
	{
		thistime = new Date()
		var hours = thistime.getHours()
		var minutes = thistime.getMinutes()
		var seconds = thistime.getSeconds()
		if(eval(hours) <10) 
		{
			hours="0"+hours
		}
		if(eval(minutes) < 10)
		{
			minutes="0"+minutes
		}
		if(seconds < 10)
		{
			seconds="0"+seconds
		}
		thistime = hours+":"+minutes+":"+seconds
		// bgclocknoshade.innerHTML = thistime
		$("#bgclockshade").html(thistime);
		var timer = setTimeout(clockon,200)
	}
	//========================================================================
	function voting_chart()
	{
		var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		        datasets: [{
		            label: '# of Votes',
		            data: [12, 49, 3, 5, 2, 3],
		            backgroundColor: [
		                'rgba(255, 99, 132, 1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderColor: [
		                'rgba(255,99,132,1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
	}
	//========================================================================
	var geocoder;

  	if (navigator.geolocation) 
  	{
    	//navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
	//Get the latitude and the longitude;
	function successFunction(position) 
	{
	    var lat = position.coords.latitude;
	    var lng = position.coords.longitude;
	    codeLatLng(lat, lng);
	}

	function errorFunction()
	{
	    //alert("Geocoder failed");
	}

  	function initialize() 
  	{
   		//geocoder = new google.maps.Geocoder();
  	}

  	function codeLatLng(lat, lng) 
  	{
    	var latlng = new google.maps.LatLng(lat, lng);
		console.log(results)
    	if (results[1]) 
    	{
     		//formatted address
				//alert(results[0].formatted_address)
			//find country name
			for (var i=0; i<results[0].address_components.length; i++) 
			{
				for (var b=0;b<results[0].address_components[i].types.length;b++) 
				{
		            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
	                if (results[0].address_components[i].types[b] == "administrative_area_level_1") 
	                {
	                    //this is the object you are looking for
	                    city= results[0].address_components[i];
	                    break;
        			}
    			}
	        }
		}
  	}

});
//========================================================================
// Progress Circle
//========================================================================
var progressClass = function()
{
	var p = {};
	var c,c1,ctx,ctx1;
	this.init = function(obj)
	{
		//--- canvas rendering
		p.s_date = "5/7/2016";
		p.e_date = "25/7/2016";
		p._date = {};

		p._date.start = p.s_date.split("/")[0]*1;
		p._date.startMonth = p.s_date.split("/")[1]*1;
		p._date.startYear = p.s_date.split("/")[2]*1;

		p._date.end = p.e_date.split("/")[0]*1;
		p._date.endMonth = p.e_date.split("/")[1]*1;
		p._date.endYear = p.e_date.split("/")[2]*1;

		p.curr_date1 = new Date();
		p._date.curr_date = p.curr_date1.getDate();
		p._date.curr_month = p.curr_date1.getMonth()+1; //January is 0!
		p._date.curr_year = p.curr_date1.getFullYear();

		p.dueDays_count = 0;
		p.remaining_days = 0;

		c = document.getElementById("myCanvas");
		ctx = c.getContext("2d");
		console.clear();
		console.log(c);
		console.log(ctx);
		
		c1 = document.getElementById("myCanvas");
		ctx1 = c1.getContext("2d");
		
		calculations();
	}
	//====================================================
	function calculations()
	{
		if(p._date.startMonth == p._date.endMonth)
		{
			p.dueDays_count = p._date.end - p._date.start;
			p.remaining_days = p._date.end - p._date.curr_date*1;
		}

		p.remaining_per = (p.remaining_days/p.dueDays_count);
		console.log(p.remaining_per+" :: "+p.remaining_days+" || "+p.dueDays_count);

		p.complete_per = 1 - p.remaining_per;
		console.log(p.complete_per);

		p.curr_ang = (p.complete_per*(2*Math.PI))//-90;
		p.startAngle = (1.5*Math.PI)
		console.log(p.curr_ang);
		//p.curr_ang = p.curr_ang// - 90;

		drawProgress();
	}
	//====================================================
	function drawProgress()
	{
		ctx1.beginPath();
		ctx1.strokeStyle="rgba(166, 166, 166,0.2)";
		ctx1.lineWidth=15;
		ctx1.arc(100, 75, 50, 0, 2*Math.PI);
		ctx1.stroke();
		ctx1.closePath();

		ctx.beginPath();
		ctx.strokeStyle="#FF0000";
		ctx.lineWidth=15;

		console.log(p.curr_ang);
		ctx.arc(100, 75, 50, p.startAngle,(p.startAngle+p.curr_ang));

		var _makeStr = p.remaining_days+" Days";
		ctx.font="18px Arial";
		p.remaining_days >= 10 ? ctx.fillText(_makeStr,65,80) : ctx.fillText(_makeStr,75,80);
		ctx.stroke();
		ctx.closePath();
	}
}