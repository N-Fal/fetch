
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

    return urlstring;
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

    // example url for card kingdom: https://www.cardkingdom.com/catalog/search?search=header&filter%5Bname%5D=Emry%2C+Lurker+of+the+Loch


    // front face
    // responseData.card_faces[0].image_uris.normal
    // back face
    // responseData.card_face[1].image_uris.normal

    // <p id="price">[price]</p>
    // <p id="edhrec">[edhrec]</p>
    // <p id="gatherer">[gatherer]</p>
    // <p id="articles">[articles]</p>
    // <p id="cardmarket">[cardmarket]</p>
    // <p id="tcgplayer">[tcgplayer]</p>

    try {
        document.getElementById("img").src = responseData.image_uris.normal;
    } catch (error) {
        console.log("card is two-faced, printing front side")
        document.getElementById("img").src = responseData.card_faces[0].image_uris.normal;
    }

    populate("title", responseData.name);
    populate("price", "price: $" + responseData.prices.usd);
    populate("edhrec", "<a href=\"" + responseData.related_uris.edhrec + "\" target=\"_blank\">EDHREC</a>");
    populate("gatherer", "<a href=\"" + responseData.related_uris.gatherer + "\" target=\"_blank\">gatherer</a>");
    populate("decks", "<a href=\"" + responseData.related_uris.tcgplayer_infinite_decks + "\" target=\"_blank\">decklists</a>");
    populate("articles", "<a href=\"" + responseData.related_uris.tcgplayer_infinite_articles + "\" target=\"_blank\">articles</a>");
    populate("cardmarket", "<a href=\"" + responseData.purchase_uris.cardmarket + "\" target=\"_blank\">cardmarket</a>");
    populate("cardkingdom", "<a href=\"" + cardMarketLink(responseData.name) + "\" target=\"_blank\">cardkindom</a>");
    populate("tcgplayer", "<a href=\"" + responseData.purchase_uris.tcgplayer + "\" target=\"_blank\">tcgplayer</a>");
}

// abstraction
function populate(id, info) {
    document.getElementById(id).innerHTML = info;
}

function cardMarketLink(name) {
    urlString = "https://www.cardkingdom.com/catalog/search?search=header&filter%5Bname%5D=";
    name.split(" ").forEach(element => {
        urlString += element;
        urlString += "+";
    });

    console.log(urlString)
    return urlString;
}

// map of background colors and the characters used to depict color identity in the API
// might change these later so they look better
let bgMap = new Map();
bgMap.set('B', "#bfbfbf");
bgMap.set('G', "#adf6b6");
bgMap.set('R', "#ffc09f");
bgMap.set('U', "#a0ced9");
bgMap.set('W', "#fcf5c7");

function getBg(colors)
{
    return bgMap.get(colors[0])
}