var GroupService_ = {
  getGroups: function(bookId) {
    var responseJSON = API.call_("get", "groups", bookId);
    
    if (responseJSON == null || responseJSON == "") {
      return new Array();
    }
    
    var groupsPlain = JSON.parse(responseJSON).items;
    if (groupsPlain == null) {
      return new Array();
    }
    var groups = Utils_.wrapObjects(new Group(), groupsPlain);
    return groups;
  }
}