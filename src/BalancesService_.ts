namespace BalancesService_ {

  export function getBalances(bookId: string, query: string) {
    var responseJSON = new HttpBooksApiRequest(`${bookId}/balances`).addParam('query', query).addParam('time', Date.now()).fetch().getContentText();
    var report = JSON.parse(responseJSON);
    return report;
  }
  
}

