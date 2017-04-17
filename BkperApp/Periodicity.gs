  /**
  The Periodicity of the query. It depends the way you write the range params. You can use {@link Variables|variables}.
  <br/>
  <br/>
  Go to <a href='https://app.bkper.com' target='_blank'>bkper.com</a> and open report wizard: <img src='../../img/wizard.png'/> to learn more about query sintax.
  @enum {string}
  @readonly
  @property {string} DAILY - Ex: after:25/01/1983, before:04/mar/2013, after:$d-30, before:$d, after:$d-15/$m
  @property {string} MONTHLY - Ex: after:jan/2013, before:mar/2013, after:$m-1, before:$m
  @property {string} YARLY - Ex: 2013, 2013, $y
  */
var Periodicity = {
  DAILY : "DAILY",
  MONTHLY : "MONTHLY",
  YARLY : "YARLY"
};