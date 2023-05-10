const urlReg = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$");
let active = true;
let currentMapping = new Map();
let sortedKeys = [];

chrome.storage.sync.set(
    {"google": "https://google.com",
    "gmail": "https://mail.google.com", 
    "docsgoogle": "https://docs.google.com"}, () => {
    console.log("Added google redirects");
})

// function setIcon(active) {
//     if (active) {
//         chrome.action.setIcon({
//             path: {
//                 16: "icons/on16.png",
//                 32: "icons/on32.png",
//                 48: "icons/on48.png",
//                 128: "icons/on128.png",
//             }
//         });
//     } else {
//         chrome.action.setIcon({
//             path: {
//                 16: "icons/off16.png",
//                 32: "icons/off32.png",
//                 48: "icons/off48.png",
//                 128: "icons/off128.png",
//             }
//         });
//     }
// }

// chrome.omnibox.onInputStarted.addListener(() => {
//     setIcon(true);
// });

chrome.omnibox.onInputCancelled.addListener(() => {
    // setIcon(active);
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    currentMapping.clear();
    sortedKeys = [];

    chrome.storage.sync.get(null).then(res => {
        Object.keys(res).forEach(key => {
            if (key.includes(text)) {
                currentMapping.set(key, res[key]);
            }
        })
        sortedKeys = Array.from(currentMapping.keys()); // maybe issue with mutability here
        sortedKeys.sort((a, b) => {
            return a.length - b.length || a.localeCompare(b);
        });
        console.log(sortedKeys);
        suggest(sortedKeys.map(key => {
            const idx = key.search(text);
            const prefix = key.slice(0, idx);
            const suffix = key.slice(idx + text.length);
            return {
                content: key,
                description: `${prefix}<match><url>${text}</url></match>${suffix}`,
                deletable: true
            }
        }))
    })
});

chrome.omnibox.onDeleteSuggestion.addListener(text => {
    console.log(`Removed '${text}' redirect`);
    chrome.storage.sync.remove(text);
});

chrome.omnibox.onInputEntered.addListener((text) => {
    console.log(text);
    chrome.tabs.update({url: currentMapping.get(text)});
});

// async function tabHandler(tabId) {
//     const tab = await chrome.tabs.get(tabId);

//     if (tab.url && urlReg.test(tab.url)) {
//         chrome.action.enable();
//         active = true;
//         setIcon(active);
//         chrome.action.setTitle({title: "Click to create a new redirect!"});
//     } else {
//         chrome.action.disable();
//         active = false;
//         setIcon(active);
//         chrome.action.setTitle({title: "Cannot create redirect for an invalid URL."});
//     }
// }

// chrome.tabs.onActivated.addListener(async (activeInfo) => {
//     await tabHandler(activeInfo.tabId);
// });

// chrome.tabs.onUpdated.addListener(async (tabId) => {
//     const tab = await chrome.tabs.get(tabId);
//     if (tab.active && tab.status === "complete") {
//         await tabHandler(tabId);
//     }
// });

// chrome.action.onClicked.addListener((tab) => {
//     if (tab.url && urlReg.test(tab.url)) {
//         chrome.tabs.create({
//             url: prefix + "new?url=" + tab.url.replace(/&/g, "%amp")
//         });
//     }
// });