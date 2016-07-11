# Garmin Connect Widget
A jQuery plugin to load data from your Garmin profile using the web services provided by Garmin Connect

This plugin uses the free Garmin Connect Web API to load your statistics, activities and personal records into your own website. The data is retrieved using a custom web service through an ajax call.

It is important that your Garmin Connect profile privacy is set to public, otherwise the information won't be available.

# Usage
To initialize the widget use the method:
``` javascript
$('#container').garminWidget();
```
An object should be given to set the configuration, see the following examples:

### Showing Activities
To show the activities the object should be built like the following one:
``` javascript
var conf = {
	username : 'ejelicich',
	data : 'activities',
	display : 'slider',
	start : 1,
	limit : 3
}

$('#container').garminWidget(conf);
```

| Property               | Values                                 | Description                                                                                        |
|------------------------|----------------------------------------|----------------------------------------------------------------------------------------------------|
| `username`             | username                               | Required. Garmin Connect username (Should be a public profile).                                    |
| `data`                 | "activities", "statistics", "records", "graphic"  | Required. The information to be shown.                        .                                    |
| `display`              | "slider", "list"                       | Optional. Set the way the activities are shown. If omitted, default value is "list".               |
| `start`                | number                                 | Optional. The position where to start retrieving the activities. If omitted, default value is "1". |
| `limit`                | number                                 | Optional. The number of activities to show. If omitted, default value is "5".                      |


### Showing Statistics
To show the statistics the object should be built like the following one:
``` javascript
var conf = {
	username : 'ejelicich',
	data : 'statistics',
	period : 'yearly',
	display : 'list',
	group : true
}

$('#container').garminWidget(conf);
```

| Property               | Values                                 | Description                                                                                        |
|------------------------|----------------------------------------|----------------------------------------------------------------------------------------------------|
| `username`             | username                               | Required. Garmin Connect username (Should be a public profile).                                    |
| `data`                 | "activities", "statistics", "records", "graphic"  | Required. The information to be shown.                                                             |
| `display`              | "slider", "list"                       | Optional. Set the way the activities are shown. If omitted, default value is "list".               |
| `period`               | "monthly", "yearly"                    | Optional. Show statistics by month/year. If omitted, default value is "monthly".                   |
| `group`                | "true", "false"                        | Optional. Group the statistics by activity type. If omitted, default value is "false".             |


### Showing Personal Records
To show the personal records the object should be built like the following one:
``` javascript
var conf = {
	username : 'ejelicich',
	data : 'records'
}

$('#container').garminWidget(conf);
```

| Property               | Values                                 | Description                                                                                        |
|------------------------|----------------------------------------|----------------------------------------------------------------------------------------------------|
| `username`             | username                               | Required. Garmin Connect username (Should be a public profile).                                    |
| `data`                 | "activities", "statistics", "records", "graphic" | Required. The information to be shown.                                                             |
| `display`              | "slider", "list"                       | Optional. Set the way the activities are shown. If omitted, default value is "list".               |


### Showing Activities / Distance graphic
To show the graphic the object should be built like the following one:
``` javascript
var conf = {
	username : 'ejelicich',
	data : 'graphic',
	width : 1000,
	height: 500,
}

$('#container').garminWidget(conf);
```

| Property               | Values                                 | Description                                                                                        |
|------------------------|----------------------------------------|----------------------------------------------------------------------------------------------------|
| `username`             | username                               | Required. Garmin Connect username (Should be a public profile).                                    |
| `data`                 | "activities", "statistics", "records", "graphic"  | Required. The information to be shown.                                                             |
| `width`                | number			                      | Optional. Set the width of the graphic. Default value is 900						               |
| `height`               | number			                      | Optional. Set the height of the graphic. Default value is 400						               |
