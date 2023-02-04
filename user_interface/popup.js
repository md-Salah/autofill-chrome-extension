console.log("popup.js");

// var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
var regName = /[a-zA-Z]+/;

const submitBtn = document.getElementById("submitBtn");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const address = document.getElementById("address");
const email = document.getElementById("email");
const division = document.getElementById("division");
const district = document.getElementById("district");
const phoneNumber = document.getElementById("phoneNumber");
const validMsg = document.getElementById("validMsg");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  console.log("fired");

  console.log(fname.value, lname.value, email.value);

  validMsg.style.color = "red";
  if (fname.value == "") {
    validMsg.textContent = "First Name is invalid";
  } 
  else if (lname.value == "") {
    validMsg.textContent = "Last Name is invalid";
  } 
  else if (phoneNumber.value = "") {
    validMsg.textContent = "Phone Number is invalid";
  } 
  else if (email.value == "") {
    validMsg.textContent = "Email is invalid";
  } 
  else if (address.value == "") {
    validMsg.textContent = "Address is invalid";
  } 
  else {
    validMsg.textContent = "Your information is saved successfully";
    validMsg.style.color = "green";
  }
});
