var Utils_ = {
  
  dateFormatPeriodicityMap_: {
    "MM/dd/yyyy": {YEARLY: "yyyy", MONTHLY: "MM/yyyy", DAILY: "MM/dd/yyyy"},
    "MM/dd/yyyy": {YEARLY: "yyyy", MONTHLY: "MM/yyyy", DAILY: "MM/dd/yyyy"},
    "dd/MM/yyyy": {YEARLY: "yyyy", MONTHLY: "MM/yyyy", DAILY: "dd/MM/yyyy"}
  },
  
  round: function(num, fractionDigits) {
    if (num == null) {
      num = 0;
    }
    if (fractionDigits != null) {
      var rounded = Number(Math.round(num + 'e' + fractionDigits) + 'e-' + fractionDigits)
      if (isNaN(rounded)) {
        rounded = 0;
      }
      return rounded;
    } else {
      var rounded =  Math.round(num*100)/100;
      return rounded;
    }
  },
  
  formatValue_: function(value, decimalSeparator, fractionDigits) {
    
    if (value == null){
        return "";
    } 
    
    if (typeof value == "string") {
      if (value.trim() == '') {
        return "";
      }
      value = parseFloat(value);
    }
    
    if (value == null){
        return "";
    }     

    if(fractionDigits == null) {
      fractionDigits = 2;
    }
    
    var formattedValue = (value.toFixed(fractionDigits)) + "";
    if (decimalSeparator == DecimalSeparator.DOT) {
      return formattedValue.replace(/\,/g, '.');
    } else {
      return formattedValue.replace(/\./g, ',');
    }
    return formattedValue;
  },
  
  convertValueToDate: function(dateValue, offsetInMinutes) {
    if (dateValue == null) {
      return new Date();
    }
    var year =  dateValue/10000;
    var month =  (dateValue / 100) % 100;
    var day = dateValue % 100;
    var date = Utils_.createDate(year, month, day, offsetInMinutes);
    return date;
  },
  
  isString: function(obj) {
    if (obj == null) {
      return false;
    }
    if (typeof obj === 'string' || obj instanceof String) {
      return true;
    } else {
      return false;
    }
  },    
  
  createDate: function(year, month, day, offsetInMinutes) {
    var date = new Date(year, month - 1, day);
    date.setTime(date.getTime() + offsetInMinutes*60*1000 );    
    return date;
  },  

  
  
  formatDate: function(date, pattern, timeZone) {
    if (date == null || !(date instanceof Date)) {
      return date;
    }
    
    if (timeZone == null || timeZone == "") {
      timeZone = Session.getScriptTimeZone();
    }    
    
    var formatedDate = Utilities.formatDate(date, timeZone, pattern);
    return formatedDate;
  },

  getDateFormatterPattern: function(datePattern, periodicity) {
    var pattern = datePattern;

    if (periodicity == Periodicity.MONTHLY) {
      pattern = "MM/yyyy"
    }
    if (periodicity == Periodicity.YARLY) {
      pattern = "yyyy"
    }
    return pattern;
  },  
  
  getRepresentativeValue: function(value, credit) {
    
    if (value == null) {
      return 0;
    }
    
    if (credit != null && !credit) {
      return value *-1;
    }
    return value;
  },  

  wrapObjects: function(wrapper, wrappeds) {
    var newObjects = new Array();
    if (wrappeds != null) {
      for (var i = 0; i < wrappeds.length; i++) {
        var newObject = Utils_.wrapObject(wrapper, wrappeds[i]);
        newObjects.push(newObject);
      }
    }
    return newObjects;
  },
  
  wrapObject: function(wrapper, wrapped) {
    if (wrapped == null) {
      wrapped = new Object();
    }
    var w = Object.create(wrapper);
    w.wrapped = wrapped;
    return w;
  },
  
}

