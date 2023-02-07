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
  // console.log(mailCred);

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

async function getRecentEmail(x=''){
  console.log('recent email called', x);
  let mailCred = await getMailCred();
  // console.log(mailCred);
  if(mailCred){
    lastEmail.innerHTML = 'Loading...';
    const text = await fetchEmail(mailCred.email, window.atob(mailCred.pass))
    lastEmail.innerHTML = text;
    
    mailCred = {...mailCred, recentEmail:text}
    await chrome.storage.local.set({ mailCred: mailCred });
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

