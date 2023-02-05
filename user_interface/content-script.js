(() => {
  function matchKeyword(input, keywords) {
    let flag = false;
    // console.log(input.placeholder, input.id, input.className, input.name, input.value);

    if (keywords.some((k) => input.placeholder.includes(k))) flag = true;
    else if (keywords.some((k) => input.id.includes(k))) flag = true;
    else if (keywords.some((k) => input.className.includes(k))) flag = true;
    else if (keywords.some((k) => input.name.includes(k))) flag = true;
    else if (keywords.some((k) => input.value.includes(k))) flag = true;

    return flag;
  }

  function fillForm(userInfo) {
    let inputs = document.querySelectorAll("input");
    let keywords = {
      email: ["email"],
      password: ["password"],
      fname: ["fname", "first name", "firstName"],
      lname: ["lname", "last name", "lastName"],
      phoneNumber: ["phoneNumber", "phone number"],
    };

    inputs.forEach((input) => {
      // console.log(input);
      if (input.type == "email") input.value = userInfo.email;
      else if (input.type == "password") input.value = "strong_password";
      else if (matchKeyword(input, keywords["email"]))
        input.value = userInfo.email;
      else if (matchKeyword(input, keywords["password"]))
        input.value = "strong_password";
      else if (matchKeyword(input, keywords["fname"]))
        input.value = userInfo.fname;
      else if (matchKeyword(input, keywords["lname"]))
        input.value = userInfo.lname;
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
      fillForm(userInfo);
    }
  });
})();
