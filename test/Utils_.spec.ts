
var expect = require('chai').expect;

describe('Utils_', () => {
  describe('#buildURLParams()', () => {
    it('should build url form prams', () => {
      let params = {
        ledgerId: "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgKCtg6MLDA",
        query: "= acc:'Credit Card' after:$m-12 before:$m+1",
        chartType: "pie",
        balanceType: "cumulative"
      }
      let urlParams = Utils_.buildURLParams(params);
      expect("ledgerId=agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgKCtg6MLDA&query=%3D%20acc%3A'Credit%20Card'%20after%3A%24m-12%20before%3A%24m%2B1&chartType=pie&balanceType=cumulative")
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

