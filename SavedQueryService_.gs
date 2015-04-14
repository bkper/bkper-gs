var SavedQueryService_ = {

  getSavedQueries: function(bookId) {
    var responseJSON = API.call_("get", "savedqueries", bookId);
    var savedQueriesPlain = JSON.parse(responseJSON);
    if (savedQueriesPlain == null) {
      return new Array();
    } else {
      return savedQueriesPlain.items;
    }
  }
}