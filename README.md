# LIRI

LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.


## How It Works 

Liri searches Spotify for songs, Band in Town for concerts, and OMDB for movies. It does this by sending requests using the 'axios' package to the Bands in Town, Spotify, and OMDB APIs. 

Liri requires Axios to run, as well as the Node Spotify API, Moment, and fs. 


## Prerequisites

What you should have installed to run this program:

```
node.js
```
```
axios.js
```
```
node-spotify-app.js
```
```
moment.js
```


### Obtaining a personal Spotify Client ID and Secret

Users will need to generate their own unique Spotify client IDs and keys. This can be done by visiting <https://developer.spotify.com/my-applications/#!/>, then navigating to <https://developer.spotify.com/my-applications/#!/applications/create>. Once there, they will need to register for a new application to use the Spotify API. 

Users should store their Client IDs and Client Secret in a .env file, structured to look like the following:

```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

```

**IMPORTANT**: Without the .env file, the app will not work for a cloned app. 

This will keep the user's API key information private.


# Inside the Code


Liri takes in the user's input. This input can be multiple words, made possible using the following "for" loop: 

```js
for (i = 3; i < process.argv.length; i++){
        if (i > 3 && i < process.argv.length){
            userInput = userInput + "+" + process.argv[i];
        }
        else {
            userInput += process.argv[i];
        }
    }

``` 
Since the arguments at the first three index locations [0-2] of `process.argv` are the node call, the file name, and our parameter, we can begin our loop at 3.

In order to call LIRI, the user must run node on the liri.js file. The following are available LIRI **parameters**:
   * `concert-this`

   * `spotify-this-song`

   * `movie-this`

   * `do-what-it-says`



Structure of a LIRI call:
```js
node liri.js <parameter> <userInput>
```

The program then uses a **switch statement** to determine the action it is taking. Here, `process.argv[2]` is equal to the parameter set by the user in their node call.

```js
var action = process.argv[2];

switch (action) {
    case "concert-this":
      movieThis(userInput);
      break;
    
    case "spotify-this-song":
      spotifyThis(userInput);
      break;
    
    case "movie-this":
      concertThis();
      break;
    
    case "do-what-it-says":
      doWhatItSays();
      break;
    }

```
Each action prompts a function that makes a call to either the OMDB, Spotify, or BandsInTown APIs. An example:
```js
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
}
```
(The `concert-this` call utilizes `moment.js` to format event times in a pretty way.)

The "function -> call" method LIRI uses is different the final case, which calls the Spotify API after reading the text in the random.txt file).

```js
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
```

The response to each call is logged onto the console, and appended to a log text file. If there is an error in the call, it will log as an error.

# LIRI in action

![Movie-This Example](https://media.giphy.com/media/QyPe9NBNXVQ1lgvedf/giphy.gif)

![Spotify-This Example](https://media.giphy.com/media/KCvpDWsoV3rFn3C3nz/giphy.gif)

![Concert-This Example](https://media.giphy.com/media/M9fNG2ZSDcUyJD01cR/giphy.gif)

![Do-What-It-Says Example](https://media.giphy.com/media/gLcEH9BNhzKU5T2ECi/giphy.gif)
)

### Default searches

If the user does not input a term or phrase to search, Liri will output data for predefined movies, events, or songs.

```js
if (input === ""){
        input = "The " + "Sign";
    }
```

## Built With

* [Node](http://https://nodejs.org/en/) - a JavaScript runtime environment
* [Axios](/https://www.npmjs.com/package/axios) - Promise-based HTTP client for the browser and node.js
* [The Spotify API](https://www.npmjs.com/package/node-spotify-api) - A simple to use API library for the Spotify REST API.
* [The OMDB API](http://www.omdbapi.com/) - a RESTful web service to obtain movie information
* [The BandsInTown API](https://manager.bandsintown.com/support/bandsintown-api) - allows users to view local concerts and gives live music recommendations
* [Moment NPM](https://www.npmjs.com/package/moment) - A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.

## Authors

* **Mallory Steffes**  - [GitHub](https://github.com/malloryrsteffes)

## Acknowledgments

* Jorge and Eric, my wonderful TAs.
* Sid, who helped me get my Spotify code started!
