console.log("popup.js");

const autofillActive = document.getElementById("autofillActive");

const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const phoneNumber = document.getElementById("phoneNumber");
const dob = document.getElementById("dob");
const address = document.getElementById("address");
const division = document.getElementById("division");
const district = document.getElementById("district");
const email = document.getElementById("email");

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const validMsg = document.getElementById("validMsg");

async function updateUI() {
  let { userInfo } = await chrome.storage.local.get(["userInfo"]);
  if (Object.keys(userInfo).length) {
    autofillActive.checked = userInfo.autofillActive;
    fname.value = userInfo.fname;
    lname.value = userInfo.lname;
    phoneNumber.value = userInfo.phoneNumber;
    dob.value = userInfo.dob;
    address.value = userInfo.address;
    division.value = userInfo.division;
    district.value = userInfo.district;
    email.value = userInfo.email;

    document.querySelectorAll('input[name="gender"]').forEach((ele) => {
      if (ele.value === userInfo.gender) ele.checked = true;
    });
  }
}
updateUI();


if (submitBtn != null)
  submitBtn.addEventListener("click", async (event) => {
    // console.log("save btn clicked");
    event.preventDefault();
    validMsg.style.color = "red";

    const gender = document.querySelector("input[name=gender]:checked");

    const phonePattern =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const namePattern = /^[a-zA-Z]{2,}$/;

    if (!namePattern.test(fname.value))
      validMsg.textContent = "First Name is invalid";
    else if (!namePattern.test(lname.value))
      validMsg.textContent = "Last Name is invalid";
    else if (!phonePattern.test(phoneNumber.value))
      validMsg.textContent = "Phone Number is invalid";
    else if (dob.value == "")
      validMsg.textContent = "Select your date of birth";
    else if (gender == null) validMsg.textContent = "Please select your gender";
    else if (address.value.length < 3)
      validMsg.textContent = "Address is invalid";
    else if (!emailPattern.test(email.value))
      validMsg.textContent = "Your Email is invalid";
    else {
      // Save this info to chrome local storage

      let newUserInfo = {
        autofillActive: autofillActive.checked,
        fname: fname.value,
        lname: lname.value,
        phoneNumber: phoneNumber.value,
        dob: dob.value,
        gender: gender.value,
        address: address.value,
        division: division.value,
        district: district.value,
        email: email.value,
      };

      if (chrome != null)
        await chrome.storage.local.set({ userInfo: newUserInfo }, () => {
          validMsg.style.color = "green";
          validMsg.textContent = "Your information is saved successfully";
          console.log(newUserInfo);
        });
    }
  });

if (resetBtn != null)
  resetBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    if (chrome != null) {
      await chrome.storage.local.remove(["userInfo"], () => {
        var err = chrome.runtime.lastError;
        if (err) console.log(err);
        validMsg.textContent = "Your information is removed from database";
        validMsg.style.color = "red";
      });
    }
  });

autofillActive.addEventListener("change", async(e) =>{
  let { userInfo } = await chrome.storage.local.get(["userInfo"]);

  let newUserInfo = {...userInfo, autofillActive: autofillActive.checked }
  await chrome.storage.local.set({ userInfo: newUserInfo }, () => {
    console.log(newUserInfo);
  });
})
