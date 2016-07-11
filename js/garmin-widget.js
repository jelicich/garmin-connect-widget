 /*
 Garmin Widget
 Version: 1.0
  Author: Esteban Jelicich
 Website: https://github.com/jelicich/garmin-connect-widget
    Docs: -
    Repo: -
  Issues: -	
  The graphic was based on @liufly project https://github.com/liufly/Dual-scale-D3-Bar-Chart
*/

(function($){
	
	$.fn.garminWidget = function(config){
		var base = this;

		base.URL = {
			ACTIVITIES : 'http://connect.garmin.com/proxy/activitylist-service/activities/',
			STATISTICS : 'http://connect.garmin.com/proxy/userstats-service/statistics/',
			RECORDS : 'http://connect.garmin.com/proxy/personalrecord-service/personalrecord/prs/'
		};

		base.defaults = {
			data : 'activities',
			start : 1,
			limit : 5,
			group : false,
			period : 'monthly',
			display : 'list',
			width : 900,
			height : 400
		};

		base.config = {};

		base.init = function(config){
			if(base.validateConfig(config))
			{
				base.setConfig(config);
				base.getData();
			}	
		};

		base.validateConfig = function(config){
			var result = true;
			if(typeof config != 'object')
			{
				console.log('Error: wrong data format. Should be an object');
				result = false;
			}
			else
			{
				if(typeof config.username == 'undefined')
				{
					console.log('Error: username value should be provided');
					result = false;
				}	

				//data validation
				if(config.data)
				{
					switch(config.data)
					{
						case 'activities' :
							var isStartValid = (typeof config.start == 'number' || typeof config.start == 'undefined');
						    var isLimitValid = (typeof config.limit == 'number' || typeof config.limit == 'undefined');
							if(!isStartValid || !isLimitValid)
							{
								console.log('Error: start and limit value should be a number');
								result = false;
							}
							break;

						case 'statistics' : 
							if(typeof config.period != 'undefined')
							{
								switch(config.period)
								{
									case 'monthly' :
										break;
									case 'yearly':
										break;
									default : 
										console.log('Error: a valid period should be provided. "monthly" or "yearly"');
										result = false;
								}
							}
							break;

						case 'records' :
							// validation
							break;

						case 'graphic' :
							var isWidthValid = (typeof config.width == 'number' || typeof config.width == 'undefined');
							var isHeightValid = (typeof config.height == 'number' || typeof config.height == 'undefined');
							if(!isWidthValid || !isHeightValid)
							{
								console.log('Error: width and height value should be a number');
								result = false;
							}
							break;

						default:
							console.log('Error: wrong data value');
							result = false;
					}

					//slider option validation
					if(typeof config.display != 'undefined')
					{
						switch(config.display)
						{
							case 'list' :
								break;
							case 'slider':
								break;
							default : 
								console.log('Error: wrong display value');
								result = false;
						}
					}
				}
				else
				{
					console.log('Error: data value should be provided');
					result = false;
				}
			}
			return result;
		};

		base.setConfig = function(config){
			//base.selector = config.selector;
			base.config = $.extend({}, base.defaults, config);
			base.data = config.data;
			switch(config.data){
				case 'activities':
					var start = base.config.start;
					var limit = base.config.limit;
					base.url = base.URL.ACTIVITIES + base.config.username + '?start=' + start + '&limit=' + limit;
					break;
				
				case 'statistics' :
					var period = (config.period && config.period != base.defaults.period) ? 'previousDays/' : 'monthly/';
					var group = (eval(config.group) == base.defaults.group ) ? '?ByParentType=true' : '?ByParentType=false';
					base.url = base.URL.STATISTICS + period + config.username + group;
					break;

				case 'records' :
					base.url = base.URL.RECORDS + config.username;
					break; 

				case 'graphic' :
					base.url = base.URL.STATISTICS + 'monthly/' + base.config.username + '?ByParentType=true'
					break;
			} 
			//slider config
			if(config.display == 'slider')
			{
				base.isSlider = true;
			}
			else
			{
				base.isSlider = false;
			}
		};

		base.getData = function(){
			var t = base;
			$.ajax({
				method: 'POST',
				url: 'service/garminConnectService.php',
				data: {
					url: base.url,
				},
				success: function(data) {
					try{
						var json = JSON.parse(data);
						t.printHTML(json);	
					}catch(e){
						var $error = $('<p>').html(e.message).addClass('gw-error');
						var $response = $('<div>').html(data).addClass('gw-error');
						base.append($error,$response).addClass('garmin-widget');
					}
					
		    	}
		    });		
		};

		base.printHTML = function(json){
			if(base.data == 'graphic')
			{
				this.printGraphic(json);
				return;
			}

			var $wrapper = $('<div>').addClass('garmin-widget-wrapper');
	    	var $ul = $('<ul>').addClass('garmin-widget');
	    	$wrapper.append($ul);

	    	switch(base.data)
	    	{
	    		case 'activities' :
	    			for(var i = 0; i < json.activityList.length; i++)
			    	{
			    		var name = json.activityList[i].activityName;
						var type = json.activityList[i].activityType.typeKey; 
						var date = json.activityList[i].startTimeLocal;
						var pic = json.activityList[i].ownerProfileImageUrlSmall;
						var distance = json.activityList[i].distance;
						var distanceKM = (distance / 1000).toFixed(2)
						var time = parseInt(json.activityList[i].duration);
						
						var timeHMS = new Date(null);
			        	timeHMS.setSeconds(time);
			        	timeHMS = timeHMS.toISOString().substr(11, 8);
						
						var pace = (time / distanceKM).toFixed(2);
						var paceMS = new Date(null);
						paceMS.setSeconds(pace);
			        	paceMS = paceMS.toISOString().substr(14, 5);

			        	var calories = parseInt(json.activityList[i].calories);

			    		var html = '<li class="activity-container"><div class="title-container"><h2>' + name + '</h2><h3>' + type + ' | ' + date + '</h3></div><ul class="activity-details clearfix"><li><dl><dt>Distance</dt><dd>' + distanceKM + ' km</dd></dl></li><li><dl><dt>Time</dt><dd>' + timeHMS + '</dd></dl></li><li><dl><dt>Avg Pace</dt><dd>' + paceMS + '</dd></dl></li><li><dl><dt>Calories</dt><dd>' + calories + '</dd></dl></li></ul></li>';
			    		$ul.append(html);
			    	}
	    			break;

	    		case 'statistics' :
	    			for(var i = 0; i < json.userMetrics.length; i++)
	    			{
	    				var period = (json.userMetrics[i].month) ? json.userMetrics[i].month : 'Last 365 days';
	    				var activityType = (json.userMetrics[i].activityType.typeKey == 'all') ? 'all activities' : json.userMetrics[i].activityType.typeKey;
	    				var totalActivities = json.userMetrics[i].totalActivities;
	    				var totalDistance = json.userMetrics[i].totalDistance;
	    				var totalDistanceKM = (totalDistance / 1000).toFixed(2);
	    				
	    				var totalDuration = parseInt(json.userMetrics[i].totalDuration);
	    				var timeHMS = new Date(null);
			        	timeHMS.setSeconds(totalDuration);
			        	timeHMS = timeHMS.toISOString().substr(11, 8);
	    				
	    				var totalCalories = parseInt(json.userMetrics[i].totalCalories / 4.2); //total calories are shown in joules

	    				var html = '<li class="activity-container"><div class="title-container"><h2>' + period + '</h2><h3>' + activityType + '</h3></div><ul class="activity-details clearfix"><li><dl><dt>Activities</dt><dd>' + totalActivities + '</dd></dl></li><li><dl><dt>Distance</dt><dd>' + totalDistanceKM + ' km</dd></dl></li><li><dl><dt>Time</dt><dd>' + timeHMS + '</dd></dl></li><li><dl><dt>Calories</dt><dd>' + totalCalories + '</dd></dl></li></ul></li>';
	    				$ul.append(html);
	    			} 
	    			break;

	    		case 'records' :
	    			//1 to 7 running
	    			var R_RECORD_1KM = 1;
	    			var R_RECORD_1MI = 2
	    			var R_RECORD_5KM = 3;
	    			var R_RECORD_10KM = 4;
	    			var R_RECORD_21KM = 5;
	    			var R_RECORD_42KM = 6;
	    			var R_RECORD_FARTHEST = 7;

	    			//8 to 11 cycling
	    			var C_RECORD_FARTHEST = 8;
	    			var C_RECORD_ELEVATION = 9;
	    			var C_RECORD_MAX_AVG_POWER = 10;
					var C_RECORD_40KM = 11;

	    			function sortRecords(a,b){
					    return a.typeId > b.typeId ? 1 : -1;
	    			}

	    			json = json.sort(sortRecords);
	    			var records = {};  			

	    			var isHeaderR = false;
	    			var isHeaderC = false;
	    			for(var i = 0; i < json.length; i++)
	    			{
	    				var currentRecord = json[i];
						var record_title;
	    				var record_value;

	    				//XX
	    				if(currentRecord.typeId >= 1 && currentRecord.typeId <= 7 && !isHeaderR)
	    				{
	    					var $li = $('<li>').addClass('activity-container');
			    			$li.append('<div class="title-container"><h2>Personal Records</h2><h3>running</h3></div>');
			    			var $ulChild = $('<ul>').addClass('activity-details').addClass('clearfix');
			    			$li.append($ulChild);

			    			$ul.append($li);

			    			isHeaderR = true;

	    				}
	    				if(currentRecord.typeId >= 8 && currentRecord.typeId <= 11 && !isHeaderC)
	    				{
	    					var $li = $('<li>').addClass('activity-container');
			    			$li.append('<div class="title-container"><h2>Personal Records</h2><h3>cycling</h3></div>');
			    			var $ulChild = $('<ul>').addClass('activity-details').addClass('clearfix');
			    			$li.append($ulChild);

			    			$ul.append($li);

			    			isHeaderC = true;
	    				}
	    				
	    				switch(currentRecord.typeId)
	    				{
	    					case R_RECORD_1KM : 
	    						record_title = '1 km';
	    						record_value = parseTime(currentRecord.value);
	    						break;

	    					case R_RECORD_1MI :
	    						record_title = '1 mi';
	    						record_value = parseTime(currentRecord.value);
	    						break;

	    					case R_RECORD_5KM :
	    						record_title = '5 km';
	    						record_value = parseTime(currentRecord.value);
	    						break

	    					case R_RECORD_10KM : 
	    						record_title = '10 km';
	    						record_value = parseTime(currentRecord.value, true);
	    						break;

	    					case R_RECORD_21KM :
	    						record_title = 'Half-marathon';
	    						record_value = parseTime(currentRecord.value, true);
	    						break;

	    					case R_RECORD_42KM :
	    						record_title = 'Marathon';
	    						record_value = parseTime(currentRecord.value, true);
	    						break;

	    					case R_RECORD_FARTHEST || C_RECORD_FARTHEST :
	    						record_title = 'Farthest';
	    						record_value = (currentRecord.value / 1000).toFixed(2) + ' km';
	    						break;

	    					case C_RECORD_ELEVATION : 
	    						record_title = 'Elevation Gain';
	    						record_value = currentRecord.value.toFixed(2) + ' m';
	    						break;

	    					case C_RECORD_MAX_AVG_POWER : 
	    						record_title = 'Max Avg Power';
	    						record_value = currentRecord.value;
	    						break;

	    					case C_RECORD_40KM : 
	    						record_title = 'Max Avg Power';
	    						record_value = parseTime(currentRecord.value, true);;
	    						break;

	    					default :
	    						//TODO other other activities ID title
	    						record_title = 'Unknown Record';
	    						record_value = currentRecord.value.toFixed(2);

	    				}
	    				var html = '<li><dl><dt>'+ record_title +'</dt><dd>' + record_value + '</dd></dl></li>';
	    				$ulChild.append(html);
	    			}

	    			function parseTime(seconds,hours){
	    				var start = (hours) ? 11 : 14;
	    				var length = (hours) ? 8 : 5;
						var timeHMS = new Date(null);
			        	timeHMS.setSeconds(seconds);
			        	time = timeHMS.toISOString().substr(start, length);
			        	return time;
	    			}

	    			break;
	    	}
	    	
	    	base.append($wrapper);

	    	if(base.isSlider)
	    	{
	    		base.setSlider();
	    	}

		};

		base.setSlider = function(){
			var $wrapper = base.find('.garmin-widget-wrapper');
			$wrapper.css('position','relative');

			var $gw = base.find('.garmin-widget');
			$gw.addClass('clearfix');

			var $li = $gw.children();
			var liHeight = $($li[0]).height() + 'px';
			$gw.css('overflow', 'hidden')
				.css('position','relative')
				.css('height', liHeight);
			
			$li.css('position','absolute')
				.css('width','100%');

			for(var i = 0; i < $li.length; i++)
			{
				var $currentLi = $($li[i]);
				if(i > 0)
				{
					var $previousLi = $($li[i-1]);
					$currentLi.css('display', 'none');
				}
			}

			if($li.length > 1)
			{
				var $btn = $('<button>');
				$btn.html('>');
				$btn.addClass('gw-slider-btn');
				$btn.click(slide);
				$wrapper.append($btn);
			}

			var counter = 0;
			function slide(){
				if(counter == $li.length - 1)
				{
					$currentLi = $($li[counter]);
					$nextLi = $($li[0]);
					$currentLi.fadeOut();
					$nextLi.fadeIn();
					counter = 0;
				}
				else
				{
					$currentLi = $($li[counter]);
					$nextLi = $($li[counter+1]);
					$currentLi.fadeOut();
					$nextLi.fadeIn();
					counter++;
				}	
			}
		}

		base.printGraphic = function(data){
			var data = data.userMetrics.slice();
			var margin = {top: 80, right: 80, bottom: 80, left: 80},
			    width = parseInt(base.config.width) - margin.left - margin.right,
			    height = parseInt(base.config.height) - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1);

			var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]),
			    y1 = d3.scale.linear().domain([0, 500]).range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			// create left yAxis
			var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left");

			// create right yAxis
			var yAxisRight = d3.svg.axis().scale(y1).ticks(6).orient("right");

			for(var i = 0; i < this.length; i++){
				var container = this[i];
				var $wrapper = $('<div>').addClass('garmin-widget-wrapper');
				var $widget = $('<div>').addClass('garmin-widget').addClass('garmin-widget-graphic');
				$wrapper.append($widget);
				$(container).append($wrapper);
				var svg = d3.select(container.firstChild.firstChild).append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  .append("g")
				    .attr("class", "graph")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				x.domain(data.map(function(d) { return d.month; }));
				y0.domain([0, d3.max(data, function(d) { return d.totalActivities; })]);
				y1.domain([0, d3.max(data, function(d) { return d.totalDistance / 1000; })]);
				  
				svg.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + height + ")")
				    .call(xAxis);
				svg.append("g")
				  .attr("class", "y axis axisLeft")
				  .attr("transform", "translate(0,0)")
				  .call(yAxisLeft)
				.append("text")
				  .attr("y", 6)
				  .attr("dy", "-2em")
				  .style("text-anchor", "end")
				  .style("text-anchor", "end")
				  .text("Activities");
				  
				svg.append("g")
				  .attr("class", "y axis axisRight")
				  .attr("transform", "translate(" + (width) + ",0)")
				  .call(yAxisRight)
				.append("text")
				  .attr("y", 6)
				  .attr("dy", "-2em")
				  .attr("dx", "2em")
				  .style("text-anchor", "end")
				  .text("Distance (km)");

				bars = svg.selectAll(".bar").data(data).enter();
				bars.append("rect")
				    .attr("class", "bar1")
				    .attr("x", function(d) { return x(d.month); })
				    .attr("width", x.rangeBand()/2)
				    .attr("y", function(d) { return y0(d.totalActivities); })
				  .attr("height", function(d,i,j) { return height - y0(d.totalActivities); }); 
				bars.append("rect")
				    .attr("class", "bar2")
				    .attr("x", function(d) { return x(d.month) + x.rangeBand()/2; })
				    .attr("width", x.rangeBand() / 2)
				    .attr("y", function(d) { return y1(d.totalDistance/1000); })
				  .attr("height", function(d,i,j) { return height - y1(d.totalDistance/1000); }); 

				var $title = $('<div>').addClass('title-container').append($('<h2>').html('Activity Graph'));
				$widget.prepend($title)
			}
				
		}	

		base.init(config);
	}
})(jQuery);
	