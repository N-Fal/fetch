
// listens for text input on the popup and passes the card name to submitForm()
document.getElementById('name_form').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitForm();
        rateLimit(DEF_DELAY);
        document.getElementById('textInput').value = ""; 
    }
    else
    {
        // code for updating the autofill list
    }
})

// processes card name and updates display
function submitForm() {
    const userInput = document.getElementById('textInput').value;
    if (userInput !== "")
    {
        console.log("received ", userInput);
        // consider adding a db of card names to ensure there are no pointless API calls (and also make an autofill menu)
        getCardInfo(buildURL(userInput))
    }
}

// prevents user from entering another name for 't' ms
const DEF_DELAY = 1000, MIN_DELAY = 100;
function rateLimit(t) {
    t = Math.max(t, MIN_DELAY);
    console.log("disabling input for ", t, " ms");
    document.getElementById("textInput").disabled = true;

    setTimeout(function() {
        document.getElementById("textInput").disabled = false;
        console.log("input has been enabled");
    }, t);
}

// constructs the api call based on the search term
function buildURL(name) {
    console.log("search term: ", name);
    urlstring = "https://api.scryfall.com/cards/named?fuzzy=";
    name.split(" ").forEach(element => {
        urlstring += element;
        urlstring += "+";
    });

    return urlstring
}

// creates the JSON based on the card URL
function getCardInfo(apiURL) {
    let responseData = {};

    fetch(apiURL).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok :(');
        }
        return response.json();
    }).then(data => {
        responseData = data;
        console.log('Card info: ', responseData);
        populateWindow(responseData);
    }).catch(error => {
        console.error('There was a problem with the fetch operation: ', error)
    })
}

// puts all the info from the JSON into the elements of the popup window
function populateWindow(responseData) {
    // example:
    document.getElementById("img").src = responseData.image_uris.normal;
}