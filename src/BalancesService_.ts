
namespace BalancesService_ {

    export function getBalances(bookId: string, query: string): bkper.Balances {
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/balances`).addParam('query', query).addParam('time', Date.now()).fetch().getContentText();
        var report = JSON.parse(responseJSON);

        // for payloads larger than 32MB, fetch object from Cloud Storage
        if (report.balancesUrl) {
            try {
                responseJSON = UrlFetchApp.fetch(`${report.balancesUrl}`).getContentText();
                report = JSON.parse(responseJSON);
            } catch (error) {
                console.log(error);
            }
        }

        return report;
    }

}
