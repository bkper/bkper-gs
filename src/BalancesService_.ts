namespace BalancesService_ {

  export function getBalances(bookId: string, query: string): bkper.Balances {
    var responseJSON = new HttpBooksApiV5Request(`${bookId}/balances`).addParam('query', query).addParam('time', Date.now()).fetch().getContentText();
    var report = JSON.parse(responseJSON);

    if (report.balancesUrl) {
      responseJSON = UrlFetchApp.fetch(`${report.balancesUrl}`).getContentText();
      report = JSON.parse(responseJSON);
    }

    return report;
  }
  
}