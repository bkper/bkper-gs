namespace BacklogService_ {

    export function getBacklog(bookId: string): bkper.Backlog {
        let responseJSON = new HttpBooksApiV5Request(`${bookId}/events/backlog`).setMethod('get').fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.Backlog;
    }

}
