
var expect = require('chai').expect;

describe('Utils_', () => {
  describe('#parseDate()', () => {
    it('should parse yyyy/MM/dd', () => {
      let value = Utils_.parseDate('2020/01/25', 'yyyy/MM/dd', 0);
      expect(value.toString()) .to.equal(new Date(2020, 0, 25).toString());
    });
    it('should parse MM/dd/yyyy', () => {
      let value = Utils_.parseDate('01/25/2020', 'MM/dd/yyyy', 0);
      expect(value.toString()) .to.equal(new Date(2020, 0, 25).toString());
    });
    it('should parse dd/MM/yyyy', () => {
      let value = Utils_.parseDate('25/01/2020', 'dd/MM/yyyy', 0);
      expect(value.toString()) .to.equal(new Date(2020, 0, 25).toString());
    });
  });
  describe('#parseValue()', () => {
    it('should parse DOT separator', () => {
      let value = Utils_.parseValue('23.4', DecimalSeparator.DOT);
      expect(value).to.equal(23.4);
      value = Utils_.parseValue('233,345.4667', DecimalSeparator.DOT);
      expect(value).to.equal(233345.4667);
    });
    it('should parse COMMA separator', () => {
      let value = Utils_.parseValue('23,4', DecimalSeparator.COMMA);
      expect(value).to.equal(23.4);
      value = Utils_.parseValue('23.4', DecimalSeparator.COMMA);
      expect(value).to.equal(23.4);      
      value = Utils_.parseValue('233.345,4667', DecimalSeparator.COMMA);
      expect(value).to.equal(233345.4667);
    });
  });  
  describe('#buildURLParams()', () => {
    it('should build url form prams', () => {
      let params = {
        ledgerId: "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgKCtg6MLDA",
        query: "= account:'Credit Card' after:$m-12 before:$m+1",
        chartType: "pie",
        balanceType: "cumulative"
      }
      let urlParams = Utils_.buildURLParams(params);
      expect("ledgerId=agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgKCtg6MLDA&query=%3D%20account%3A'Credit%20Card'%20after%3A%24m-12%20before%3A%24m%2B1&chartType=pie&balanceType=cumulative")
        .to.equal(urlParams);
    });
  });
  describe('#convertInMatrix()', () => {

    it('should work with single line', () => {
      let matrix = [
        ["date", "description", "debit", "credit"]
      ];
      let expected = [
        ["date", "description", "debit", "credit"],
      ];
      expect(expected).to.eql(Utils_.convertInMatrix(matrix));
    });

    it('should fill null empty places', () => {
      let matrix = [
        ["date", "description", "debit", "credit"],
        ["25/01/1983", "descrition1"],
        ["25/01/1983",]
      ];
      let expected = [
        ["date", "description", "debit", "credit"],
        ["25/01/1983", "descrition1", null, null],
        ["25/01/1983", null, null, null]
      ];

      expect(expected).to.eql(Utils_.convertInMatrix(matrix));
    });

    it('should fill null empty places above filled line', () => {

      let matrix = [
        ["date", "description", "debit"],
        ["25/01/1983", "descrition1", "xx", "xx"],
        ["25/01/1983",]
      ];
      let expected = [
        ["date", "description", "debit", null],
        ["25/01/1983", "descrition1", "xx", "xx"],
        ["25/01/1983", null, null, null]
      ];

      expect(expected).to.eql(Utils_.convertInMatrix(matrix));

    })
  });


});

