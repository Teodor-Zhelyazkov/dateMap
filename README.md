# dateMap.js, datemap.js
dateMap.js is a simple pure javascript lybrary 





Examples : 

  default usage:
    https://jsfiddle.net/TeodorZhelyazkov/cw6c3xfc/


  options usage:
    https://jsfiddle.net/TeodorZhelyazkov/wue4m7ma/
    
    var dmObj = new dateMap({
      selector     	: "#default_example",
      dateFormat   	: 'm/d/y',
      startDate    	: '09/18/2117',
      weekendColor  : '#FFD700',
    });

    
  min/max date usage:
    https://jsfiddle.net/TeodorZhelyazkov/2unwgcae/
    
    var dmObj = new dateMap({
      selector     	: "#minMax_example",
      minDate			: '2017-09-08',
      maxDate			: '2017-09-18',
      weekendColor   	: '#FFD700',
      minMaxClicked: function(rangeType, current, plugin)
      {
        alert("You click : \n "+ rangeType + " \n and date : \n" + current);

        // plugin.closeWindow();
      },
    });

    
  disabledEvents usage:
    https://jsfiddle.net/TeodorZhelyazkov/8qad6s62/
  
  Min and Max date to another dateMap:
    https://jsfiddle.net/TeodorZhelyazkov/oo3329sn/
