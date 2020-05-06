namespace GroupService_ {
  export function getGroups(bookId: string): Group[] {

    var responseJSON = new HttpBooksApiRequest(`${bookId}/groups`).fetch().getContentText();

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