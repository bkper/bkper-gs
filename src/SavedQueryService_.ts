namespace SavedQueryService_ {

  export function getSavedQueries(bookId: string): bkper.Query[] {
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/queries`).fetch().getContentText();
    var savedQueriesPlain = JSON.parse(responseJSON);
    if (savedQueriesPlain == null) {
      return [];
    } else {
      return savedQueriesPlain.items;
    }
  }
}