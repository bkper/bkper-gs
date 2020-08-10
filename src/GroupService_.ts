namespace GroupService_ {
  // export function getGroups(bookId: string): Group[] {

  //   var responseJSON = new HttpBooksApiV2Request(`${bookId}/groups`).fetch().getContentText();

  //   if (responseJSON == null || responseJSON == "") {
  //     return [];
  //   }

  //   var groupsPlain = JSON.parse(responseJSON).items;
  //   if (groupsPlain == null) {
  //     return [];
  //   }
  //   var groups = Utils_.wrapObjects(new Group(), groupsPlain);
  //   return groups;
  // }

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