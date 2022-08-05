import { ContactsCollection } from '../db/Contactcollection';


import { Template } from 'meteor/templating';

import './App.html';

Template.collect.helpers({
    tasks() {
        return ContactsCollection.find({}, { sort: { createdAt: -1 } });
      },
    });
    
Template.form.events({
    "submit .task-form"(event) {
        
        event.preventDefault();
        const target = event.target;
        const name = target.fullName.value;
        const phno=target.phoneNumber.value;
        const emailid=target.email.value;
        const img=event.target.files;
        console.log(name,phno,emailid,img);
        ContactsCollection.insert({
          name:name,phno:phno,emailid:emailid,
          createdAt: new Date(),
        });
        target.fullName.value = '';
        target.phoneNumber.value = '';
        target.email.value = '';

      }
    
    })
Template.collect.events({
    'click .delete':function(){
        ContactsCollection.remove(this._id);
    }
})


   