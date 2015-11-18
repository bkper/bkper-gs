var BookService_ = {

  listBooks: function() {
    var responseJSON = API.call_("get");
    var bookListPlain = JSON.parse(responseJSON);


    var booksJson = bookListPlain.items;

    if (booksJson == null) {
      return new Array();
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
  },

  loadBookWrapped: function(bookId) {

    if (bookId == null) {
      throw new Error("Book id null!");
    }

    var responseJSON = API.call_("get", null, bookId);
    var bookPlain = JSON.parse(responseJSON);
    return bookPlain;
  }

}



