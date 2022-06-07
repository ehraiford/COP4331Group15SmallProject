const urlBase = 'http://142.93.112.119/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function findCookieValue(cookieName) {
  let cookies = cookieName + "=";
  let c = document.cookie.split(",");
  console.log(document.cookie);
  for (i = 0; i < c.length; i++) {
    index= c[i].indexOf("=");
    cookieString = c[i].substring(0,index+1);
    if(cookieString == cookies) {
      return(c[i].substring(index+1));
    }
  }
  return null;
}