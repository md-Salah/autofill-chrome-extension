// const pino = require('pino')();
const { ImapFlow } = require("imapflow");
const { convert } = require('html-to-text')

let counter = 1;

const main = async (client) => {
  let href = "";
  await client.connect();

  let lock = await client.getMailboxLock("INBOX");
  try {
    let message = await client.fetchOne(
      "*",
      {
        bodyParts: [
          "text",
        ],
      },
    );

    let data = await message["bodyParts"].get("text").toString();
    // console.log(data);

    //Extract the href from the email body
    // if(data.includes("We need to make sure you are human. Please verify your email by below")){
    //   let text = data.split('Click here to view your verification code')[0].split('<a href=3D"')[1];
    //   href = text.replace(/=\r\n/g, '').replace('upn=3D', 'upn=').replace('">', '')
    //   href = href.split('Click here to view your verification code')[0]
    //   // console.log(href)
    // }
    // else
      // console.log('href not found, Recent email is:', data)
    var text = convert(data, {wordwrap: 130});
      
  } catch (e) {
    console.log("data getting error: ", e);
  } finally {
    lock.release();
  }

  await client.logout();
  return text;
};

exports.getOtp = async (req, res, next) => {
  port = 993;
  let { email, pass } = req.body;
  if(!email || !pass) {
    return res.status(400).json({
      success: false,
      error: "Email or password is empty",
      data: "",
    });
  }

  email = email.trim();
  console.log(`\n${counter}. Email: ${email}`);
  counter++;

  if (email.endsWith("@gmail.com")) host = "imap.gmail.com";
  else if (email.endsWith("@outlook.com")) host = "outlook.office365.com";
  else if (email.endsWith("@zohomail.eu")) host = "imap.zoho.eu";
  else if (email.endsWith("@aol.com")) host = "imap.aol.com";
  else {
    return res.status(400).json({
      success: false,
      error: "Provide a valid & supported email address",
      data: "",
    });
  }

  var client = new ImapFlow({
    host: host,
    port: port,
    secure: true,
    auth: {
      user: email,
      pass: pass,
    },
    logger: false,
  });

  main(client)
    .then(async (text) => {
      if (text) {
        console.log('text is:', text)
        return await res.status(200).json({
          success: true,
          error: "",
          data: text,
        });
      } else {
        console.log('data not found in recent email');
        return await res.status(200).json({
          success: false,
          error: "data not found in recent email",
          data: text,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
        data: "",
      });
    });
};
