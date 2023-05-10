const urlReg = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$");
var form = document.getElementById("redirectCreationForm");
var keyInput = document.getElementById("key");
var keyHelper = document.getElementById("keyHelperText");
var urlInput = document.getElementById("url");
var urlHelper = document.getElementById("urlHelperText");

var submitButton = document.getElementById("submit");

keyInput.focus();

chrome.tabs.query({active: true, lastFocusedWindow: true}, tab => {
    console.log(tab);
    if (tab.length > 0 && urlReg.test(tab[0].url)) {
        url.defaultValue = tab[0].url;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "Enter") {
        submit(event);
    }
})
form.addEventListener("submit", submit);
submitButton.addEventListener("click", submit);

keyInput.addEventListener("focusout", (event) => {
    keyValidation();
});

url.addEventListener("input", (event) => {
    if (urlReg.test(event.target.value)) {
        console.log("Valid URL");
    } else {
        console.log("Not a valid URL");
    }
});

url.addEventListener("focusout", (event) => {
    urlValidation();
})

function submit(event) {
    event.preventDefault();
    if (keyValidation() && urlValidation()) {
        chrome.storage.sync.set({
            [form.Key.value]: form.URL.value
        }, () => {
            window.location.assign("redirects.html");
        });
    }
}

function keyValidation() {
    if (form.Key.value.length === 0) {
        keyInput.classList.add("invalid");
        keyHelper.classList.remove("invisible");
        return false;
    } else {
        keyInput.classList.remove("invalid");
        keyHelper.classList.add("invisible");
        return true;
    }
}

function urlValidation() {
    if (!urlReg.test(form.URL.value)) {
        urlInput.classList.add("invalid");
        urlHelper.classList.remove("invisible");
        return false;
    } else {
        urlInput.classList.remove("invalid");
        urlHelper.classList.add("invisible");
        return true;
    }
}