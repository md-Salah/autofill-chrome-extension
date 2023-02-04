
var passlen;
var lowlen = document.getElementById("lowcaseNumber");
var uplen = document.getElementById("upcaseNumber");
var splen = document.getElementById("spcharNumber");
var numlen = document.getElementById("numNumber");
var oppasslen = document.getElementById("plen");
var oplowlen = document.getElementById("lowcaselen");
var opuplen = document.getElementById("upcaselen");
var opsplen = document.getElementById("spcharlen");
var opnumlen = document.getElementById("numlen");

function totalcnt() {
    passlen = parseInt(lowlen.value) + parseInt(uplen.value) + parseInt(splen.value) + parseInt(numlen.value);
    oppasslen.innerHTML = (passlen);
}

function genPassword() {
    // var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charNum = "0123456789";
    var charLow = "abcdefghijklmnopqrstuvwxyz";
    var charUp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charSp = "!@#$%^&*(){}[]<>.,?/\|~_-;:";
    var passwordLength = passlen;
    var password = "";
    var pass = "";

    // for (var i = 0; i < passwordLength; i++) {

    //     for (var j = 0; j < lowlen; j++) {
    //         var randomNumber = Math.floor(Math.random() * charLow.length);
    //         password += charLow.substring(randomNumber, randomNumber + 1);
    //     }
    //     for (var j = 0; j < uplen; j++) {
    //         var randomNumber = Math.floor(Math.random() * charUp.length);
    //         password += charUp.substring(randomNumber, randomNumber + 1);
    //     }
    //     for (var j = 0; j < splen; j++) {
    //         var randomNumber = Math.floor(Math.random() * charSp.length);
    //         password += charSp.substring(randomNumber, randomNumber + 1);
    //     }
    //     for (var j = 0; j < numlen; j++) {
    //         var randomNumber = Math.floor(Math.random() * charNum.length);
    //         password += charNum.substring(randomNumber, randomNumber + 1);
    //     }

    //     // var randomNumber = Math.floor(Math.random() * charLow.length);
    //     // password += charLow.substring(randomNumber, randomNumber + 1);
    //     // var randomNumber = Math.floor(Math.random() * charUp.length);
    //     // password += charUp.substring(randomNumber, randomNumber + 1);
    //     // var randomNumber = Math.floor(Math.random() * charSp.length);
    //     // password += charSp.substring(randomNumber, randomNumber + 1);
    //     // var randomNumber = Math.floor(Math.random() * charNum.length);
    //     // password += charNum.substring(randomNumber, randomNumber + 1);

    //     var randomNumber = Math.floor(Math.random() * password.length);
    //     pass += password.substring(randomNumber, randomNumber + 1);

    // }



    for (var j = 0; j < parseInt(lowlen.value); j++) {
        var randomNumber = Math.floor(Math.random() * charLow.length);
        password += charLow.substring(randomNumber, randomNumber + 1);
    }
    for (var j = 0; j < parseInt(uplen.value); j++) {
        var randomNumber = Math.floor(Math.random() * charUp.length);
        password += charUp.substring(randomNumber, randomNumber + 1);
    }
    for (var j = 0; j < parseInt(splen.value); j++) {
        var randomNumber = Math.floor(Math.random() * charSp.length);
        password += charSp.substring(randomNumber, randomNumber + 1);
    }
    for (var j = 0; j < parseInt(numlen.value); j++) {
        var randomNumber = Math.floor(Math.random() * charNum.length);
        password += charNum.substring(randomNumber, randomNumber + 1);
    }

    pass = shuffleString(password);

    document.getElementById("password").innerHTML = pass;
}

function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

totalcnt();

oplowlen.innerHTML = lowlen.value;
lowlen.oninput = function () {
    oplowlen.innerHTML = this.value;
    totalcnt();
    genPassword();
}

opuplen.innerHTML = uplen.value;
uplen.oninput = function () {
    opuplen.innerHTML = this.value;
    totalcnt();
    genPassword();
}

opsplen.innerHTML = splen.value;
splen.oninput = function () {
    opsplen.innerHTML = this.value;
    totalcnt();
    genPassword();
}

opnumlen.innerHTML = numlen.value;
numlen.oninput = function () {
    opnumlen.innerHTML = this.value;
    totalcnt();
    genPassword();
}


