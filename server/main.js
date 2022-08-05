import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { ContactsCollection } from '../imports/db/Contactcollection'

const insertCollect= contactText => ContactsCollection.insert({ text: contactText });
 
Meteor.startup(() => {
  // if (ContactsCollection.find().count() === 0) {
  //   [
  //     'First  Collect',
  //     'Second Task',
  //     'Third Task',
  //     'Fourth Task',
  //     'Fifth Task',
  //     'Sixth Task',
  //     'Seventh Task'
  //   ].forEach(insertCollect)
  // }
});