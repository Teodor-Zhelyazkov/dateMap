/**
*	@method getDayWeek
*
*	@return {Int}
*
*	return Sunday as '7' not as '0'
*/
Date.prototype.getDayWeek = function()
{
	if( this.getDay() == 0 )
		return 7;
	else
		return this.getDay();
}

var monthNames = [
	"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

// immediately invoked function
(function() {

	// white list
	var dataFormats 	= ['y-m-d', 'y/m/d', 'm-d-y','m/d/y'];

	// Define our constructor
	this.dateMap 		= function()
	{
		// Create global element references
		this.dFormat    = null;
		this.domObjects = null;
		this.objects   	= [];
		this.activeObj 	= null;

		this.options    = {};

		// Define option defaults
		var defaults    =
		{
		 	selector		: '#dateMap',
		  	dateFormat  	: 'y-m-d',
		  	startDate   	: '',
		  	minDate			: '',
		  	maxDate			: '',
		  	position 		: 'right',
		  	weekendColor    : '#a52a2a',
		  	disabledEvents	: [],
		  	moveDate    	: function(currentWindowDate, moveObj, plugin){},
		  	selectDate  	: function(selectedDate, plugin){},
		  	minMaxClicked   : function(rangeTyoe, currentDate, plugin){},
		  	eventClicked    : function(title, currentDate, plugin){},

		  	beforeShow      : function(plugin){},
		  	onClose         : function(){},
		}

		// Create options by extending defaults with the passed in arugments
		if (arguments[0] && typeof arguments[0] === "object")
		{
		  	this.options = extendDefaults(defaults, arguments[0]);
		}

		init.call(this);

	}

	/*
			----	Public Methods	 ----
	*/



	/**
	*	@method Refresh
	*
	*	@return {Void}
	*/
	dateMap.prototype.refresh = function()
	{
		/*
			return false if caller of the function is beforeShow event
		*/
		if( arguments.callee.caller.name == "beforeShow" )
			return false;

		initTable(this);

	}

	/**
	*	@method getMinDate
	*
	*	@return {String}
	*/
	dateMap.prototype.getMinDate = function( )
	{
		return this.options.minDate;
	}

	/**
	*	@method setMinDate
	*
	*	@param {String} OR {Date}
	*
	*	@return {Void}
	*
	*   $newMinDate String :  dFormat
	*   $newMinDate Date   :  new Date object
	*/
	dateMap.prototype.setMinDate = function( $newMinDate )
	{
		if( typeof $newMinDate === 'object' || $newMinDate instanceof Object)
		{
			var dateStr 		 = dateObjToStringByFormat($newMinDate, this.dFormat);
			this.options.minDate =  dateStr
		}
		else if ( typeof $newMinDate === 'string' || $newMinDate instanceof String )
		{
			this.options.minDate = $newMinDate;
		}
	}

	/**
	*	@method getMaxDate
	*
	*	@return {String}
	*/
	dateMap.prototype.getMaxDate = function( )
	{
		return this.options.maxDate;
	}

	/**
	*	@method setMaxDate
	*
	*	@param {String} OR {Date}
	*
	*	@return {Void}
	*
	*   $newMaxDate String :  dFormat
	*   $newMaxDate Date   :  new Date object
	*/
	dateMap.prototype.setMaxDate = function( $newMaxDate )
	{

		if( typeof $newMaxDate === 'object' || $newMaxDate instanceof Object)
		{
			var dateStr 		 = dateObjToStringByFormat($newMaxDate, this.dFormat);
			this.options.maxDate =  dateStr
		}
		else if ( typeof $newMaxDate === 'string' || $newMaxDate instanceof String )
		{
			this.options.maxDate = $newMaxDate;
		}
	}

	/**
	*	@method newDisabledEvent
	*
	*	@param {String} OR {Date}
	*	@param {String}
	*	@param {dateMap}
	*
	*	@return {Void}
	*
	*   $date String 	   :  dFormat
	*   $date Date   	   :  new Date object
	*   $instance Object   :  'dateMap' object (Optional)
	*/
	dateMap.prototype.newDisabledEvent = function( $date, $title )
	{
		var dateString = $date;

		// if is object get string val by format
		if( typeof $date === 'object' || $date instanceof Object)
			dateString = dateObjToStringByFormat($date, this.dFormat);

		var eventDate  = getValueByDateFormat(dateString, this.dFormat);

		// check if event date is valid and if we allready displayed event with same date
		if( isValidDate(eventDate['y'], eventDate['m'], eventDate['d']) !== false )
		{
			var dEv = {
				title   : $title,
				dateStr : dateString
			}

			this.options.disabledEvents.push(dEv);
		}
	}

	/**
	*	@method clearDisabledEvents
	*
	*	@return {Void}
	*/
	dateMap.prototype.clearDisabledEvents = function( )
	{
		//delete all events
		this.options.disabledEvents = [];
	}

	/**
	*	@method destroy
	*
	*	@param {HTMLElement}
	*
	*	@return {Void}
	*
	*   $domObject (Optional) :
	* 		If we pass $domObject detach and destroy only this  element
	* 		else destroy the whole instance
	*/
	dateMap.prototype.destroy = function($domObject = null)
	{
		/*
			if we wanna destroy the full plugin instance
		*/
		if( $domObject === null )
		{
			// delete instance object
			for (var i = 0; i <= this.objects.length - 1; i++)
				if ( this.objects[i] )
					delete this.objects[i];

			// loop dom objects array
			for (var i = 0; i <= this.domObjects.length - 1; i++)
			{
				if( this.domObjects[i] )
				{
					// remkove click event
					this.domObjects[i].onclick = null;

					// clear plugin class-es
					this.domObjects[i].classList.remove("date-t");
					this.domObjects[i].classList.remove("active-d-m");

					// clear plugin attributes
					this.domObjects[i].removeAttribute("data-instance");

					// delete domObject from array
					this.domObjects[i] 		   = null;
					delete this.domObjects[i];
				}
			}

		}

		/*
			If we pass specific DOMObject
		*/
		if( $domObject !== null &&  ( typeof $domObject === 'object' || $domObject instanceof Object ) )
		{
			var id = $domObject.getAttribute('data-instance');

			// delete instance object
			for (var i = 0; i <= this.objects.length - 1; i++)
				if ( this.objects[i] && this.objects[i].id == id )
					delete this.objects[i];

			// loop dom objects array
			for (var i = 0; i <= this.domObjects.length - 1; i++)
			{
				if( this.domObjects[i] && this.domObjects[i].getAttribute('data-instance') == id )
				{
					// remkove click event
					this.domObjects[i].onclick = null;

					// clear plugin class-es
					this.domObjects[i].classList.remove("date-t");
					this.domObjects[i].classList.remove("active-d-m");

					// clear plugin attributes
					this.domObjects[i].removeAttribute("data-instance");

					// delete domObject from array
					this.domObjects[i] 		   = null;
					delete this.domObjects[i];
				}
			}

		}

		// close window
		this.closeWindow();
	}

	/**
	*	@method closeWindow
	*
	*	@return {Void}
	*/
	dateMap.prototype.closeWindow = function()
	{
		/*
			return false if caller of the function is beforeShow event
		*/

		if( arguments.callee.caller.name == "beforeShow" )
			return false;

		// get window DOMobject
		var widnowNodes = document.getElementsByClassName( 'd-m-calendar' );

		// remove old window
		for (var i = 0; i <= widnowNodes.length - 1; i ++ )
			widnowNodes[i].remove();

		// clear active class names
		clearActiveClass();

		// clear active object varible
		this.activeObj = null;

	}

	/*
			----	Private Methods	 ----
	*/


	/**
	*	@method init
	*
	*	@return {Void}
	*
	* 	Init plugin
	*/
	function init()
	{

		// get current date forma in dFormat
		if(  dataFormats.indexOf( this.options['dateFormat'] ) != -1 )
			this.dFormat = dataFormats[ dataFormats.indexOf( this.options['dateFormat'] ) ];
		else
			this.dFormat = 'y-m-d';

		// this.domObjects = document.getElementsByClassName( this.options['className'] );
		this.domObjects = document.querySelectorAll( this.options['selector'] );

		if( this.domObjects.length == 0 )
			return false;

		// declare _this to use inside event-fucntions
		var _this = this;

		for (var i = 0; i < this.domObjects.length; i++)
		{
			var objClass = this.domObjects[i].className;
			// check for re-whrite
			if( objClass.indexOf("date-t") == -1 )
			{

				// generate random number based on the today date
				var instanceId 				  = Math.floor( ( Math.random() * new Date().getTime() ) + 1 );
				//add class for re-whrite
				this.domObjects[i].className += ' date-t';

				// create data-instance to recognize this things
				this.domObjects[i].setAttribute('data-instance', instanceId);

				/* from */

				// get field value
				var objValue  		= this.domObjects[i].value;
				// get value by format
				var fieldDate 		= getValueByDateFormat(objValue, this.dFormat);
				// if no field value but we may got start date.
				if( isValidDate(fieldDate['y'], fieldDate['m'], fieldDate['d']) == false  )
					fieldDate = getValueByDateFormat( this.options['startDate'] , this.dFormat );

				// init date
				var thisObjDateData = initObjDate.call(this, fieldDate);

				// make obj
				var obj = {
					id        : instanceId,					 	// id 		[int]
					date_obj  : thisObjDateData.date_object, 	// date 	[object]
					date_min  : thisObjDateData.min_date,	 	// min_date	[string]
					date_max  : thisObjDateData.max_date,	 	// max_date	[string]
					selectDay : thisObjDateData.select_day,	 	// s_day    [int]
					y 		  : thisObjDateData.y,  		 	// year 	[int] 	- javascript date docs
					m 		  : thisObjDateData.m,  		 	// month 	[int] 	- javascript date docs
					d 		  : thisObjDateData.d,			 	// day 		[int] 	- javascript date docs
					strY 	  : thisObjDateData.strY,		 	// year 	[string]
					strM 	  : thisObjDateData.strM,		 	// month 	[string]
					strD 	  : thisObjDateData.strD,		 	// day 		[string]
					domObj    : this.domObjects[i],			 	// domObj 	[object]
					dateFmt   : this.dFormat,			 		// dateFmt 	[string]
				}

				// TODO ?? update fied valie
				// if( thisObjDateData.select_day != 0 )
					// obj.domObj.value = dateObjToStringByFormat(thisObjDateData.date_object, this.dFormat);

				// push obj to objects array
				this.objects.push(obj);

				/* to */

				// this.domObjects[i].addEventListener("click", function(event){
				this.domObjects[i].onclick = function(event)
				{
					// if this field is not active
					if( event.target.className.indexOf("active-d-m") == -1 )
					{
						setTimeout(function(){

							// send instance-plugin and instanceId to find and re-init the field value
							initField( _this, event.target.getAttribute('data-instance') );

							/*
								The reason for setTimeout function is becouse of "if we click outside calendar " Event
								and the need for that is onClose Event

								*** explain:
								- "if we click outside calendar " Event fired right back this click event
								- and can't catch "active-d-m" class never
								- this event build the calendar and the second event close it
								- so we put some time to both events finds his places in logic
							*/

							// assign active class name
							event.target.className += ' active-d-m'

							// assign activeObj
							_this.activeObj = event.target;

							// trigger beforeShow custom event pass activeObj and pluginInstance
							_this.options.beforeShow.call(_this.activeObj, _this);

							// pass event-DOMelement 'this' and inctance '_this'
							build.call(event.target, _this);

						},0); // end of setTimeout

					}

				} // end of input-field click event


			} // end of check for re-whrite

		} // end of for loop 'domObjects'

		// if we click outside calendar
		document.addEventListener("click", function(event){

			// if we dont have active element yet
			if( _this == undefined ||  _this.activeObj == null )
				return false;

			// get active field-window
			var insId = _this.activeObj.getAttribute('data-instance');
			var cont  = document.getElementById( 'wndw_'+ insId );

	      	//element clicked wasn't the div and wasn't some of the fields; hide the div
		    if( cont !== null && !cont.contains(event.target) && event.target.className.indexOf("date-t active-d-m") == -1 )
		    {
		    	// call onClose Event
		    	_this.options.onClose.call(_this.activeObj);

		    	 // close calendar window and clear active class names
				_this.closeWindow();
		    }

		}); // end of document - click event



	} // edn of 'init' (contructor) funciton()

	/**
	*	@method build
	*
	*	@param {dateMap}
	*
	*	@return {Void}
	*/
	function build($thisInstance)
	{
		/*
			'this' is the dom object of clicked input field
		*/

		// get instance value from event-object [ in this we got DOMobject ]
		var instValId = this.getAttribute('data-instance');

		// create div
		var div       = document.createElement("div");
		// Create a "class" attribute
		div.className = 'd-m-calendar'
		// set id assign this object instance id to window
		div.id 		  = 'wndw_'+instValId

		// append div to the html
		document.body.appendChild(div);

		// get coordinates
		var leftPos   	   = this.offsetLeft;
		var topPos 	  	   = this.offsetTop;
		// put position on the div
		div.style.top 	   = parseInt( topPos + this.offsetHeight + 10 ) + 'px';
		div.style.left 	   = parseInt( leftPos + 10 ) + 'px';

		// assign element active varible
		var el = getActElement($thisInstance);

		// set data attributes
		div.setAttribute('data-month', el.m);
		div.setAttribute('data-year', el.y);

		div.innerHTML +=
			'<div class = "d-m-header">'
			+	'<a class="butt-move d-m-h-prev" data-destination = "prev" title="Prev"> <span></span> </a>'
			+	'<a class="butt-move d-m-h-next" data-destination = "next" title="Next"> <span></span> </a>'
			+   '<div class = "d-m-h-title">'
			+   	'<span class="sw-type d-m-h-title-month active-sw-type" data-swtype = "month" title = "'+monthNames[ el.m ] + ' ' + el.y +'" >' + monthNames[ el.m ].substr(0, 3) + '</span>'
			+   	'<span class="sw-type d-m-h-title-year" data-swtype = "year" title = "'+monthNames[ el.m ] + ' ' + el.y +'" >' + el.y + '</span>'
			+   '</div>'
			+'</div>';

		// store arrows and switch-type-buttons in arrays
		var arrows 		  = document.getElementsByClassName('butt-move');
		var switchButtons = document.getElementsByClassName('sw-type');

		/*
			Make arrows and switch-type-buttons EVENTS
		*/

		for (var i = 0; i < arrows.length; i++)
		{
			arrows[i].addEventListener("click", function(event){

				// re-init table
				initTable($thisInstance, this.getAttribute('data-destination') );

			});
		}

		for (var i = 0; i < switchButtons.length; i++)
		{
			switchButtons[i].addEventListener("click", function(event){
				if( this.className.indexOf("active-sw-type") == -1 )
				{
					// clear switch types class
					switchButtons[0].className = switchButtons[0].className.replace(" active-sw-type", "");
					switchButtons[1].className = switchButtons[1].className.replace(" active-sw-type", "");
					// make aktive class this button
					this.className += " active-sw-type"

				}
			});
		}

		initTable($thisInstance);

	}

	/**
	*	@method initTable
	*
	*	@return {Void}
	*
	*	refresh the table window
	*/
	function initTable($thisInstance, $direction)
	{
		// get active element
		var el     		 = getActElement($thisInstance);

		if( el == false )
			return false;

		// check if we have old table and remove
		if( document.getElementById('w_table_dates') !== null)
			document.getElementById('w_table_dates').remove();
		// get window in var
		var windDiv      = document.getElementById('wndw_'+el.id);
		// create table element
		var table        = document.createElement('table');
		// assign id
		table.id 		 = "w_table_dates";

		table.innerHTML +=
			'<thead>'
				+ '<tr>'
					+ '<th> <span title="Monday"	>Mo</span> </th>'
					+ '<th> <span title="Tuesday"	>Tu</span> </th>'
					+ '<th> <span title="Wednesday" >We</span> </th>'
					+ '<th> <span title="Thursday"	>Th</span> </th>'
					+ '<th> <span title="Friday"	>Fr</span> </th>'
					+ '<th> <span title="Saturday"	>Sa</span> </th>'
					+ '<th> <span title="Sunday"	>Su</span> </th>'
				+ '</tr>'
			+ '</thead>'
			+ '<tbody id = "w_table_dates_body">'
			+ '</tbody>'

		// append table
		windDiv.appendChild(table);

		// get switch type
		var swType 		= document.getElementsByClassName('active-sw-type');
		var swTypeValue = swType[0].getAttribute('data-swtype');

		// get curent window date
		var year  = windDiv.getAttribute('data-year');
		var month = windDiv.getAttribute('data-month');

		// make date objct from window data
		var dateObj = new Date(year, month, 1);
		// if we got direction calculate + or - [year, month] by type
		if( $direction !== undefined && $direction == 'next' )
		{
			if( swTypeValue == 'month' )
				dateObj.setMonth( dateObj.getMonth() + 1 );
			else if ( swTypeValue == 'year' )
				dateObj.setYear( dateObj.getFullYear() + 1 );
		}
		else if ( $direction !== undefined && $direction == 'prev' )
		{
			if( swTypeValue == 'month' )
				dateObj.setMonth( dateObj.getMonth() - 1 );
			else if ( swTypeValue == 'year' )
				dateObj.setYear( dateObj.getFullYear() - 1 );
		}

		// re assign window date-data
		windDiv.setAttribute('data-year', dateObj.getFullYear());
		windDiv.setAttribute('data-month', dateObj.getMonth());

		// update title html
		document.getElementsByClassName('d-m-h-title-month')[0].innerHTML = monthNames[ dateObj.getMonth() ].substr(0, 3);
		document.getElementsByClassName('d-m-h-title-year')[0].innerHTML  = dateObj.getFullYear();


		/*
			///// get Today, Min and Max dates
		*/

		// get todays date
		var todayDate  = new Date();

		// assign 'Min' and 'Max' objects
		var minDateObj = null;
		var	maxDateObj = null;

		if ( el.date_min !== '' )
		{
			// object with y,m,d values by date format
			var minDatval = getValueByDateFormat(el.date_min, $thisInstance.dFormat);
			// min date object
			minDateObj	  = new Date( parseInt(minDatval['y']), parseInt(minDatval['m']) - 1, parseInt(minDatval['d']) );
		}
		if ( el.date_max !== '' )
		{
			// object with y,m,d values by date format
			var maxDatval = getValueByDateFormat(el.date_max, $thisInstance.dFormat);
			// max date object
			maxDateObj	  = new Date( parseInt(maxDatval['y']), parseInt(maxDatval['m']) - 1, parseInt(maxDatval['d']) );
		}

		/*
			///// end
		*/



		/*
			///// get weeks count
		*/

		// calculate curent month range [first, last] days
		var firstDayOfNextMonthDate = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1,1);
		var firstDayOfMonthDate 	= new Date(dateObj.getFullYear(), dateObj.getMonth(),1);
		var lastDayofMonthDate 		= new Date(firstDayOfNextMonthDate - 1);

		// get sum of first day of week monday or sunday [1 to 7 (7 is sunday)] and last day of this month
		var sum  		= firstDayOfMonthDate.getDayWeek() + lastDayofMonthDate.getDate();

		// calculate count of weeks in this moneth
		var weeksCount  =  Math.ceil( sum / 7);

		/*
			///// end
		*/

		// get table body
		var tableBody   = document.getElementById('w_table_dates_body');

		// count rows for listet days in table
		var rowDayList  = 0;

		// successfully displayed days in table
		var dispDays    = 0;

		// loop weeks in this month
		for (var i = 0; i < weeksCount; i++)
		{
			// if we display all the days in the table break loop
			if( dispDays >= lastDayofMonthDate.getDate() )
				break;
			// make coutWd var to count table week days Monday/Sunday [1 to 7]
			var countWd = 1;
			// add <tr> tag
			tableBody.innerHTML += '<tr>';

			// Loop days in this month !
			for (var d = firstDayOfMonthDate.getDate() + rowDayList;  d <= sum ; d ++)
			{
				// break loop if for this week of month we count from Monday to Sunday
				if(countWd > 7)
					break;

				var curentDate 	    = new Date(dateObj.getFullYear(), dateObj.getMonth(), d );
				// get current week-day
				var currentMonthDay = curentDate.getDayWeek();

				// if table week-day is != from current week-day OR current day is bigger than a lastDayofMonthDate - day
				if( countWd != currentMonthDay || d > lastDayofMonthDate.getDate()  )
				{
					tableBody.childNodes[ tableBody.childNodes.length - 1 ].innerHTML += '<td class = "w_table_empty" ></td>';
					d --;
					rowDayList --;
				}
				else
				{
					var tdClassNames = 'w_table_days';
					// chek for selected day and today's - date
					if ( todayDate.getDate() == d && todayDate.getMonth() == dateObj.getMonth() && todayDate.getFullYear() == dateObj.getFullYear() )
						tdClassNames += ' today_day'
					else if ( el.selectDay == d && el.m == dateObj.getMonth() && el.y == dateObj.getFullYear() )
						tdClassNames += ' selected_day'

					// if current date is outside Min or Max values AND Min and Max values !== null
					if ( ( minDateObj !== null && curentDate.getTime() < minDateObj.getTime() ) || ( maxDateObj !== null && curentDate.getTime() > maxDateObj.getTime() ) )
						tdClassNames += ' disabled_range'

					// regular expretion for CSS colors ( falid [ #fff, #ffffff ] )
					var patt  = new RegExp( /^#(?:[0-9a-f]{3}){1,2}$/i );
					var res   = patt.test( $thisInstance.options['weekendColor'] );
					// inline-style varible
					var style = '';

					// if table week day is Sat or Sun AND color != '' and chosen color is valid AND we are not in today_day or selected_day
					if ( ( countWd == 6 || countWd == 7 ) && ( $thisInstance.weekendColor !== '' && res ) && ( tdClassNames.indexOf('today_day') == -1  && tdClassNames.indexOf('selected_day') == -1 ) )
					{
						// style = 'style = "color:  ' + $thisInstance.options['weekendColor'] + '"';
						style = 'color:  ' + $thisInstance.options['weekendColor'] + ';';
						tdClassNames += ' weekend_day'
					}

					tableBody.childNodes[ tableBody.childNodes.length - 1 ].innerHTML += '<td class = "'+tdClassNames+'" data-dmonth = "'+dateObj.getMonth()+'" data-dday = "'+d+'"  style = "' + style + '" >'+d+'</td>';
					dispDays ++;
				}

				// incement week-day var
				countWd = countWd + 1;

			} // end of Loop days in this month !


			rowDayList  = rowDayList + 7;

			tableBody.innerHTML += '</tr>';

		} // end of loop weeks in this month

		/*
			Loop table days and make events onClick
			* update/assign disabledEvents
			* update values
			* assign selectDate event
		*/

		var tdNodes = document.getElementsByClassName('w_table_days');

		for (var k = 0; k < tdNodes.length; k++)
		{
			// get current td node and day in varibles
			var elem 	= tdNodes[k];
			var elemDay = elem.getAttribute('data-dday');

			/*
				if we have disabledEvents array not empty
			*/
			//////////////////////////////////////////////////
			var curentTdDate  = new Date(dateObj.getFullYear(), dateObj.getMonth(), elemDay );

			//assign empty events title
			var evTitle 	  = "";
			var newClass 	  = "";
			//assign empty events unique array
			var displayEvents = [];

			if ( $thisInstance.options.disabledEvents.length > 0 )
			{
				// loop disabledEvents
				for (var i = 0; i < $thisInstance.options.disabledEvents.length; i++)
				{

					// get event string properties by date format
					var eventDate = getValueByDateFormat($thisInstance.options.disabledEvents[i].dateStr, $thisInstance.dFormat);

					// check if event date is valid and if we allready displayed event with same date
					if( isValidDate(eventDate['y'], eventDate['m'], eventDate['d']) !== false  && displayEvents.indexOf( $thisInstance.options.disabledEvents[i].dateStr ) == -1 )
					{

						// make date object from ints
						var evDatObj = new Date(parseInt(eventDate['y']), (parseInt(eventDate['m']) -1 ), parseInt(eventDate['d']));

						if( evDatObj.getDate() == elemDay && evDatObj.getMonth() == curentTdDate.getMonth() && evDatObj.getFullYear() == curentTdDate.getFullYear() )
						{
							// assign disabledEvents class
							newClass += " dis-events";
							// assign event title
							evTitle  += $thisInstance.options.disabledEvents[i].title;
						}

						// push displayed events in array
						displayEvents.push( $thisInstance.options.disabledEvents[i].dateStr );

					} // end of check if event date is valid

				} // end of loop disabledEvents

			} // end of if we have disabledEvents array not empty

			// set elem calss
			elem.className +=  newClass;
			// set elem event title
			elem.setAttribute('data-evtitle', evTitle )
			//////////////////////////////////////////////////


			if( elem.className.indexOf('disabled_range') == -1 && elem.className.indexOf('dis-events') == -1 )
			{
				elem.addEventListener("click", function(event){

					// get day - data
					var y = dateObj.getFullYear();
					var m = this.getAttribute('data-dmonth');
					var d = this.getAttribute('data-dday');
					// this day date object
					var dayDate = new Date(y, m, d);

					/*
						call event and pass dayDate to func
					*/


					$thisInstance.options.selectDate.call($thisInstance.activeObj, dayDate, $thisInstance, event);


					// get string from object by format
					var strDate = dateObjToStringByFormat(dayDate, $thisInstance.dFormat)

					// change field's 'value' attribute
					el.domObj.setAttribute('value', strDate);
					el.domObj.value = strDate;

					// TODO ???
					// re-init this object [it seems noo need for this at this time]
					// initField($thisInstance, $thisInstance.activeObj.getAttribute('data-instance'))

					// close window
					$thisInstance.closeWindow();

				});
			}
			else if ( elem.className.indexOf('disabled_range') != -1 )
			{
				elem.addEventListener("click", function(event){

					// stop event propagation to escape "click outside calendar" event logic ( afater refresh() public method )
					event.stopPropagation()

					// get day - data
					var y = dateObj.getFullYear();
					var m = this.getAttribute('data-dmonth');
					var d = this.getAttribute('data-dday');
					// this day date object
					var dayDate = new Date(y, m, d);

					/*
						call event method if user want to say something :D (
						*min or max date clicked
					*/
					var flag = '';
			  		if(dayDate <= new Date(el.date_min))
			  			flag = 'min';
			  		if(dayDate >= new Date(el.date_min))
			  			flag = 'max';

					$thisInstance.options.minMaxClicked.call($thisInstance.activeObj, flag, dayDate, $thisInstance);

				});
			}
			else if ( elem.className.indexOf('dis-events') != -1 )
			{
				elem.addEventListener("click", function(event){

					// stop event propagation to escape "click outside calendar" event logic ( afater refresh() public method )
					event.stopPropagation()

					// get day - data
					var y = dateObj.getFullYear();
					var m = this.getAttribute('data-dmonth');
					var d = this.getAttribute('data-dday');
					// this day date object
					var dayDate = new Date(y, m, d);

					/*
						call event method if user want to say something :D (
						*disabled event clicked
					*/
					$thisInstance.options.eventClicked.call($thisInstance.activeObj,  this.getAttribute('data-evtitle'), dayDate, $thisInstance);
				});
			}
		} // end of loop tdNodes


		/*
			if user click arrows and move dates trigger "moveDate" event
			* pass curent windowDate = dateObj
		*/
		if ( $direction !== undefined )
		{
			var moveObj = {
				type 	  : swTypeValue,
				direction : $direction
			}
			$thisInstance.options.moveDate.call($thisInstance.activeObj, dateObj, moveObj, $thisInstance);
		}

	}

	/**
	*	@method initField
	*
	*	@param {HTMLElement}
	*	@param {Number}
	*
	*	@return {Void}
	*
	*	re-init input-field value and re-write this.objects[ for this instanceId ]
	*/
	function initField($this, $instanceId)
	{
		for ( var i = 0; i <= $this.objects.length -1 ; i++ )
		{
			if( $this.objects[i] && $this.objects[i].id == $instanceId )
			{
				// get field value
				var objValue  		= $this.objects[i].domObj.value;
				// get value by format
				var fieldDate 		= getValueByDateFormat(objValue, $this.dFormat);

				// if no field value but we may got start date.
				if( isValidDate(fieldDate['y'], fieldDate['m'], fieldDate['d']) == false  )
					fieldDate = getValueByDateFormat( $this.options['startDate'] , $this.dFormat );

				// init date
				var thisObjDateData = initObjDate.call($this, fieldDate);

				// re-whrite properties
				$this.objects[i].date_obj  = thisObjDateData.date_object; // date 	  [object]
				$this.objects[i].date_min  = thisObjDateData.min_date;	  // min_date [string]
				$this.objects[i].date_max  = thisObjDateData.max_date;	  // max_date [string]
				$this.objects[i].selectDay = thisObjDateData.select_day;  // s_day    [int]

				$this.objects[i].y 		   = thisObjDateData.y;  		  // year 	  [int]   - javascript date docs
				$this.objects[i].m 		   = thisObjDateData.m;  		  // month 	  [int]   - javascript date docs
				$this.objects[i].d 		   = thisObjDateData.d;			  // day 	  [int]   - javascript date docs

				$this.objects[i].strY 	   = thisObjDateData.strY;		  // year 	  [string]
				$this.objects[i].strM 	   = thisObjDateData.strM;		  // month 	  [string]
				$this.objects[i].strD 	   = thisObjDateData.strD;		  // day 	  [string]

				// TODO ?? update fied valie
				// if( thisObjDateData.select_day != 0)
					// $this.objects[i].domObj.value = dateObjToStringByFormat(thisObjDateData.date_object, $this.dFormat);
			}

		}
	}

	/**
	*	@method getActElement
	*
	*	@param {dateMap}
	*
	*	@return {HTMLElement}
	*/
	function getActElement($instance)
	{
		// if we dont have active element yet
		if( $instance.activeObj == null )
			return false;
		// find and return the active element from instance array
		for(var i = 0; i <= $instance.objects.length - 1 ; i++ )
			if( $instance.objects[i] && $instance.objects[i].id == $instance.activeObj.getAttribute('data-instance') )
				return $instance.objects[i];
	}

	/**
	*	@method clearActiveClass
	*
	*	@return {Void}
	*/
	function clearActiveClass()
	{
		var fields = document.getElementsByClassName('date-t');
		for (var i = 0; i < fields.length; i++)
			fields[i].className = fields[i].className.replace(" active-d-m", "");
	}


	/**
	*	@method initObjDate
	*
	*	@param {Object}
	*
	*	@return {Object}
	*
	*   $fieldDate : with keys y, m, d
	*
	*   Chek field date and compare it if we got minDate and maxDate / and init a select day [format: obj.y, obj.m etc.]
	*/
	function initObjDate($fieldDate)
	{
		/*
			'this' is the plugin instance
		*/

		// make the return object
		var datesObject = {};

		// check and init min and max dates from config array
		datesObject.min_date = '';
		datesObject.max_date = '';
		var min 		     = getValueByDateFormat( this.options['minDate'], this.dFormat );
		var max 		     = getValueByDateFormat( this.options['maxDate'], this.dFormat );
		var minDate  		 = new Date(min['y']+'-'+min['m']+'-'+min['d']);
		var maxDate  		 = new Date(max['y']+'-'+max['m']+'-'+max['d']);
		if( this.options['minDate'] != '' )
		{
			if(  minDate == 'Invalid Date' || isValidDate(min['y'], min['m'], min['d']) == false )
				this.options['minDate'] = '';
			else if(  maxDate != 'Invalid Date' && maxDate.getTime() < minDate.getTime() )
				this.options['minDate'] = '';
			else
				datesObject.min_date =  this.options['minDate'];
		}
		if( this.options['maxDate'] != '' )
		{
			if(  maxDate == 'Invalid Date' || isValidDate(max['y'], max['m'], max['d']) == false )
				this.options['maxDate'] = '';
			else if(  minDate != 'Invalid Date' && maxDate.getTime() < minDate.getTime() )
				this.options['maxDate'] = '';
			else
				datesObject.max_date = this.options['maxDate'];
		}

		// chosen day from field value or start date from options
		var chosenDay = 0;
		// make date object from taken values
		var date      = new Date($fieldDate['y']+'-'+$fieldDate['m']+'-'+$fieldDate['d']);
		// if the user values are not valid
		if( date == 'Invalid Date' || isValidDate($fieldDate['y'], $fieldDate['m'], $fieldDate['d']) == false )
			date = new Date();
		else
			chosenDay = date.getDate();


		// if min date is bigger than values date
		if ( datesObject.min_date !== '' && minDate.getTime() > date.getTime() )
		{
		 	date 	  = new Date( min['y']+'-'+min['m']+'-'+min['d'] )
		 	chosenDay = 0;
		}
		// if max date is less than values date
		if ( datesObject.max_date !== '' && maxDate.getTime() < date.getTime() )
		{
		 	date 	  = new Date( max['y']+'-'+max['m']+'-'+max['d'] )
		 	chosenDay = 0;
		}

		// init m,d string vals
		var mm = date.getMonth() + 1;
		var dd = date.getDate();
		if ( mm < 10 )
			mm = '0' + mm;
		if ( dd < 10 )
			dd = '0' + dd;

		// set date time to "00:00:00" if you make date object from string values it takes surver time
		date.setHours(0,0,0,0);

		// set the return object
		datesObject.date_object = date;
		datesObject.select_day 	= chosenDay;
		datesObject.y 			= date.getFullYear();
		datesObject.m 			= date.getMonth();
		datesObject.d 			= date.getDate();
		datesObject.strY 		= date.getFullYear().toString();
		datesObject.strM 		= mm;
		datesObject.strD 		= dd;

		return datesObject;

	}

	/**
	*	@method isValidDate
	*
	*	@param {Number}
	*	@param {Number}
	*	@param {Number}
	*
	*	@return {Bool}
	*/
	function isValidDate ( $year, $month, $day )
	{
		var succ    = true;
		var maxYear = 3200;
		var minYear = 1975;

		// year chek
		if( ($year.length < 4) || $year < minYear || $year > maxYear)
			succ = false;
		// moth chek
		if( ($month.length < 2) || $month < 1 || $month > 12)
			succ = false;
		// day chek
		if( ($day.length < 2) || $day < 1 || $day > 31)
			succ = false;

		return succ;
	}

	/**
	*	@method getValueByDateFormat
	*
	*	@param {String}
	*	@param {String}
	*
	*	@return {Object}
	*
	*	$objValue  : HTMLElement value
	*	$datFormat : dFormat
	*/
	function getValueByDateFormat ( $objValue, $datFormat )
	{
		// find the format string splitter
		var splitter 	= '';
		if( $datFormat.indexOf("/") != -1 )
			splitter 	= '/';
		if( $datFormat.indexOf("-") != -1 )
			splitter 	= '-';
		// get format y-m-d and objValue in array
		var formatArr 	= $datFormat.split(splitter);
		var dateArr 	= $objValue.split(splitter);
		var dateData    = {
			y:'',
			m:'',
			d:'',
		};
		// if date does not has 2 spliters
		if(dateArr.length < 3 || dateArr.length > 3)
			return dateData

		// loop date arr
		for (var i = 0; i < dateArr.length; i++)
			if ( dateArr[i] != '' )
				dateData[ formatArr[ i ] ] = dateArr[i];

		/*
			chek evry length
		*/
		if( ( dateData.y.length > 4 || dateData.y == "" ) || ( dateData.m.length > 2 || dateData.m == "" ) || ( dateData.d.length > 2 || dateData.d == "" ) )
		{
			return {
				y:'',
				m:'',
				d:'',
			};
		}

		return dateData;
	}

	/**
	*	@method dateObjToStringByFormat
	*
	*	@param {Date}
	*	@param {String}
	*
	*	@return {String}
	*
	*	$dFormat : dFormat
	*/
	function dateObjToStringByFormat ($date, $dFormat)
	{

		// find the format string splitter
		var splitter 	= '';
		if( $dFormat.indexOf("/") != -1 )
			splitter 	= '/';
		if( $dFormat.indexOf("-") != -1 )
			splitter 	= '-';

		// get format chars in array
		var splitArr = $dFormat.split(splitter);

		// init m,d string vals
		var yy = $date.getFullYear().toString();
		var mm = $date.getMonth() + 1;
		var dd = $date.getDate();
		if ( mm < 10 )
			mm = '0' + mm;
		if ( dd < 10 )
			dd = '0' + dd;

		// make object
		var objDate = {
			m : mm,
			d : dd,
			y : yy,
		}
		// string for returning
		var string = '';
		// loop spliter array
		for (var i = 0; i < splitArr.length; i++)
		{
			if( i == 0 )
				string += objDate[ splitArr[ i ] ];
			else
				string += splitter + objDate[ splitArr[ i ] ];
		}

		return string;

	}

	/**
	*	@method extendDefaults
	*
	*	@param {Object}
	*	@param {Object}
	*
	*	@return {Object}
	*
	*	Utility method to extend defaults with user options
	*/
	function extendDefaults(source, properties)
	{
	    var property;
	    for (property in properties)
	        if (properties.hasOwnProperty(property))
		        source[property] = properties[property];
	    return source;
	}

}());
