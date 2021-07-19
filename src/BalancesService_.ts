namespace BalancesService_ {

  export function getBalances(bookId: string, query: string): bkper.Balances {
    var responseJSON = new HttpBooksApiV4Request(`${bookId}/balances`).addParam('query', query).addParam('time', Date.now()).fetch().getContentText();
    var report = JSON.parse(responseJSON);
    return report;
  }
  
}

