namespace BookService_ {

  export function listBooks(): bkper.BookV2Payload[] {
    var responseJSON = API.call_("get");
    
    if (responseJSON == null || responseJSON == "") {
      return [];
    }
    
    var bookListPlain: bkper.BookThinCollection = JSON.parse(responseJSON);


    var booksJson = bookListPlain.items;

    if (booksJson == null) {
      return [];
    }

    booksJson.sort(function(a,b){
      {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        if (aName < bName){
          return -1;
        }else if (aName > bName){
          return  1;
        }else{
          return 0;
        }
      }
    });
    return booksJson;
  }

  export function loadBookWrapped(bookId: string): bkper.BookV2Payload {

    if (bookId == null) {
      throw new Error("Book id null!");
    }

    let cache = CacheService.getUserCache();
    let cacheKey = "BKPER_BOOK_"+ bookId;

    let responseJSON = cache.get(cacheKey);

    if (responseJSON == null) {
      responseJSON = API.call_("get", null, bookId);
      cache.put(cacheKey, responseJSON, 30);
    }

    var bookPlain = JSON.parse(responseJSON);
    return bookPlain;
  }

}



