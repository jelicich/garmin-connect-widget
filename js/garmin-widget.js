 /*
 Garmin Widget
 Version: 1.0
  Author: Esteban Jelicich
 Website: https://github.com/jelicich/garmin-connect-widget
    Docs: -
    Repo: -
  Issues: -	
*/

var GarminWidget = {
	LIMIT : 5,
	ACTIVITIES_URL : 'http://connect.garmin.com/proxy/activitylist-service/activities/',
	STATISTICS_URL : 'http://connect.garmin.com/proxy/userstats-service/statistics/',
	RECORDS_URL : 'http://connect.garmin.com/proxy/personalrecord-service/personalrecord/prs/',
	DEFAULT_START: 1,
	DEFAULT_LIMIT: 5,

	init : function(config){
		if(this.validateConfig(config))
		{
			this.setConfig(config);
			this.getData();
		}	
	},

	validateConfig : function(config){
		var result = true;
		if(typeof config != 'object')
		{
			console.log('Error: wrong data format. Should be an object');
			result = false;
		}
		else
		{
			//selector validation
			if(typeof config.selector == 'undefined')
			{
				console.log('Error: element selector should be provided');
				result = false;
			}
			//username validation
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
						isStartValid = (typeof config.start == 'number' || typeof config.start == 'undefined');
						isLimitValid = (typeof config.limit == 'number' || typeof config.limit == 'undefined');
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
	},

	setConfig : function(config){
		this.selector = config.selector;
		this.data = config.data;
		switch(config.data){
			case 'activities':
				var start = (typeof config.start == 'undefined') ? this.DEFAULT_START : config.start;
				var limit = (typeof config.limit == 'undefined') ? this.DEFAULT_LIMIT : config.limit;
				this.url = this.ACTIVITIES_URL + config.username + '?start=' + start + '&limit=' + limit;
				break;
			
			case 'statistics' :
				var period;
				var group;
				if(config.period == 'yearly')
				{
					period = 'previousDays/';
				}
				else
				{
					period = 'monthly/';
				}
				if(config.group)
				{
					group = '?ByParentType=true';
				}
				else
				{
					group = '?ByParentType=false';
				}
				this.url = this.STATISTICS_URL + period + config.username + group;
				break;

			case 'records' :
				//TODO
				break;
		} 
		//slider config
		if(config.display == 'slider')
		{
			this.isSlider = true;
		}
		else
		{
			this.isSlider = false;
		}
	},

	getData : function(){
		var t = this;
		$.ajax({
			method: 'POST',
			url: 'service/garminConnectService.php',
			data: {
				url: this.url,
			},
			success: function(data) {
				//console.log('data : ',data);
				var json = JSON.parse(data);
				t.printHTML(json);
	    	}
	    });		
	},

	printHTML : function(json){
		//console.log(json);

		$wrapper = $('<div>').attr('id','garmin-widget-wrapper');
    	$ul = $('<ul>').attr('id','garmin-widget');
    	$wrapper.append($ul);

    	switch(this.data)
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

		    		var html = '<li class="activity-container"><div class="title-container"><h2>' + name + '</h2><h3>' + type + ' | ' + date + '</h3></div><ul class="activity-details clearfix"><li><dl><dt>Distance</dt><dd>' + distanceKM + ' km</dd></dt></li><li><dl><dt>Time</dt><dd>' + timeHMS + '</dd></dl></li><li><dl><dt>Avg Pace</dt><dd>' + paceMS + '</dd></dl></li><li><dl><dt>Calories</dt><dd>' + calories + '</dd></dl></li></ul></li>';
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

    				var html = '<li class="activity-container"><div class="title-container"><h2>' + period + '</h2><h3>' + activityType + '</h3></div><ul class="activity-details clearfix"><li><dl><dt>Activities</dt><dd>' + totalActivities + '</dd></dt></li><li><dl><dt>Distance</dt><dd>' + totalDistanceKM + ' km</dd></dt></li><li><dl><dt>Time</dt><dd>' + timeHMS + '</dd></dl></li><li><dl><dt>Calories</dt><dd>' + totalCalories + '</dd></dl></li></ul></li>';
    				$ul.append(html);
    			} 
    			break;
    	}
    	
    	

    	$(this.selector).append($wrapper);

    	if(this.isSlider)
    	{
    		this.setSlider();
    	}

	},

	setSlider : function(){
		var $wrapper = $('#garmin-widget-wrapper');
		$wrapper.css('position','relative');

		var $btn = $('<button>');
		$btn.html('>');
		$btn.attr('id','slider-btn');
		$btn.click(slide);
		$wrapper.append($btn);

		var $gw = $('#garmin-widget');
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
}