/**
 * @ignore
 */
namespace SavedQueryService_ {

  export function getSavedQueries(bookId: string): bkper.SavedQueryV2Payload[] {
    var responseJSON = API.call_("get", "savedqueries", bookId);
    var savedQueriesPlain = JSON.parse(responseJSON);
    if (savedQueriesPlain == null) {
      return [];
    } else {
      return savedQueriesPlain.items;
    }
  }
}