var list = document.getElementById("redirects");
let sortedKeys = [];

chrome.storage.sync.get(null).then(res => {
    sortedKeys = Array.from(Object.keys(res));
    sortedKeys.sort();

    renderKeys(sortedKeys);
});

list.addEventListener("click", event => {
    chrome.storage.sync.remove(event.target.innerText);
    sortedKeys.splice(sortedKeys.indexOf(event.target.innerText), 1);
    renderKeys(sortedKeys);
});

function renderKeys(keys) {
    removeAllChildNodes(list);
    keys.forEach(key => {
        const node = document.createElement("li");
        const textNode = document.createTextNode(key);
        node.appendChild(textNode);
        list.appendChild(node);
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}