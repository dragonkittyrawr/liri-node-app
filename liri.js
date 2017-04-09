var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
// var r = require('rotten-api')("YOUR_API_KEY");
var fs = require("fs");

var userCommand = process.argv[2];
var userInput = process.argv[3];

var consumerKey = (keys.twitterKeys.consumer_key);
var privateKey = (keys.twitterKeys.consumer_secret);
var accessTokenKey = (keys.twitterKeys.access_token_key);
var privateTokenKey = (keys.twitterKeys.access_token_secret);

var doWhat;
var command = "WAITING";

var commandLog;

var commandCount;

letsFuckinDoThis();

function myTweets(command) {
    var client = new twitter({
        consumer_key: consumerKey,
        consumer_secret: privateKey,
        access_token_key: accessTokenKey,
        access_token_secret: privateTokenKey
    });

    client.get("statuses/user_timeline", { screen_name: "there_once_was", count: 20 }, function(error, tweets, response) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        } else {
            for (var i = 0; i < tweets.length; i++) {
                var count = i + 1;
                console.log("======== TWEET " + count + " ========");
                console.log("Sent: " + tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("==================");
            }
        }
    });
};

function spotifyThis(command, userInput) {
    if (userInput === undefined) {
        userInput = "\"The Sign\" by Ace of Base";
    };

    spotify.search({ type: "track", query: userInput }, function(error, data) {

        if (error) {

            console.log('Error occurred: ' + error);

            return;

        } else {

            console.log("======== SONG: " + data.tracks.items[0].name + " ========");
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("======== PREVIEW LINK ========");
            console.log("Preview: " + data.tracks.items[0].preview_url);
            console.log("==================");

        }
    });
};

function omdbThis(command, userInput) {

    if (userInput === undefined) {
        userInput = "Mr.Nobody";
    };

    request("http://www.omdbapi.com/?t=" + userInput, function(error, response, body) {

        if (error) {
            console.log('Error occurred: ' + error);
            return;
        } else {
            console.log("======== MOVIE: " + JSON.parse(body).Title + " ========");
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log(JSON.parse(body).Ratings[1].Source + " Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Future home of a link.")
        }
    });
};

function commandMe(userCommand) {
    if (userCommand !== "do-what-it-says") {
        command = userCommand;
    } else {
        fs.readFile("random.txt", "utf8", function(error, data) {
            doAsHeSay = data.split(",");
            // console.log(doAsHeSay);
            command = doAsHeSay[0];
            userInput = doAsHeSay[1];
            // console.log(command);
            // console.log(userInput);
        });
    };
    return command;
};


function letsFuckinDoThis() {

    commandMe(userCommand);

    if (userInput) {
        commandLog = "Command: " + userCommand + ", Input: " + userInput;
    } else {
        commandLog = "Command: " + userCommand + ", Input: none";
    }

    setTimeout(function() {
        if (command !== "WAITING") {

            fs.appendFile("log.txt", commandLog + "; ", function(error) {
                if (error) {
                    console.log('Error occurred: ' + error);
                    return;
                }
            });

            if (command === undefined || command === "help") {
                console.log("Welcome! Available commands:\nmy-tweets\nspotify-this-song \"song name by band name\"\nmovie-this \"movie name\"\ndo-what-it-says\nPlease enter a command.");

            } else if (command === "my-tweets") {
                myTweets();
            } else if (command === "spotify-this-song") {
                spotifyThis(userInput);
            } else if (command === "movie-this") {
                omdbThis(userInput);
            } else {
                console.log("Please enter a valid command. Type 'node liri.js help' for a command list.");
            };
        };
    }, 5);
}
