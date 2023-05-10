const urlReg = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$");
let active = true;
let currentMapping = new Map();
let sortedKeys = [];


chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    currentMapping.clear();
    sortedKeys = [];

    chrome.storage.sync.get(null).then(res => {
        Object.keys(res).forEach(key => {
            if (key.includes(text)) {
                currentMapping.set(key, res[key]);
            }
        })
        sortedKeys = Array.from(currentMapping.keys());
        sortedKeys.sort((a, b) => {
            return a.length - b.length || a.localeCompare(b);
        });
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
    chrome.storage.sync.remove(text);
});

chrome.omnibox.onInputEntered.addListener((text) => {
    chrome.tabs.update({url: currentMapping.get(text)});
});