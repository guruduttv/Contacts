import { ContactsCollection } from '../db/Contactcollection';
import { Meteor } from 'meteor/meteor'


Meteor.methods({
    'contacts.insert'(name,phno,emailid) {
      
   
        ContactsCollection.insert({
        name:name,
        phno:phno,
        emailid:emailid,
        createdAt: new Date,
        
      })
    },
   
    'contacts.remove'(contactid) {
     
        ContactsCollection.remove(contactid);
    },


    'contacts.update'(name,phno,emailid,editId) {
     console.log(name,phno,emailid,editId);
        ContactsCollection.update({"_id" : editId},
        {$set: { name:name,
        phno:phno,
        emailid:emailid,
        createdAt: new Date,}});
    },

    'contacts.get'(contactid) 
    {
    
        console.log(contactid);

        const editContact=ContactsCollection.find({_id:contactid}).fetch();
    
    return editContact;


    },




   
   
  });
  