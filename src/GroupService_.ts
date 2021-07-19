namespace GroupService_ {

  export function createGroup(bookId: string, group: bkper.Group): bkper.Group {
    var payload = JSON.stringify(group);
    var responseJSON = new HttpBooksApiV4Request(`${bookId}/groups`).setMethod('post').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON);
  }

  export function updateGroup(bookId: string, group: bkper.Group): bkper.Group {
    var payload = JSON.stringify(group);
    var responseJSON = new HttpBooksApiV4Request(`${bookId}/groups`).setMethod('put').setPayload(payload).fetch().getContentText();
    return JSON.parse(responseJSON);
  }

  export function deleteGroup(bookId: string, group: bkper.Group): bkper.Group {
    var responseJSON = new HttpBooksApiV4Request(`${bookId}/groups/${group.id}`).setMethod('delete').fetch().getContentText();
    return JSON.parse(responseJSON);
  }


  export function createGroups(bookId: string, groups: bkper.Group[]): bkper.Group[] {

    let groupList: bkper.GroupList = {
      items: groups
    };
    var groupsBatchJSON = JSON.stringify(groupList);
    var responseJSON = new HttpBooksApiV4Request(`${bookId}/groups/batch`).setMethod('post').setPayload(groupsBatchJSON).fetch().getContentText();

    if (responseJSON == null || responseJSON == "") {
      return [];
    }

    var groupsPlain = JSON.parse(responseJSON).items;
    if (groupsPlain == null) {
      return [];
    }
    return groupsPlain;
  }

  export function listGroups(bookId: string): bkper.Group[] {

    var responseJSON = new HttpBooksApiV4Request(`${bookId}/groups`).setMethod('get').fetch().getContentText();

    if (responseJSON == null || responseJSON == "") {
      return [];
    }

    var groupsPlain = JSON.parse(responseJSON).items;
    if (groupsPlain == null) {
      return [];
    }
    return groupsPlain;
  }
}