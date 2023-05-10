const urlReg = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$");
var form = document.getElementById("redirectCreationForm");
var keyInput = document.getElementById("key");
var urlInput = document.getElementById("url");
var submitButton = document.getElementById("submit");

form.addEventListener("submit", submit);
submitButton.addEventListener("click", submit);


url.addEventListener("input", (event) => {
    if (urlReg.test(event.target.value)) {
        console.log("Valid URL");
    } else {
        console.log("Not a valid URL");
    }
});

function submit(event) {
    event.preventDefault();
    console.log(form.Key.value);
    console.log(form.URL.value);
}