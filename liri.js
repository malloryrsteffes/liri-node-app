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

// Divider for cleanliness
var divider = "\n------------------------------------------------------------\n\n";

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
        
    }

    var queryURL = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy"

    // Run a request with Axios to the OMDB API with the movie specified
    axios.get(queryURL).then(
    function(response) {
        console.log(input);
        var movieData = response.data;
        // Save data in an object so we can easily append it with appendFile
        var movieDataObject = [
            "Title: " + movieData.Title,
            "Released: " + movieData.Year,
            "Rating: " + movieData.Rated,
            "Rotten Tomatoes Rating: " + response.data.Ratings[1]["Value"],
            "Produced In: " + movieData.Country,
            "Available In: " + movieData.Language,
            "Plot: " + movieData.Plot,
            "Actors: " + movieData.Actors,
        ].join("\n\n");

        // Appends the user's search to the log
        fs.appendFile("log.txt", movieDataObject + divider, function(err) {
            if (err) throw err;
            console.log(movieDataObject);
          });

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

    // Run a request with Axios to the BiT API with the artist specified
    axios.get(queryURL).then(
    function(response) {

        var eventsFetched = response.data;
        
        // Loops through the events fetched to create event objects
        for (i = 0; i < eventsFetched.length; i++){
            
            // Creates an object we can append later
            var eventsFetchedObject = [
                "Venue: " + eventsFetched[i].venue.name,
                "Location: " + eventsFetched[i].venue.city + ", " + eventsFetched[i].venue.region,
                "Date: " + moment(eventsFetched[i].datetime).format('MM/DD/YYYY'),
            ].join("\n\n");

            // Appends the user call to the log page 
            fs.appendFile("log.txt", eventsFetchedObject + divider, function(err) {
                if (err) throw err;
                console.log(eventsFetchedObject);
              });
        
        }
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

    // Default search if user doesn't specify a song 
    if (input === ""){
        input = "The " + "Sign";
    }

    spotify
    .search({ type: 'track', query: input, limit: 1 })
    .then(function(response) {

        var songData = response.tracks.items;

        var songDataObject = [
            "Artist: " + songData[0].artists[0].name,
            "Song Title: " + songData[0].name,
            "Spotify Preview: " + songData[0].preview_url,
            "Album: " + songData[0].album.name
        ].join("\n\n");

        fs.appendFile("log.txt", songDataObject + divider, function(err) {
            if (err) throw err;
            console.log(songDataObject);
          });

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