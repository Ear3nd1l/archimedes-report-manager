function logToConsole(val) {
	
	try
	{
		console.log(val);
	}
	catch(ex)
	{
	}
	
};

function getQueryString() {
	var result = {}, queryString = location.search.substring(1);
	var re = /([^&=]+)=([^&]*)/g, m;
	
	while (m = re.exec(queryString)) 
	{
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	
	return result;
};

function sort(element, tag, attr)
{
	var elementArray = element.children(tag).get();
	elementArray.sort(function(a,b) {
		if(attr == 'undefined')
		{
			var compA = $(a).text().toUpperCase();
			var compB = $(b).text().toUpperCase();
		}
		else
		{
			var compA = $(a).attr(attr).toUpperCase();
			var compB = $(b).attr(attr).toUpperCase();
		}
		return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	});
	$.each(elementArray, function(idx, itm){element.append(itm); });
};
	
function listFind(list, value, delimiter) {
	
	var arrItems = list.split(delimiter);
	
	for(i=0;i<arrItems.length;i++)
	{
		if(arrItems[i] == value)
		{
			return i + 1;
		}
	}
	
	return 0;
	
};

function stripToNumeric(str){
	str = str.replace(/[^0-9]/g, '');
	return str;
};

function validateEmail(str) {
	var re = new RegExp('^\\w+((-\\w+)|(\\.\\w+))*\\@\\w+((\\.|-)\\w+)*\\.([a-zA-Z]{2}|com|net|org|edu|mil|biz|gov|info|museum|name|coop|int)$');
	return re.test(str);
};

function validateDate(str) {
	var re = new RegExp('^[0,1]?\\d{1}\\\/(([0-2]?\\d{1})|([3][0,1]{1}))\\\/(([1]{1}[9]{1}[9]{1}\\d{1})|([2-9]{1}\\d{3}))$');
	return re.test(str);
};

function validateCurrency(str) {
	var re = new RegExp('^(\\$)?(\\d{1,3}(\\,\\d{3})*|(\\d+))(\\.\\d{2})?$');
	return re.test(str);
};

function validateNumericOnly(str) {
	var re = new RegExp('^\\d{1,}(\\.\\d{1,}|)$');
	return re.test(str);
};

function validateURL(str) {
	var re = new RegExp('^(http(s?)\\:\\\/\\\/)?[\\w-]*(\\.?[\\w-]+)*(\\.([a-zA-Z0-9]{2}|(com|net|org|edu|mil|biz|gov|info|museum|name|coop|int))){1}(\/[\\w- .\/?%##=]*)?$');
	return re.test(str);
};

function validatePhone(str) {
	str = stripToNumeric(str);
	if(str.length == 10)
	{
		return true;
	}
	else
	{
		return false;
	}
};

function validateZipcode(str) {
	var re = new RegExp('\\d{5}$|^\\d{5}-\\d{4}$');
	return re.test(str);
};

function validateRequiredLength(str, len) {
	if(str.length >= len)
	{
		return true;
	}
	else
	{
		return false;
	}
};

function validateMaxLength(str, len) {
	if(str.length <= len)
	{
		return true;
	}
	else
	{
		return false;
	}
};

function validateLengthRange(str, minLen, maxLen) {
	if(str.length <= maxLen && str.length >= minLen)
	{
		return true;
	}
	else
	{
		return false;
	}
};

function validateGreaterThan(val, comp)
{
	if(val > comp)
	{
		return true;
	}
	else
	{
		return false;
	}
};

function validateLessThan(val, comp)
{
	if(val < comp)
	{
		return true;
	}
	else
	{
		return false;
	}
};

function validateForm(thisForm, callback){
	
		var isValidForm = true;
		
		try
		{
		
			//Required
			thisForm.find('.validateRequired').each(function(){
				
				var fieldValue = $(this).val();
				
				if(validateRequiredLength(fieldValue, 1) == false)
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('This field is required.');
					isValidForm = false;
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Specified Length
			thisForm.find('.validateRequiredLength').each(function(){
				
				var fieldValue = $(this).val();
				
				if(validateRequiredLength(fieldValue, $(this).attr('minLength')) == false)
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('This field must be at least ' + $(this).attr('minLength') + ' characters.');
					isValidForm = false;
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Max Length
			thisForm.find('.validateMaxLength').each(function(){
	
				var fieldValue = $(this).val();
				
				if(validateMaxLength(fieldValue, $(this).attr('maxLength')) == false)
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('This field cannot be longer than ' + $(this).attr('maxlength') + ' characters.');
					isValidForm = false;
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Length Range
			thisForm.find('.validateLengthRange').each(function(){
	
				var fieldValue = $(this).val();
				
				if(validateLengthRange(fieldValue,$(this).attr('minLength'), $(this).attr('maxLength')) == false)
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('This field must be between ' + $(this).attr('minlength') + ' and ' + $(this).attr('maxlength') + ' characters.');
					isValidForm = false;
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Email
			thisForm.find('.validateEmail').each(function(){
				
				var fieldValue = $(this).val();
				
				if($(this).hasClass('validateRequired') || fieldValue.length)
				{
					if(validateEmail(fieldValue) == false)
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('Please enter a valid email.');
						isValidForm = false;
					}
					else
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
					}
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Numeric Only
			thisForm.find('.validateNumericOnly').each(function(){
				
				var fieldValue = $(this).val();
				
				if($(this).hasClass('validateRequired') || fieldValue.length)
				{
					if(validateNumericOnly(fieldValue) == false)
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('Please enter a valid number.');
						isValidForm = false;
					}
					else
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
					}
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Dates
			thisForm.find('.validateDate').each(function(){
				
				var fieldValue = $(this).val();
				
				if($(this).hasClass('validateRequired') || fieldValue.length)
				{
					if(validateDate(fieldValue) == false)
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('Please enter a valid date.');
						isValidForm = false;
					}
					else
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
					}
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Currency
			thisForm.find('.validateCurrency').each(function(){
				
				var fieldValue = $(this).val();
				
				if($(this).hasClass('validateRequired') || fieldValue.length)
				{
					if(validateCurrency(fieldValue) == false)
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('Please enter a valid dollar amount.');
						isValidForm = false;
					}
					else
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
					}
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//URL
			thisForm.find('.validateURL').each(function(){
				
				var fieldValue = $(this).val();
				
				if($(this).hasClass('validateRequired') || fieldValue.length)
				{
					if(validateURL(fieldValue) == false)
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('Please enter a valid URL.');
						isValidForm = false;
					}
					else
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
					}
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Phone
			thisForm.find('.validatePhone').each(function(){
				
				var fieldValue = $(this).val();
				
				if($(this).hasClass('validateRequired') || fieldValue.length)
				{
					if(validatePhone(fieldValue) == false)
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('Please enter a valid phone number.');
						isValidForm = false;
					}
					else
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
					}
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Zipcode
			thisForm.find('.validateZipcode').each(function(){
				
				var fieldValue = $(this).val();
				
				if($(this).hasClass('validateRequired') || fieldValue.length)
				{
					if(validateZipcode(fieldValue) == false)
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('Please enter a valid zip code.');
						isValidForm = false;
					}
					else
					{
						$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
					}
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Greater Than
			thisForm.find('.validateGreaterThan').each(function(){
	
				var fieldValue = $(this).val();
				var comp = $(this).attr('comp');
				
				LogToConsole(ValidateGreaterThan(fieldValue, comp));
				if(validateGreaterThan(fieldValue, comp) == false)
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('This field is required.');
					isValidForm = false;
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			//Less Than
			thisForm.find('.validateLessThan').each(function(){
	
				var fieldValue = $(this).val();
				var comp = $(this).attr('comp');
				
				if(validateLessThan(fieldValue, comp) == false)
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('This field is required.');
					isValidForm = false;
				}
				else
				{
					$('label.validationLabel[for="' + $(this).attr('id') + '"]').text('');
				}
			});
			
			if(typeof callback == 'function')
			{
				var callbackValue = true;
				callbackValue = callback.call(this);
				
				if(callbackValue == false)
				{
					isValidForm = false;
				}
			}
			
			if(isValidForm == false)
			{
				//alert('There were errors in your submission.');
			}
			
			return isValidForm;
			
		}
		
		catch(ex)
		{
			return false;
		}
		
};

function includeJS(sId, fileUrl) 
{ 
	if (!document.getElementById(sId))
	{ 
		var oHead = document.getElementsByTagName('HEAD').item(0);
		var oScript = document.createElement( "script" );
		oScript.language = "javascript";
		oScript.type = "text/javascript";
		oScript.id = sId;
		oScript.defer = true;
		oScript.src = fileUrl;
		oHead.appendChild( oScript );
	} 
}; 

function includeCSS(fileUrl)
{
		var oHead = document.getElementsByTagName('HEAD').item(0);
		var oStyle = document.createElement('link');
		oStyle.rel = 'stylesheet';
		oStyle.href = fileUrl;
		oStyle.defer = true;
		oHead.appendChild(oStyle);
};

function isEven(value) {
	if (value % 2 == 0)
	{
		return true;
	}
	else
	{
		return false;
	}
};

function addLeadingZero(a,b){
	return(1e15 + a + "").slice(-b)
};

/*
	http://stackoverflow.com/questions/11660930/javascript-invalid-date
*/
function parseDate(date) {
	var m = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)$/.exec(date);
    var tzOffset = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);//.getTimezoneOffset()

    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);// - tzOffset
};

/*
    dateFormat
            Similar to the DateFormat method found in ColdFusion MX and later.
            See the following URL for mask examples:
            http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7ff4.html
            NOTE: There is no support for gg, short, medium, long, and full.
*/

function dateFormat(thisDate, mask) {

    var arrMonths = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
    ];

    var arrMonthsAbbr = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
    ];

    var arrDaysOfWeek = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
    ];

    var arrDaysOfWeekAbbr = [
		'Sun',
		'Mon',
		'Tue',
		'Wed',
		'Thu',
		'Fri',
		'Sat'
    ];

    if (typeof (thisDate) == 'string') {
        thisDate = new Date(thisDate);

        if (isNaN(thisDate)) {
            throw ('DateFormat: Date is not a valid date');
        }
    }
    else if (typeof (thisDate) != 'object' || thisDate.constructor.toString().indexOf('Date()') == -1) {
        throw ('DateFormat: First parameter must be a date object');
    }

    thisDate = new Date(thisDate);
    var retVal = '';

    var intMonth = thisDate.getMonth();
    var strMonth = arrMonths[intMonth];
    var strMonthAbbr = arrMonthsAbbr[intMonth];
    var intDay = thisDate.getUTCDate();
    var strDayOfWeek = arrDaysOfWeek[thisDate.getDay()];
    var strDayOfWeekAbbr = arrDaysOfWeekAbbr[thisDate.getDay()];
    var intFullYear = thisDate.getFullYear();
    var intYear = intFullYear.toString().substring(2, 4);
    var int24Hour = thisDate.getHours();
    var intMinutes = thisDate.getMinutes();
    var intSeconds = thisDate.getSeconds();

    if (int24Hour > 12) {
        var int12Hour = int24Hour - 12;
        var strAMPM = 'PM';
        var strampm = 'pm';
    }
    else {
        var int12Hour = int24Hour;
        var strAMPM = 'AM';
        var strampm = 'am';
    }

    retVal = regExReplace(mask, strMonth, 'MMMM');
    retVal = regExReplace(retVal, strMonthAbbr, 'MMM');
    retVal = regExReplace(retVal, addLeadingZero(intMonth + 1, 2), 'MM'); // getMonth is zero based.
    retVal = regExReplace(retVal, strDayOfWeek, 'dddd');
    retVal = regExReplace(retVal, strDayOfWeekAbbr, 'ddd');
    retVal = regExReplace(retVal, addLeadingZero(intDay, 2), 'dd');
    retVal = regExReplace(retVal, intFullYear, 'yyyy');
    retVal = regExReplace(retVal, intYear, 'yy');
    retVal = regExReplace(retVal, addLeadingZero(int12Hour, 2), 'hh');
    retVal = regExReplace(retVal, addLeadingZero(int24Hour, 2), 'HH');
    retVal = regExReplace(retVal, addLeadingZero(intMinutes, 2), 'mm');
    retVal = regExReplace(retVal, addLeadingZero(intSeconds, 2), 'ss');
    retVal = regExReplace(retVal, strAMPM, 'TT');
    retVal = regExReplace(retVal, strampm, 'tt');

    return retVal;

};

function dateAdd(thisDate, strInterval, intIncrement) {

    if (typeof (thisDate) == "string") {
        thisDate = new Date(thisDate);

        if (isNaN(thisDate)) {
            throw ("DateAdd: Date is not a valid date");
        }
    }
    else if (typeof (thisDate) != "object" || thisDate.constructor.toString().indexOf("Date()") == -1) {
        throw ("DateAdd: First parameter must be a date object");
    }

    if (
	strInterval != "M"
	&& strInterval != "D"
	&& strInterval != "Y"
	&& strInterval != "h"
	&& strInterval != "m"
	&& strInterval != "uM"
	&& strInterval != "uD"
	&& strInterval != "uY"
	&& strInterval != "uh"
	&& strInterval != "um"
	&& strInterval != "us"
	) {
        throw ("DateAdd: Second parameter must be M, D, Y, h, m, uM, uD, uY, uh, um or us");
    }

    if (typeof (intIncrement) != "number") {
        throw ("DateAdd: Third parameter must be a number");
    }

    switch (strInterval) {
        case "M":
            thisDate.setMonth(parseInt(thisDate.getMonth()) + parseInt(intIncrement));
            break;

        case "D":
            thisDate.setDate(parseInt(thisDate.getDate()) + parseInt(intIncrement));
            break;

        case "Y":
            thisDate.setYear(parseInt(thisDate.getYear()) + parseInt(intIncrement));
            break;

        case "h":
            thisDate.setHours(parseInt(thisDate.getHours()) + parseInt(intIncrement));
            break;

        case "m":
            thisDate.setMinutes(parseInt(thisDate.getMinutes()) + parseInt(intIncrement));
            break;

        case "s":
            thisDate.setSeconds(parseInt(thisDate.getSeconds()) + parseInt(intIncrement));
            break;

        case "uM":
            thisDate.setUTCMonth(parseInt(thisDate.getUTCMonth()) + parseInt(intIncrement));
            break;

        case "uD":
            thisDate.setUTCDate(parseInt(thisDate.getUTCDate()) + parseInt(intIncrement));
            break;

        case "uY":
            thisDate.setUTCFullYear(parseInt(thisDate.getUTCFullYear()) + parseInt(intIncrement));
            break;

        case "uh":
            thisDate.setUTCHours(parseInt(thisDate.getUTCHours()) + parseInt(intIncrement));
            break;

        case "um":
            thisDate.setUTCMinutes(parseInt(thisDate.getUTCMinutes()) + parseInt(intIncrement));
            break;

        case "us":
            thisDate.setUTCSeconds(parseInt(thisDate.getUTCSeconds()) + parseInt(intIncrement));
            break;
    }

    return thisDate;
};

function regExReplace(str, val, mask) {
	var regex = new RegExp(mask);
    return str.replace(regex, val);
};

jQuery.extend (
	jQuery.expr[':'].containsCI = function (a, i, m) {
		
		var sText = (a.textContent || a.innerText || "");
		var zRegExp = new RegExp('_' + m[3], 'i');
		
		return zRegExp.test('_' + sText);
		
	}
);

// The style function
jQuery.fn.style = function(styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node 
    if (typeof node == 'undefined') {
        return;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
        if (typeof value != 'undefined') {
            // Set style property
            var priority = typeof priority != 'undefined' ? priority : '';
            style.setProperty(styleName, value, priority);
        } else {
            // Get style property
            return style.getPropertyValue(styleName);
        }
    } else {
        // Get CSSStyleDeclaration
        return style;
    }
};

function indexOfByAttribute(collection, searchParam, attribute) {

    for (var i = 0; i < collection.length; i++) {
        if (collection[i][attribute] == searchParam) {
            return i;
        }
    }

    return -1;

};
