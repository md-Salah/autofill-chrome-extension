
(() => {
  function matchKeyword(input, keywords) {
    let flag = false;
    // console.log(input.placeholder, input.id, input.className, input.name, input.value);
    const label = document.querySelector(`label[for="${input.id}"]`)
    
    if (keywords.some((k) => input.placeholder.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (keywords.some((k) => input.id.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (keywords.some((k) => input.className.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (keywords.some((k) => input.name.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (keywords.some((k) => input.value.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (label && keywords.some((k) => label.textContent.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;

    return flag;
  }

  function fillForm(input, userInfo) {
    // only lowercase letters without space & special characters
    let keywords = {
      email: ["email"],
      password: ["password"],
      fname: ["fname", "firstname"],
      lname: ["lname", "lastname"],
      phoneNumber: ["mobile", "phone"],
      fullName: ["fullname", "name"],
      address: ["address"],
      otp: ["confirmationcode", "verificationcode", "senttoyouremail"],
    };

    if (matchKeyword(input, keywords["otp"]))
      fillOTP(input);
    else if (input.type == "email") input.value = userInfo.email;
    else if (input.type == "password") {}
    else if (matchKeyword(input, keywords["email"]))
      input.value = userInfo.email;
    else if (matchKeyword(input, keywords["password"])) {}
    else if (matchKeyword(input, keywords["fname"]))
      input.value = userInfo.fname;
    else if (matchKeyword(input, keywords["lname"]))
      input.value = userInfo.lname;
    else if (matchKeyword(input, keywords["fullName"]))
      input.value =  userInfo.fname + ' ' + userInfo.lname;
    else if (matchKeyword(input, keywords["phoneNumber"]))
      input.value =  userInfo.phoneNumber;
    else if (matchKeyword(input, keywords["address"]))
      input.value =  userInfo.address;
    else console.log("No match");
  }

  chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    const { type, url, userInfo } = obj;
    if (type === "NEW_TAB") {
      console.log("content-script, NEW_TAB");
      console.log("userInfo: ", userInfo);
      
      // Fill Form
      const delegate = (selector) => (cb) => (e) => e.target.matches(selector) && cb(e);
      const inputDelegate = delegate('input, textarea');
      
      const body = document.getElementsByTagName('body')[0];
      body.addEventListener('click', inputDelegate((e)=>{
        if(userInfo.autofillActive)
          fillForm(e.target, userInfo);
      }))

    }
  });


  async function fillOTP(input){
    console.log('filling OTP')
    let { mailCred } = await chrome.storage.local.get(["mailCred"]);
    // console.log(mailCred.recentEmail)

    let mail = mailCred.recentEmail;
    if(mail && mail.includes(window.location.hostname)){

      const pattern = /(code|otp|OTP|Code|CODE)[a-zA-Z:\s]*[0-9]{1,6}\s/;
      const otpPattern = /[0-9]{1,6}/;

      let otp = ''

      if(pattern.test(mail)){
        
        let result = mail.match(pattern)[0]

        if(result){
          otp = result.match(otpPattern)[0]
          console.log('Your OTP is:', otp)

          input.value = otp;
        }
      
      }
      else {
        console.log("OTP pattern doesn't match:", mail)
        const response = await chrome.runtime.sendMessage({type: 'MAIL_UPDATE'});
        console.log(response);
      }
    }
    else {
      console.log('OTP code not received yet');
      const response = await chrome.runtime.sendMessage({type: 'MAIL_UPDATE'});
      console.log(response);
    }

  }

})();
