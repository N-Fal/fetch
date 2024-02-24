
// listens for text input on the popup and passes the card name to submitForm()
var nameForm = document.getElementById('name_form')
nameForm.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // test deleting this
        event.preventDefault();
        submitForm();
        rateLimit(1000);
        document.getElementById('textInput').value = ""; 
    }
})

// processes card name and updates display
function submitForm()
{
    var input = document.getElementById('textInput').value;
    if (input !== "")
    {
        document.getElementById('output').innerHTML = input;
        console.log("received ", input);
    }
}

// prevents user from entering another name for 't' ms
function rateLimit(t) {
    if (t < 100)
        t = 100

    console.log("disabling input for ", t, " ms");
    document.getElementById("textInput").disabled = true;

    setTimeout(function() {
        document.getElementById("textInput").disabled = false;
        console.log("input has been enabled");
    }, t);
}

function bgColor()
{
    var bgId = document.getElementById('background');
    bgId.style = getCardColor()
}