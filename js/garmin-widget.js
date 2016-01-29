var GarminWidget = {
	LIMIT : 5,
	ACTIVITIES_URL : 'http://connect.garmin.com/proxy/activitylist-service/activities/',
	STATISTICS_URL : 'http://connect.garmin.com/proxy/userstats-service/statistics/previousDays/',
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
						if(config.period != 'monthly' || config.period != 'yearly')
						{
							console.log('Error: a valid period should be provided. "monthly" or "yearly"');
							result = false;
						}
						break;

					case 'records' :
						// validation
						break;

					default:
						console.log('Error: wrong data value');
						result = false;
				}
			}
			else
			{
				console.log('Error: data value should be provided');
				result = false
			}

		}

		return result;
	},

	setConfig : function(config){
		this.selector = config.selector;
		switch(config.data){
			case 'activities':
				var start = (typeof config.start == 'undefined') ? this.DEFAULT_START : config.start;
				var limit = (typeof config.limit == 'undefined') ? this.DEFAULT_LIMIT : config.limit;
				this.url = this.ACTIVITIES_URL + config.username + '?start=' + start + '&limit=' + limit; 
				break;
			
			case 'statistics' :
				//TODO
				break;

			case 'records' :
				//TODO
				break;

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

    	$ul = $('<ul>').attr('id','garmin-custom-widget');

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

    	$(this.selector).append($ul);
	}
}