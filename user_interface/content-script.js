(() => {
  function matchKeyword(input, keywords) {
    let flag = false;
    // console.log(input.placeholder, input.id, input.className, input.name, input.value);
    
    if (keywords.some((k) => input.placeholder.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (keywords.some((k) => input.id.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (keywords.some((k) => input.className.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (keywords.some((k) => input.name.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;
    else if (keywords.some((k) => input.value.toLowerCase().replace(/[^a-z]/g, "").includes(k))) flag = true;

    return flag;
  }

  function fillForm(userInfo) {
    let inputs = document.querySelectorAll("input");
    let textarea = document.querySelectorAll("textarea");
    inputs = [...inputs, ...textarea]

    // only lowercase letters withour space, special characters
    let keywords = {
      email: ["email"],
      password: ["password"],
      fname: ["fname", "firstname"],
      lname: ["lname", "lastname"],
      phoneNumber: ["mobile", "phone"],
      fullName: ["fullname", "name"],
      address: ["address"],
    };

    inputs.forEach((input) => {
      // console.log(input);
      if (input.type == "email") input.value = userInfo.email;
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
    });
  }

  chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    const { type, url, userInfo } = obj;
    if (type === "NEW_TAB") {
      console.log("content-script, NEW_TAB");
      // let userInfo = await chrome.storage.local.get(["userInfor"])
      console.log("userInfo: ", userInfo);
      // console.log(inputs)
      const form = document.getElementsByTagName('form');
      if(form && userInfo.autofillActive){
        fillForm(userInfo);
      }
    }
  });
})();
