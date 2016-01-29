# Garmin Connect Widget
A simple widget to load data from your Garmin profile using the web services provided by Garmin Connect

This widget uses the free Garmin Connect Web API to load your statistics, activities and personal records into your own website. The data is retrieved using a custom web service through an ajax call.

# Usage
To initialize the widget use the method:
GarminWidget.init();

An object should be given to set the configuration
var obj = {
      selector : '#container2',
			username : 'ejelicich',
			data : 'activities',
			limit: 1
    }

in progress..
