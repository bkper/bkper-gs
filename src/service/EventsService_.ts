namespace EventsService_ {

    export function searchEvents(book: Book, afterDate: string | null, beforeDate: string | null, onError: boolean, resourceId: string | null, limit: number, cursor?: string): bkper.EventList {
        let request = new HttpBooksApiV5Request(`${book.getId()}/events`);
        request.addParam('after', afterDate);
        request.addParam('before', beforeDate);
        request.addParam('error', onError);
        request.addParam('resoureId', resourceId);
        request.addParam('limit', limit);
        if (cursor != null) {
            request.setHeader('cursor', cursor);
        }
        let responseJSON = request.fetch().getContentText();
        return JSON.parse(responseJSON);
    }

}
