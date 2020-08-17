namespace GroupService_ {

  export function createGroup(bookId: string, group: bkper.Group): bkper.Group {
    var payload = JSON.stringify(group);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/groups`).setMethod('post').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON);
  }

  export function updateGroup(bookId: string, group: bkper.Group): bkper.Group {
    var payload = JSON.stringify(group);
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/groups`).setMethod('put').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON);
  }

  export function deleteGroup(bookId: string, group: bkper.Group): bkper.Group {
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/groups/${group.id}`).setMethod('delete').fetch().getContentText();
    return JSON.parse(responseJSON);
  }


  export function createGroups(bookId: string, groups: bkper.Group[]): Group[] {

    let groupList: bkper.GroupList = {
      items: groups
    };

    var groupsBatchJSON = JSON.stringify(groupList);

    Logger.log(groupsBatchJSON)
    var responseJSON = new HttpBooksApiV3Request(`${bookId}/groups/batch`).setMethod('post').setPayload(groupsBatchJSON).fetch().getContentText();

    if (responseJSON == null || responseJSON == "") {
      return [];
    }

    var groupsPlain = JSON.parse(responseJSON).items;
    if (groupsPlain == null) {
      return [];
    }
    return Utils_.wrapObjects(new Group(), groupsPlain);;
  }
}