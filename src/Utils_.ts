namespace Utils_ {

  export function round(number: number | string, fractionDigits: number): number {
    let num = +number;
    if (num == null) {
      num = 0;
    }
    if (fractionDigits != null) {
      var rounded = Number(Math.round(new Number(num + 'e' + fractionDigits).valueOf()) + 'e-' + fractionDigits)
      if (isNaN(rounded)) {
        rounded = 0;
      }
      return rounded;
    } else {
      var rounded =  Math.round(num*100)/100;
      return rounded;
    }
  }
  
  export function formatValue_(value: number | string, decimalSeparator: DecimalSeparator, fractionDigits:number): string {
    
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
  }
  
  export function parseValue(value: string, decimalSeparator: DecimalSeparator): number {
    if (value == null){
        return null;
    } 
    
    if (!isNaN(+value) && isFinite(+value)) {
      return +value;
    }

    if (decimalSeparator == DecimalSeparator.DOT) {
      value = value.replace(/\,/g, '');
    } else {
      value = value.replace(/\./g, '').replace(/\,/g, '.');
    }
    return +value;
  }  

  export function convertValueToDate(dateValue: number, offsetInMinutes: number): Date {
    if (dateValue == null) {
      return new Date();
    }
    var year =  dateValue/10000;
    var month =  (dateValue / 100) % 100;
    var day = dateValue % 100;
    var date = createDate(year, month, day, offsetInMinutes);
    return date;
  }
  
  export function isString(obj: object): boolean {
    if (obj == null) {
      return false;
    }
    if (typeof obj === 'string' || obj instanceof String) {
      return true;
    } else {
      return false;
    }
  }
  
  export function createDate(year: number, month: number, day:number, offsetInMinutes: number): Date {
    var date = new Date(year, month - 1, day);
    date.setTime(date.getTime() + offsetInMinutes*60*1000 );    
    return date;
  } 

  
  export function formatDate(date: Date, pattern: string, timeZone: string): string {
    if (date == null || !(Object.prototype.toString.call(date) === '[object Date]')) {
      return '';
    }
    
    if (timeZone == null || timeZone == "") {
      timeZone = Session.getScriptTimeZone();
    }    
    
    var formatedDate = Utilities.formatDate(date, timeZone, pattern);
    return formatedDate;
  }

  export function formatDateISO(date: Date, timeZone: string): string {
    if (date == null || !(Object.prototype.toString.call(date) === '[object Date]')) {
      return '';
    }
    
    if (timeZone == null || timeZone == "") {
      timeZone = Session.getScriptTimeZone();
    }    
    
    var formatedDate = Utilities.formatDate(date, timeZone, 'yyyy-MM-dd');
    return formatedDate;
  }

  export function parseDate(date: string, pattern: string, offsetInMinutes: number): Date {
    if (pattern == 'dd/MM/yyyy') {
      let split = date.split('/');
      if (split.length == 3) {
        let year = +split[2];
        let month = +split[1];
        let day = +split[0];
        return createDate(year, month, day, offsetInMinutes);
      }
    } else if (pattern == 'MM/dd/yyyy') {
      let split = date.split('/');
      if (split.length == 3) {
        let year = +split[2];
        let month = +split[0];
        let day = +split[1];
        return createDate(year, month, day, offsetInMinutes);
      }      
    } else if (pattern == 'yyyy/MM/dd') {
      let split = date.split('/');
      if (split.length == 3) {
        let year = +split[0];
        let month = +split[1];
        let day = +split[2];
        return createDate(year, month, day, offsetInMinutes);
      }   
    } else if (pattern == 'yyyy-MM-dd') {
      let split = date.split('-');
      if (split.length == 3) {
        let year = +split[0];
        let month = +split[1];
        let day = +split[2];
        return createDate(year, month, day, offsetInMinutes);
      }   
    }
    let now = new Date()
    return createDate(now.getFullYear(), now.getMonth()+1, now.getDate(), offsetInMinutes);

  }

  export function getDateFormatterPattern(datePattern: string, periodicity: Periodicity): string {
    var pattern = datePattern;

    if (periodicity == Periodicity.MONTHLY) {
      pattern = "MM/yyyy"
    }
    if (periodicity == Periodicity.YEARLY) {
      pattern = "yyyy"
    }
    return pattern;
  }
  
  export function getRepresentativeValue(value: number, credit:boolean): number {
    
    if (value == null) {
      return 0;
    }
    
    if (credit != null && !credit) {
      return value *-1;
    }
    return value;
  }

  export function wrapObjects<E extends Object>(wrapper: E, wrappeds: Array<Object>): Array<E> {
    var newObjects = [];
    if (wrappeds != null) {
      for (var i = 0; i < wrappeds.length; i++) {
        var newObject = wrapObject(wrapper, wrappeds[i]);
        newObjects.push(newObject);
      }
    }
    return newObjects;
  }
  
  export function wrapObject<E extends Object>(wrapper:E, wrapped: Object): E {
    if (wrapped == null) {
      wrapped = new Object();
    }
    var w = Object.create(wrapper);
    w.wrapped = wrapped;
    return w;
  }

  export function buildURLParams(params: any): string {
    var urlSegment = "";
    var i = 0;
    for (var prop in params) {
      if (params.hasOwnProperty(prop)) {
        if (i > 0) {
          urlSegment += "&"
        }
        var name = prop;
        var value = params[prop];
        if (value != null) {
          urlSegment += name + "=" + encodeURIComponent(value);
          i++;
        }
      }
    }
    return urlSegment;
  }

  export function convertInMatrix(array: any[]): any[][] {
    var maxLength = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i].length > maxLength) {
        maxLength = array[i].length;
      }
    }
    for (var i = 0; i < array.length; i++) {
      while (array[i].length < maxLength) {
        array[i].push(null);
      }
    }
    return array;
  }  
  
}

