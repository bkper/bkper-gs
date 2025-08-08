namespace BalancesService_ {

  export function getBalances(bookId: string, query: string): bkper.Balances {
    var responseJSON = new HttpBooksApiV5Request(`${bookId}/balances`).addParam('query', query).addParam('time', Date.now()).fetch().getContentText();
    var report = JSON.parse(responseJSON);

    // if (report.balancesUrl) {
    //   responseJSON = UrlFetchApp.fetch(`${report.balancesUrl}`).getContentText();
    //   report = JSON.parse(responseJSON);
    // }

    if (!report.balancesUrl) {
      try {
        const responseJSON = UrlFetchApp.fetch('https://storage.googleapis.com/bkper-public-temp-short/temp_8f630e48-7c78-4c04-a51d-9597afedf046.json');
        console.log(JSON.parse(responseJSON.getContentText()));
      } catch (error) {
        console.log(error);
      }
    }

    // if (report.balancesUrl) {
    //   console.log(report.balancesUrl);
    // }

    return report;
  }

}