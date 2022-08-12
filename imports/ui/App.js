import { ContactsCollection } from '../db/Contactcollection';
import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';
import { check } from 'meteor/check'
import './App.html';


import { Match } from 'meteor/check'


Template.mainContainer.events({
  "click #add-button"(event, instance) {
    Session.set("showAddContactForm",true);  
  },

  'click .CloseCreateForm'(event,instance) {
    Session.set("showAddContactForm",false);
  },
});

Template.mainContainer.helpers({
  showAll() {
   let showAddContactForm=  Session.get("showAddContactForm");
   if(showAddContactForm==true)
   {
    return false;
   }
   else
   {
    return true;
   }
  },
  

});

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  var instance = this
  this.state = new ReactiveDict();
  Session.set("showAddContactForm",false);
  Session.set("searchContactName","");
  

  
});

Template.ContactList.events({

  'click .editContactForm'(e,instance) {
    
    Session.set("showEditContactForm",true);
    Meteor.call('contacts.get',this._id,(err,res)=>{
    var myData = res[0];
    console.log(myData);
    Session.set('mySession', myData);
  })
 

},
  'click .previous': function (event) {
    if (Session.get('skip') >= Session.get("limit")) {
      Session.set('skip', Session.get('skip') - Session.get("limit"));
    }
  },
  'click .next': function (event) {
    Session.set('skip', Session.get('skip') + Session.get("limit"));
  },
  'click .numbers': function (event) {
    Session.set('skip', (((this.value) - 1) * Session.get("limit")));
  },


  "keyup .searchText": function (event, Template) {
    
    var searchContactName = event.target.value;
 
    Session.set('searchContactName', searchContactName);
  },



  'click .delete'() {
    Meteor.call('contacts.remove', this._id);
  },

  
});


Template.ContactList.onCreated(function ContactListOnCreated() {
  var instance = this;
  Session.set("showEditContactForm",false);
  Session.set("showAddContactForm",false);
  Session.set('skip', 0)
  instance.autorun(function () {
  let limit = 6;
  Session.set('limit', limit);
  let totalPages = ContactsCollection.find().count();
  pageNumbers = Math.ceil(totalPages / limit);
  Session.set('pageNumber', pageNumbers);
})
});

Template.ContactList.helpers({
  contacts() 
    { 
    sortedContacts=ContactsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
    const start=Session.get('skip');
    const end= start+ Session.get('limit');
    contactsPerPage=[];
   
    if(Session.get("searchContactName"))
    {
      
      for(var i=0;i<sortedContacts.length;i++)
      {
        
        if (sortedContacts[i].name.includes(Session.get("searchContactName")))
        {
         
          contactsPerPage.push(sortedContacts[i]);
        }
      }
      return contactsPerPage ;
    }
    else{
      

      for (var i = start; i < end; i++) {
        if(i < sortedContacts.length)
        {
          contactsPerPage.push(sortedContacts[i]);
        }
      }
        return contactsPerPage ;
    }
  
  
  }
    ,

  

    pagenumber()
    {
      pageNumber = Session.get('pageNumber')
      var arrayOfPageNumber = []
      for (var i = 1; i <= pageNumber; i++) {
      
        arrayOfPageNumber.push({ value: i })
      }
      return arrayOfPageNumber;
    },

    displayEditContact(){
      let displayEditContactForm=Session.get("showEditContactForm");
      if (displayEditContactForm == true)
      {
        return true;
      }
      else{
        return false;
      }
    }


});


Template.CreateContactForm.onCreated(function ContactListOnCreated() {

  this.errormessage=new ReactiveDict();
  
});
Template.CreateContactForm.helpers({

  showErrorMessages(tagname)
  { 
    
    return Template.instance().errormessage.get(tagname);
  }

});
    
Template.CreateContactForm.events({


  'click .CloseCreateForm'(event,instance) {
   
    instance.errormessage.set("phno","");
    instance.errormessage.set("name","");
    instance.errormessage.set("emailid","");
    Session.set("showAddContactForm",false);
    
        
    
  },
    "submit .task-form"(event,instance) {
        event.preventDefault();
        const target = event.target;
        const name = target.fullName.value;
        const phno=target.phoneNumber.value;
        const emailid=target.email.value;
        console.log(typeof(phno));
        emailValidity = /[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[a-zA-Z]+/.test(emailid);
        phoneValidity = /[6-9][0-9]{9}/.test(phno);
        if(name=="" && phno=="" && emailid=="")
        {
         instance.errormessage.set("name","Please enter the name field");
         instance.errormessage.set("phno","Please enter the phone field");
         instance.errormessage.set("emailid","Please enter the email field");
        }
        else if(name=="" )
        {
         instance.errormessage.set("name","Please enter the name field");
         instance.errormessage.set("phno","");
         instance.errormessage.set("emailid","");
        }
        else if(phno=="" )
        {
         instance.errormessage.set("name","");
         instance.errormessage.set("phno","Please enter the phone field");
         instance.errormessage.set("emailid","");
        }
        else if(emailid=="" )
        {
         instance.errormessage.set("name","");
         instance.errormessage.set("phno","");
         instance.errormessage.set("emailid","Please enter the email field");
        }
        else if(phoneValidity==false ){
          instance.errormessage.set("phno","Invalid Phno");
          instance.errormessage.set("name","");
          instance.errormessage.set("emailid","");
        }
        else if(emailValidity==false ){
          instance.errormessage.set("phno","");
          instance.errormessage.set("name","");
          instance.errormessage.set("emailid","Invalid Email");
        }
        
        
        else{
       
        Meteor.call('contacts.insert', name,phno,emailid);        
        target.fullName.value = '';
        target.phoneNumber.value = '';
        target.email.value = '';
        Session.set("showAddContactForm",false);
      }},
      
      
    });


Template.EditContactPopUp.events({

  "submit .EditForm"(event,instance) {
    event.preventDefault();
    const target = event.target;
    const name = target.name.value;
    const phno=target.phoneNumber.value;
    const emailid=target.email.value;
    console.log(target);
    console.log(name,phno,this._id);
    let id=Session.get('mySession')._id;
       
    Meteor.call('contacts.update', name,phno,emailid,id);        
  
    
    Session.set("showEditContactForm",false);
  
  },

  "click .cancelEdit"(event,instance) {

    Session.set("showEditContactForm",false);
  },



});



Template.EditContactPopUp.helpers({
 
  editContact(){
    
   
    return Session.get('mySession');
   },
  });


   