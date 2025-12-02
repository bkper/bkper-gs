namespace CollectionService_ {

    export function updateCollection(payload: bkper.Collection): bkper.Collection {
        let requestPayload = JSON.stringify(payload);
        let response = new HttpApiV5Request('collections').setMethod("put").setPayload(requestPayload).fetch().getContentText();
        let collection = JSON.parse(response);
        return collection;
    }

}
