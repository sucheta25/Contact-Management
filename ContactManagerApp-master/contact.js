var contactList = [];
var index;

// same as: $( document ).ready(function() {});
$(function(){
  var activePage = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  if (activePage == "home.html"){
    displayContactList();
  }
  else if (activePage == "editContact.html"){
    displayContactList("edit");
  }
  else if (activePage == "deleteContact.html"){
    displayContactList("delete");
  }

  $('#phone').on('keyup',function(){
    console.log("x");
    $(this).val($(this).val().replace(/^(\d{3})(\d{3})(\d{4})$/, "($1)$2-$3"));
  });
});

$('#btnAdd').on('click', function(e){
  $('.asterisk').hide();
  //---validate here--
  var validFirstname = isValidFirstname();
  var validLastname = isValidLastname();
  var validPhone = isValidPhone();
  var validEmail = isValidEmail();

  if (((validFirstname)&&(validLastname))&&((validPhone)&&(validEmail))){
    var contact = {
      firstname: $('#fname').val(),
      lastname: $('#lname').val(),
      phone: $('#phone').val(),
      email: $('#email').val()
    }
    addContact(contact);
  };
});
//add a new contact to contactList
function addContact(contact){
  //get contacts from localStorage
  var contactString = window.localStorage.getItem('contacts');
  contactList = JSON.parse(contactString) || [];
  //add new contact
  contactList.push(contact);

  //save back in localStorage
  contactString = JSON.stringify(contactList);
  window.localStorage.setItem('contacts', contactString);
  //display contactList
  displayContactList();
}

//display contactList in table
function displayContactList(buttonType){
  //clear table display
  $('#contactsTable').html('');
  //get contacts from localStorage
  var contactString = window.localStorage.getItem('contacts');
  //parse string to array object
  contactList = JSON.parse(contactString) || [];

  //display in table
  var holder = '';
  holder += '<tr>'
  holder += '<th>Lastname</th><th>Firstname</th><th>Phone</th><th>Email</th>'
  buttonType == 'edit' ? holder += '<th>Edit</th>' : ''
  buttonType == 'delete' ? holder += '<th>Delete</th>' : ''
  holder += '</tr>'

  for (var i = 0; i < contactList.length; i++) {
    holder += '<tr>'
    holder += '<td>'+ contactList[i].lastname + '</td>'
    holder += '<td>'+ contactList[i].firstname + '</td>'
    holder += '<td>'+ contactList[i].phone + '</td>'
    holder += '<td>'+ contactList[i].email + '</td>'
    if (buttonType == 'edit'){
      holder += '<td><button id="editContact" type="button" class="btn btn-primary" data-index="'+ i + '">Edit</button></td>'
    }
    else if (buttonType == 'delete'){
      holder += '<td><button id="deleteContact" type="button" class="btn btn-danger" data-index="'+ i + '">Delete</button></td>'
    }
    holder += '</tr>'
  }
  $('#contactsTable').append(holder);
}
//  Edit Contact
//select contact to edit or delete
$('#contactsTable').on('click', function(e){
  if (e.target.type == "button" ){
    index = $(e.target).data("index");

    if (e.target.id == "editContact") {
      //populate text fields
      $('#lname').val(contactList[index].lastname);
      $('#fname').val(contactList[index].firstname);
      $('#phone').val(contactList[index].phone);
      $('#email').val(contactList[index].email);
      $('#modalContainerEdit').modal('show');
    }
    else if (e.target.id == "deleteContact") {
      $('#selectedContact').html(contactList[index].lastname + ', ' + contactList[index].firstname);
      $('#modalContainerDelete').modal('show');
    }
  }
});

$('#editDialog').on('click', function(){
  $('.asterisk').hide();
  // validate input
  var validFirstname = isValidFirstname();
  var validLastname = isValidLastname();
  var validPhone = isValidPhone();
  var validEmail = isValidEmail();

  if (((validFirstname)&&(validLastname))&&((validPhone)&&(validEmail))){
    //update contact
    updateContact($('#lname').val(), $('#fname').val(), $('#phone').val(), $('#email').val(), index );
    displayContactList('edit');
    $('#modalContainerEdit').modal('hide');
  };
});

$('#cancelEditDialog').on('click', function(){
  $('#modalContainerEdit').modal('hide');
});

function updateContact(lname, fname, phone, email, index){
  contactList[index].lastname = lname;
  contactList[index].firstname = fname;
  contactList[index].phone = phone;
  contactList[index].email = email;

  //store in localStorage
  var contactString = JSON.stringify(contactList);
  window.localStorage.setItem('contacts', contactString);
}

//delete conatct
//deleteDialog
$('#deleteDialog').on('click', function(){
  contactList.splice(index, 1);
  //store in localStorage
  var contactString = JSON.stringify(contactList);
  window.localStorage.setItem('contacts', contactString);

  displayContactList("delete");
  $('#modalContainerDelete').modal('hide');
});
//cancelDeleteDialog
$('#cancelDeleteDialog').on('click', function(){
  $('#modalContainerDelete').modal('hide');
})

//validate phone no
function isValidPhone(){
  var phone = $('#phone').val();
  var validPhone = /^\(\d{3}\)\d{3}-\d{4}$/;
  if (validPhone.test(phone)){
    return true;
  }
  else{
    $('#invalidPhone').show();
    return false;
  }
}

//validate firstname: must not be empty
function isValidFirstname() {
  if ($('#fname').val() == ''){
    $('#invalidFname').show();
    return false;
  }
  return true;
}

//validate lastname: must not be empty
function isValidLastname() {
  if ( $('#lname').val() == ''){
    $('#invalidLname').show();
    return false;
  }
  return true;
}

//validate email
function isValidEmail() {
  var email = $('#email').val();
  var validEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

  if (!validEmail.test(email)){
    $('#invalidEmail').show();
    return false;
  }
  return true;
}
// quick search
$('#searchByName').on('keyup', function(){
  displayQuickSearch();
})
// search contact by name
$('#btnSearch').on('click', function(){
  displayQuickSearch();
});

function displayQuickSearch(){
  $('#contactsTable').html('');
  var criteria = $('#searchByName').val().toLowerCase();
  var holder = '';
  holder += '<tr>'
  holder += '<th>Lastname</th><th>Firstname</th><th>Phone</th><th>Email</th>'
  holder += '</tr>'
  for (var i = 0; i < contactList.length; i++) {
    var name = contactList[i].lastname.toLowerCase() + ' ' + contactList[i].firstname.toLowerCase();
    if( name.indexOf(criteria) != -1 ){
      console.log(contactList[i].firstname);
        holder += '<tr>'
        holder += '<td>'+ contactList[i].lastname + '</td>'
        holder += '<td>'+ contactList[i].firstname + '</td>'
        holder += '<td>'+ contactList[i].phone + '</td>'
        holder += '<td>'+ contactList[i].email + '</td>'
        holder += '</tr>'
    }
  }
  $('#contactsTable').append(holder);
}
