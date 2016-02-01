# Garmin Connect Widget
A simple widget to load data from your Garmin profile using the web services provided by Garmin Connect

This widget uses the free Garmin Connect Web API to load your statistics, activities and personal records into your own website. The data is retrieved using a custom web service through an ajax call.

It is important that your Garmin Connect profile privacy is set to public, otherwise the information won't be available.

# Usage
To initialize the widget use the method:
``` javascript
GarminWidget.init();
```
An object should be given to set the configuration, see the following examples:

### Showing Activities
To show the activities the object should be built like the following one:
``` javascript
var obj = {
	selector : '#container',
	username : 'ejelicich',
	data : 'activities',
	start : 1,
	limit: 3
}

GarminWidget.init(obj);
```
`start` and `limit` values are not mandatory. If not set, their value will be "1" and "5" respectively.
in progress..

### Showing Statistics
To show the statistics the object should be built like the following one:
``` javascript
var obj = {
	selector : '#container',
	username : 'ejelicich',
	data : 'statistics',
	period : 'yearly',
	group: true
}

GarminWidget.init(obj);
```
`period` and `group` values are not mandatory. If not set, their value will be "monthly" and "false" respectively.

| Property               | Values             |
|------------------------|--------------------|
| `period`               | `monthly`, `yearly`|
| `group`                | `true`, `false`    |

### Showing Personal Records
To show the personal records the object should be built like the following one:
``` javascript
var obj = {
	selector : '#container',
	username : 'ejelicich',
	data : 'records'
}

GarminWidget.init(obj);
```

