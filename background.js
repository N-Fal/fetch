/// install a new name list whenever the extension is installed/updated

let nameData = {}
let nameURL = "https://api.scryfall.com/catalog/card-names";
let devInstance = true;

chrome.runtime.onInstalled.addListener(function(details) {
    console.log("Extension installed - downloading catalog")

    if (!devInstance) {
        if (details.reason !== 'chrome_update') {
            fetch(nameURL).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok :(');
                }
                return response.json();
            }).then(data => {
                nameData = data;
                console.log('Card info: ', nameData);
        
                // save file
                chrome.storage.local.set({ 'names': nameData }, function() {
                    console.log('JSON data saved successfully on install.');
                });
        
            }).catch(error => {
                console.error('There was a problem with the fetch operation: ', error)
            })
            }
            else {
                console.log("invalid reason");
            }
    }
    else {
        console.log("developer instance, not installing new JSON")
    }

})

// to load the file in popup.js:

// chrome.storage.local.get('names', function(result) {
//     if (result.names) {
//         var namesData = result.names;
//         console.log("retrieved name catalog: ", namesData)
//     }
//     else{
//         console.log("the name catalog was not found in local storage")
//     }
// });