import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from '../db/Contactcollection';

Meteor.publish('contacts', function publishContacts() {
  return ContactsCollection.find({ });
});