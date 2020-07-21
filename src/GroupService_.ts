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

  export function createGroups(bookId: string, groupNames: string[]): Group[] {

    let groupsBatch: bkper.GroupsCreateBatchPayload = {
      names: groupNames
    };

    var groupsBatchJSON = JSON.stringify(groupsBatch);
    var responseJSON = new HttpBooksApiRequest(`${bookId}/groups/batch`).setMethod('post').setPayload(groupsBatchJSON).fetch().getContentText();

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