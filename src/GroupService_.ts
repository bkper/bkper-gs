namespace GroupService_ {
  export function getGroups(bookId: string): Group[] {

    var responseJSON = API.call_("get", "groups", bookId);

    if (responseJSON == null || responseJSON == "") {
      return [];
    }

    var groupsPlain = JSON.parse(responseJSON).items;
    if (groupsPlain == null) {
      return [];
    }
    var groups = Utils_.wrapObjects(new Group(), groupsPlain);
    return groups;
  }
}