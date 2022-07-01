const urlBase = 'http://processes.one/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let search = "";

let contactId = "";

function onLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "login.html";
}

function onLogin() {

  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  //	var hash = md5( password );
  if (login != "" && password != "") {
    document.getElementById("loginResult").innerHTML = "";

    let tmp = { Login: login, Password: password };
    //	var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify(tmp);
    //alert(jsonPayload);


    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let jsonObject = JSON.parse(xhr.responseText);
          userId = jsonObject.ID;
          console.log(jsonObject);

          if (userId < 1) {
            //document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
            document.getElementById("loginCheck").style.visibility = "visible";
            return;
          }
          firstName = jsonObject.FirstName;
          lastName = jsonObject.LastName;

          saveCookie();
          window.location.href = "main.html";
        }
      };
      xhr.send(jsonPayload);
    }
    catch (err) {
      //document.getElementById("loginResult").innerHTML = err.message;
      console.log(err.message);
    }
  }

}

function onRegister() {

  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;

  if (firstName != "" && lastName != "" && login != "" && password != "") {

    //document.getElementById("loginResult").innerHTML = "";
    let tmp = { FirstName: firstName, LastName: lastName, Login: login, Password: password };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let jsonObject = JSON.parse(xhr.responseText);
          userId = jsonObject.ID;
          console.log(jsonObject);

          if (userId < 1) {
            //document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
            //document.getElementById("loginCheck").style.visibility = "visible";
            return;
          }
          firstName = jsonObject.FirstName;
          lastName = jsonObject.LastName;

          saveCookie();
          window.location.href = "main.html";
        }
      };
      xhr.send(jsonPayload);
    }
    catch (err) {
      //document.getElementById("loginResult").innerHTML = err.message;
      console.log(err.message);
    }
  }
}

function searchContacts(tmp, tmp2) {
  var results = [];
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/ReadContacts.' + extension;
  console.log(userId);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        console.log(jsonObject);
        results = jsonObject.results;
        console.log(results);

        if (typeof tmp2 != 'undefined') {
	  xhr.open("POST", url, true);
          let jsonPayload = JSON.stringify(tmp2);
	  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
          try {
            xhr.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                let jsonObject2 = JSON.parse(xhr.responseText);
                results = results.concat(jsonObject2.results)
              if (results.length < 1) {
            displayContactMessage();
            return;
          }
          else {
            var element = document.getElementById('contactsMessage');
            var temp_element = document.createElement('span');
            temp_element.setAttribute('id', 'contactsMessage');
            element.parentNode.replaceChild(temp_element, element);

          }
             let result = results.reduce((unique, o) => {
              if(!unique.some(obj => obj.ID === o.ID )) {
                unique.push(o);
              }
              return unique;
          },[]);
          populateContacts(result);
	      }
            };
            xhr.send(jsonPayload);
          }
          catch (err) {
            console.log(err.message);
            return;
          }
        }
        else {
          console.log(results);
          if (results.length < 1) {
            displayContactMessage();
            return;
          }
          else {
            var element = document.getElementById('contactsMessage');
            var temp_element = document.createElement('span');
            temp_element.setAttribute('id', 'contactsMessage');
            element.parentNode.replaceChild(temp_element, element);
            populateContacts(results);
          }
        }
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    console.log(err.message);
    return;
  }
  console.log(results);

}

function lookupSearch() {
  userId = findCookieValue("userId");
  search = document.getElementById("search").value;
  console.log(search);

  if (search == "") {
    let tmp = { Name: search, Email: "", Phone: "", UserID: userId };
    searchContacts(tmp);
    return;
  }

  if (((search.includes('-') || search.includes(" ")) && !(/[a-zA-Z]/.test(search))) || !isNaN(search) && search.length > 0) {
    var sub = search;
    if (search.includes('-') || search.includes(" ")) {
      var string = "";
      sub = search.replaceAll(" ", "").replaceAll("-", "");
    }
    if (!isNaN(sub)) {
      let tmp;
      if (sub.length < 3) {
        tmp = { Name: "", Email: "", Phone: sub, UserID: userId };
      }
      else if (sub.length < 6) {
        sub = sub.substring(0, 3) + "-" + sub.substring(3);
        tmp = { Name: "", Email: "", Phone: sub, UserID: userId };
      }
      else {
        sub = sub.substring(0, 3) + "-" + sub.substring(3, 6) + "-" + sub.substring(6);
        tmp = { Name: "", Email: "", Phone: sub, UserID: userId };
      }
      searchContacts(tmp);
      return;
    }
  }

  if (search.includes('@')) {
    let tmp = { Name: "", Email: search, Phone: "", UserID: userId };
    searchContacts(tmp);
    return;
  }

  //Check name and email then
  let tmp = { Name: search, Email: "", Phone: "", UserID: userId };
  let tmp2 = { Name: "", Email: search, Phone: "", UserID: userId };

  searchContacts(tmp, tmp2);
}

function selectContact(name, email, phone, id) {
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
  document.getElementById("editButton").setAttribute("onClick", "updateContact(" + id + ");");
}

function updateContact(id) {
  let editName = document.getElementById("editName").value; //can't be empty
  let editEmail = document.getElementById("editEmail").value; //make sure it contains a @
  let editPhone = document.getElementById("editPhone").value;

  let tmp = { Name: editName, Email: editEmail, Phone: editPhone, ID: id };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/UpdateContact.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        console.log(jsonObject);
        if (jsonObject.error != "") {
          console.log(jsonObject.error)
          return;
        }
        lookupSearch();

        //clean input boxes
        document.getElementById("editName").value = "";
        document.getElementById("editEmail").value = "";
        document.getElementById("editPhone").value = "";
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    console.log(err.message);
  }
}

function populateContacts(array) {

  //organize array
  array.sort((a, b) => {
    let fa = a.Name.toLowerCase();
    let fb = b.Name.toLowerCase();
    if (fa < fb) {
      return -1;
    }
    else if (fa > fb) {
      return 1;
    }
    else {
      return 0;
    }
  });

  //clean table
  var element = document.getElementById('contactsLists');
  var temp_element = document.createElement('tbody');
  temp_element.setAttribute('id', 'contactsLists');
  element.parentNode.replaceChild(temp_element, element);

  for (let i = 0; i < array.length; i++) {
    let tag = document.createElement("tr");
    var childTag, text;
    tag.setAttribute('id', array[i].ID);

    //Name
    childTag = document.createElement("td");
    text = document.createTextNode(array[i].Name);
    childTag.appendChild(text);
    tag.appendChild(childTag);

    //Phone Number
    childTag = document.createElement("td");
    text = document.createTextNode(array[i].Phone);
    childTag.appendChild(text);
    tag.appendChild(childTag);

    //Email
    childTag = document.createElement("td");
    text = document.createTextNode(array[i].Email);
    childTag.appendChild(text);
    tag.appendChild(childTag);

    //Edit and Delete
    childTag = document.createElement("td");
    var buttonTag = document.createElement("button");
    buttonTag.setAttribute('id', 'EditContactButton');
    var iconTag = document.createElement("i");
    iconTag.setAttribute('class', "fa-solid fa-pen-to-square fa-lg");
    buttonTag.appendChild(iconTag);
    text = document.createElement("span");
    text.textContent = "Edit";
    text.setAttribute('id', 'edit');
    buttonTag.appendChild(text);
    buttonTag.setAttribute('data-toggle', 'modal');
    buttonTag.setAttribute('data-target', '#newEditModal');
    buttonTag.onclick = function() {
      selectContact(array[i].Name, array[i].Email, array[i].Phone, array[i].ID);
    }
    childTag.appendChild(buttonTag);
    tag.appendChild(childTag);
    //childTag = document.createElement("td");
    buttonTag = document.createElement("button");
    buttonTag.setAttribute('id', 'DeleteContactButton');
    iconTag = document.createElement("i");
    iconTag.setAttribute('class', "fa-solid fa-trash-can fa-lg");
    buttonTag.appendChild(iconTag);
    text = document.createElement("span");
    text.textContent = "Delete";
    text.setAttribute('id', 'delete');
    buttonTag.appendChild(text);
    buttonTag.onclick = function() {
      deleteContact(array[i].ID);
    }
    childTag.appendChild(buttonTag);
    tag.appendChild(childTag);

    //Add to HTML
    element = document.getElementById("contactsLists");
    element.appendChild(tag);
    console.log(tag.getAttribute('id'));
  }

}

function createContacts() {
  userId = findCookieValue("userId");
  let contactName = document.getElementById("contactName").value; //can't be empty
  let contactEmail = document.getElementById("contactEmail").value; //make sure it contains a @
  let contactPhone = document.getElementById("contactPhone").value; //should be in xxx-xx-xxxx form

  let tmp = { Name: contactName, Email: contactEmail, Phone: contactPhone, UserID: userId }

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/CreateContact.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        console.log(jsonObject);

        if (jsonObject.error != "") {
          console.log(jsonObject.error)
          return;
        }
        //populate search again
        lookupSearch();

        //clean fields
        document.getElementById("contactName").value = "";
        document.getElementById("contactEmail").value = "";
        document.getElementById("contactPhone").value = "";
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    console.log(err.message);
  }
  document.getElementById("overlay").style.display = 'none';
}

function deleteContact(id) {
confirm("Are you sure you'd like to delete?");
  let tmp = { ID: id };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/DeleteContact.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        console.log(jsonObject);
        if (jsonObject.error != "") {
          console.log(jsonObject.error)
          return;
        }
        lookupSearch();
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    console.log(err.message);
  }
}

function displayContactMessage() {
  //clear table
  var element = document.getElementById('contactsLists');
  var temp_element = document.createElement('tbody');
  temp_element.setAttribute('id', 'contactsLists');
  element.parentNode.replaceChild(temp_element, element);

  //clean message
  element = document.getElementById('contactsMessage');
  temp_element = document.createElement('span');
  temp_element.setAttribute('id', 'contactsMessage');
  element.parentNode.replaceChild(temp_element, element);

  //search message
  var element = document.getElementById('contactsMessage');
  var iconTag = document.createElement("span");
  br = document.createElement("br");
  iconTag.setAttribute('id', 'messageSymbol');
  element.appendChild(br);
  element.appendChild(iconTag);
  if (search == "") { //User has no contacts
    iconTag.setAttribute('class', "fa-solid fa-address-book fa-8x");
    element.appendChild(iconTag);
    var messageTag = document.createElement("span");
    messageTag.setAttribute('id', 'messageTag');
    messageTag.textContent = "Your contact list is empty.";
    element.appendChild(br);
    element.appendChild(messageTag);

  }
  else { //No Records Found.
    iconTag.setAttribute('class', "fa-solid fa-magnifying-glass fa-8x");
    element.appendChild(iconTag);
    var messageTag = document.createElement("span");
    messageTag.setAttribute('id', 'messageTag');
    messageTag.textContent = "No records found.";
    element.appendChild(br);
    element.appendChild(messageTag);
  }
}

function saveCookie() {
  let minutes = 60;
  let date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function findCookieValue(cookieName) {
  let cookies = cookieName + "=";
  let c = document.cookie.split(",");

  for (i = 0; i < c.length; i++) {
    index = c[i].indexOf("=");
    cookieString = c[i].substring(0, index + 1);
    if (cookieString == cookies) {
      return (c[i].substring(index + 1));
    }
  }
  return null;
}

function newContactModal() {

  //overlay.style.display = 'block';
  document.getElementById("overlay").style.display = 'block';
  //document.getElementById("newContactModal").style.display = 'block';
}

function newEditModal() {
  document.getElementById("editOverlay").style.display = 'block';
}

function closeNewContact() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
   document.getElementById("contactPhone").value = "";
}
