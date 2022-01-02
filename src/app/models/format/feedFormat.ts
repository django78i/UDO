import { Injectable } from '@angular/core';

@Injectable()
export class FeedFormat {
  public returnQueryObject(documentSnap): any {
    const table = [];
    const users = JSON.parse(localStorage.getItem('usersList'));

    documentSnap?.forEach((f: any) => {
      const data = f.data();
      console.log(data);
      const format = this.formatQuery(data, users);
      table.push({ ...data, user: format.findUser, postLast: format.postLast });
    });
    const lastVisible: any = documentSnap.docs[documentSnap.docs.length - 1]
      ? documentSnap.docs[documentSnap.docs.length - 1]
      : null;

    return { table: table, last: lastVisible };
  }

  public formatQuery(data, users): any {
    let postLast;
    const findUser = users.find((user) => user.uid == data.userId);
    console.log(findUser);
    if (data.postLast) {
      const postUser = users.find(
        (user) => data.postLast.sender.uid == user.uid
      );
      data.postLast.sender = postUser;
      postLast = { ...data.postLast, sender: data.postLast.sender };
    }
    return { findUser, postLast };
  }
}
