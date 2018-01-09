# dateMap 
dateMap it's a simple pure javascript library for selecting dates. Easy to use and easy to add or change styles.

# get started 

<h3>Instalation</h3>

Download files <b>datemap.js</b> and <b>datemap.css</b> from this repository

<h3>Usage</h3>

Include dateMap library on your webpage

```
< script src="datemap.js"></script >
< link rel="stylesheet" href="datemap.css">
```

Init dateMap object

```
< input type = "text" id = "default_example" / >

var dmObj = new dateMap({
  selector   : "#default_example",
  selectDate : function(selectedDate, plugin, event)
  {
      
  },
});
```
Note: Variable "dmObj" and "plugin" parameter is the same dateMap instance 

<h4>Options usage </h4>

```

var dmObj = new dateMap({
    selector: "#default_example",
    dateFormat: 'm/d/y',
    startDate: '09/18/2117',
    weekendColor: '#FFD700',
    disabledEvents:
    [
      {
        title   : "Reserved Event",
        dateStr : "09/19/2017",
      },
      {
        title   : "Reserved Event 2",
        dateStr : "09/21/2017",

      },
    ],
});

```


<h4>Method usage </h4>

```
// close calendar window
dmObj.closeWindow();

// refresh calendar object
dmObj.refresh();

// destroys dateMap instance
dmObj.destroy();

// add new disabled event to dateMap object
dmObj.newDisabledEvent( $date, $title );
```

<h4>Events usage </h4>

```

var dmObj = new dateMap({
    selector   : "#events_example",
    selectDate : function(selectedDate, plugin, event)
    {
        /**
        *   fires when user selects date on calendar
        *   @param this represents active calendar field 
        *   @param selectedDate 
        *   @param plugin 
        */
    },
    moveDate   : function(currentDate, moveObj, plugin)
    {
        /**
        *   fires when user move months/years on calendar
        *   @param this represents active calendar field 
        *   @param moveObj 
        *   @param plugin 
        */
    },
    minMaxClicked   : function(rangeTyoe, currentDate, plugin)
    {
    
    },
		eventClicked    : function(title, currentDate, plugin)
    {
    
    },
    beforeShow :function(plugin)
    {

    },
    onClose    :function()
    {

    },
});

```

Examples : 

  default usage:
    https://jsfiddle.net/TeodorZhelyazkov/cw6c3xfc/
    
  min/max date usage:
    https://jsfiddle.net/TeodorZhelyazkov/2unwgcae/
    
  disabledEvents usage:
    https://jsfiddle.net/TeodorZhelyazkov/8qad6s62/
  
  Min and Max date to another dateMap:
    https://jsfiddle.net/TeodorZhelyazkov/oo3329sn/
    
