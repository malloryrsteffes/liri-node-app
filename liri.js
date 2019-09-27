// DEPENDENCIES
// =================================================================
// Reads and sets any environment variables with the dotenv package
require("dotenv").config();

//Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");

// Imports the `keys.js` file and stores it in a variable
var keys = require("./keys.js");
 
// Include the axios npm package
var axios = require("axios");

// Include the Moment NPM Package
var moment = require("moment");

// Include the File Server Package
var fs = require("fs");

//Initialize the Spotify API using our client ID/Key
var spotify = new Spotify(keys.spotify);

// Global variable for the user input
var userInput = "";

    // Allows users to call inputs with multiple words 
    for (i = 3; i < process.argv.length; i++){
        if (i > 3 && i < process.argv.length){
            userInput = userInput + "+" + process.argv[i];
        }
        else {
            userInput += process.argv[i];
        }
    }

// Switch-Case Statement to direct which function runs
var action = process.argv[2];

switch (action) {
    case "movie-this":
      movieThis(userInput);
      break;
    
    case "spotify-this-song":
      spotifyThis(userInput);
      break;
    
    case "concert-this":
      concertThis();
      break;
    
    case "do-what-it-says":
      doWhatItSays();
      break;
    }


// MOVIE CALL FUNCTION ------------------------------------------------
function movieThis(input){
   
    if (input === "") {
        input = "Mr. " + "Nobody";
        
    }// This is what I'm trying - it isn't working! 

    var queryURL = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy"

    // Run a request with Axios to the OMDV API with the movie specified
    axios.get(queryURL).then(
    function(response) {
        // console.log(response.data);
        // console.log("================================");
        console.log("------------------------------------------------------------------------------------------")
        console.log("Title: " + response.data.Title);
        console.log("Released: " + response.data.Year);
        console.log("Rating: " + response.data.Rated);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1]["Value"]);
        console.log("Produced in: " + response.data.Country);
        console.log("Available In: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("------------------------------------------------------------------------------------------")


    })
    .catch(function(error) {
        if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
        } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        }
        console.log(error.config);
    });

}
// BANDS IN TOWN FUNCTION----------------------------------------------
function concertThis(){

    var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
    console.log(queryURL)

    // Run a request with Axios to the OMDV API with the movie specified
    axios.get(queryURL).then(
    function(response) {

        var eventsFetched = response.data;

        for (i = 0; i < eventsFetched.length; i++){
            console.log("------------------------------------")
            console.log("Venue: " + eventsFetched[i].venue.name);
            console.log("Location: " + eventsFetched[i].venue.city + ", " + eventsFetched[i].venue.region);
            console.log(moment(eventsFetched[i].datetime).format('hh:mm a'));
        }
        console.log("------------------------------------")
    })
    .catch(function(error) {
        if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
        } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        }
        console.log(error.config);
    });

}

// SPOTIFY THIS FUNCTION --------------------------------------------------------------
function spotifyThis(input){

    if (input === ""){
        input = "The " + "Sign";
    } // This is what I'm trying - it isn't working!

    spotify
    .search({ type: 'track', query: input, limit: 1 })
    .then(function(response) {

        var items = response.tracks.items;
        console.log("------------------------------------------------------------------------------------------")
        console.log("Artist: " + items[0].artists[0].name); 
        console.log("Song Title: " + items[0].name);
        console.log("Spotify Preview: " + items[0].preview_url);
        console.log("Album: " + items[0].album.name);
        console.log("------------------------------------------------------------------------------------------")
    })

    .catch(function(err) {
        console.log(err);
    });

}

// DO WHAT IT SAYS FUNCTION ---------------------------------------------
function doWhatItSays(){

    fs.readFile("random.txt", "utf8", function(err, data){
        if (err) {
            return console.log(err);
          }

        data = data.split(",");
        
        // Passes the data at the second index location to the spotifyThis function
        spotifyThis(data[1]);

    })
}