const emailInput = document.getElementById("emailInput");
const passInput = document.getElementById("passInput");
const lastEmail = document.getElementById("lastEmail");

const validMsg = document.getElementById("validMsg");

const saveCred = document.getElementById("saveCred");
const clearBtn = document.getElementById("clearBtn");

const refresh = document.getElementById("refresh");

async function getMailCred() {
  let { mailCred } = await chrome.storage.local.get(["mailCred"]);
  return mailCred;
}

async function updateUI() {
  mailCred = await getMailCred();

  if (mailCred) {
    emailInput.value = mailCred.email;
    passInput.value = window.atob(mailCred.pass);
  } else {
    emailInput.value = "";
    passInput.value = "";
    validMsg.innerHTML = "Set your credential";
    validMsg.style.color = "black";
  }
}
updateUI();
getRecentEmail();

saveCred.addEventListener("click", async (e) => {
  e.preventDefault();

  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  validMsg.style.color = 'red';
  if (!emailPattern.test(emailInput.value))
    validMsg.textContent = "Your Email is invalid";
  else if (passInput.value === "")
    validMsg.textContent = "Your Password is empty";
  else {
    mailCred = await getMailCred();

    if (
      mailCred &&
      mailCred.email === emailInput.value &&
      window.atob(mailCred.pass) === passInput.value
    )
      validMsg.textContent = "Already updated";
    else {
      let mailCred = {
        email: emailInput.value,
        pass: window.btoa(passInput.value),
      };

      await chrome.storage.local.set({ mailCred: mailCred }, async () => {
        await updateUI();
        validMsg.style.color = "green";
        validMsg.textContent = "Your credential is saved successfully";
        console.log(mailCred);
        await getRecentEmail();
      });
    }
  }
});


clearBtn.addEventListener("click", async(e) => {
  await chrome.storage.local.remove(["mailCred"], async() => {
    var err = chrome.runtime.lastError;
    if (err) console.log(err);
    await updateUI();
    validMsg.textContent = "Your information is removed from database";
    validMsg.style.color = "red";
  });
});

refresh.addEventListener("click", getRecentEmail);

async function getRecentEmail(){
  const mailCred = await getMailCred();
  // console.log(mailCred);
  if(mailCred){
    lastEmail.innerHTML = 'Loading...';
    const text = await fetchEmail(mailCred.email, window.atob(mailCred.pass))
    lastEmail.innerHTML = text;
  }
}


//Get link from backend (localhost:5000) by http requst
async function fetchEmail(email, pass) {
  // console.log('Before requsting credentials', email, pass)
  // POST: Endpoint: http://localhost:5000/api/v1/otp
  try {
    let res = await fetch("http://localhost:5000/api/v1/otp", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        pass: pass,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    
    if(res.status === 200){
      res = await res.json();
      return res.data;
    }
    else
      return "Failed to connect your mail protocol"
  } catch {
    return "Failed to connect OTP server. Check your server side";    
  }
}


//Read email pass from local storage
// async function readStorage() {
//   let { email, pass } = await chrome.storage.local.get(["email", "pass"]);

//   if (email == null || pass == null) {
//     console.log("Email and Pass is null");
//     email = "";
//     pass = "";
//   } else pass = window.atob(pass);

//   return { email, pass };
// }

//Main tab - bls international
// async function mainTab() {
//   let otpInput = document.getElementById("otp");
//   // let continueBtn = document.querySelector('input[name="save"]');

//   if (otpInput) {
//     // $('#reponse_div').on('DOMSubtreeModified', async function(){
//     let resDiv = document.getElementById("reponse_div");
//     if (resDiv.textContent.includes("Verification code sent to your email")) {
//       //Fetch the activation link from email and open newTab
//       console.log("Finding activation link in email");
//       let { email, pass } = await readStorage();
//       let activationLink = await getActivationLink(email, pass);
//       console.log("activation link:", activationLink);
//       if (activationLink) window.open(activationLink, "_blank");
//       listenForOtp();
//     }
//     // });
//   }
// }

//Tab2: Open verification link in new window and Fetch OTP
// async function activationTab() {
//   let submitBtn = document.querySelector('input[name="Submit"]');
//   // console.log("submitBtn", submitBtn);
//   if (submitBtn) {
//     let { email } = await readStorage();
//     let emailInput = document.querySelector('input[name="email"]');
//     console.log("emailInput", emailInput);

//     // console.log("Your email", email);
//     if (emailInput) {
//       emailInput.value = email;
//       setTimeout(() => {
//         submitBtn.click();
//       }, 1000);
//     }
//   }

//   let div = document.querySelector('div[class="blurry-text"]');
//   if (div) {
//     let otp = div.textContent.split(" ")[3];
//     await chrome.storage.local.set({ otp: otp });
//     // console.log("otp is saved to local storage:", otp);
//     window.close();
//   }
// }



//Extension UI, CRUD Email and Password
// async function popupUI() {
//   let popupContainer = document.getElementById("popupContainer");
//   if (popupContainer) {
//     let emailInput = document.getElementById("emailInput");
//     let passInput = document.getElementById("passInput");
//     let saveCred = document.getElementById("saveCred");
//     let clearBtn = document.getElementById("clearBtn");
//     let msg = document.getElementById("msg");

//     //Read credentials from local storage
//     let { email, pass } = await readStorage();
//     emailInput.value = email;
//     passInput.value = pass;

//     //Create or Update credential
//     saveCred.addEventListener("click", () => {
//       if (emailInput.value != "" && passInput.value != "") {
//         chrome.storage.local.set(
//           { email: emailInput.value, pass: window.btoa(passInput.value) },
//           () => {
//             msg.textContent = "Credential is updated";
//           }
//         );
//       } else msg.textContent = "Email or password is empty";
//     });

//     //Delete credential
//     clearBtn.addEventListener("click", () => {
//       chrome.storage.local.remove(["email", "pass"], () => {
//         emailInput.value = "";
//         passInput.value = "";
//         msg.textContent = "Old email pass is removed";
//       });
//     });
//   }
// }

//Event listener on local storage for OTP
// function listenForOtp() {
//   chrome.storage.onChanged.addListener(function (changes, namespace) {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//       // console.log(
//       //   `Storage key "${key}" in namespace "${namespace}" changed.`,
//       //   `Old value was "${oldValue}", new value is "${newValue}".`
//       // );
//       if (key === "otp") {
//         let otpInput = document.getElementById("otp");
//         otpInput.value = "";
//         otpInput.value = newValue;
//       }
//     }
//   });
// }

//Wait for element to be loaded, utility function
// function waitForElm(selector) {
//   return new Promise((resolve) => {
//     if (document.querySelector(selector)) {
//       return resolve(document.querySelector(selector));
//     }

//     const observer = new MutationObserver((mutations) => {
//       if (document.querySelector(selector)) {
//         resolve(document.querySelector(selector));
//         observer.disconnect();
//       }
//     });

//     observer.observe(document.body, {
//       childList: true,
//       subtree: true,
//     });
//   });
// }
