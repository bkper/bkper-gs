namespace AppService_ {

    export function getApps(bookId: string): bkper.AppList {
        let responseJSON = new HttpBooksApiV5Request(`${bookId}/apps`).setMethod('get').fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.AppList;
    }

}
