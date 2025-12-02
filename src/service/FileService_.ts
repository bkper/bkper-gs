namespace FileService_ {

    export function createFile(bookId: string, file: bkper.File): bkper.File {
        var payload = JSON.stringify(file);
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/files`).setMethod('post').setPayload(payload).fetch().getContentText();
        return JSON.parse(responseJSON);
    }

    export function getFile(bookId: string, id: string): bkper.File {
        var responseJSON = new HttpBooksApiV5Request(`${bookId}/files/${id}`).setMethod('get').fetch().getContentText();
        return JSON.parse(responseJSON) as bkper.File;
    }

}
