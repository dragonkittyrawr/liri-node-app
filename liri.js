// Copyright 2017 ERIN STEWART

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



var keys = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
// var r = require('rotten-api')("YOUR_API_KEY");
var fs = require("fs");
var ajax = require("ajax");
var jsdom = require("jsdom");

var $ = require("jquery");

var jQuery = require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);
});

var userCommand = process.argv[2];
var userInput = process.argv[3];

var consumerKey = (keys.twitterKeys.consumer_key);
var privateKey = (keys.twitterKeys.consumer_secret);
var accessTokenKey = (keys.twitterKeys.access_token_key);
var privateTokenKey = (keys.twitterKeys.access_token_secret);

var doWhat;
var command = "WAITING";
var input = "WAITING";
var commandLog;


function commandMe(userCommand, userInput) {
    if (userCommand !== "do-what-it-says") {
        command = userCommand;
        input = userInput;
        // console.log("If : " + input);
    } else {
        fs.readFile("random.txt", "utf8", function(error, data) {
            doAsHeSay = data.split(",");
            command = doAsHeSay[0];
            input = doAsHeSay[1];
            // console.log("Else : " + input);
        });
    };
    return (command, input);
};

function myTweets(command) {

    var client = new Twitter({
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

function spotifyThis(command, input) {

    // console.log("Spotify : " + input);

    if (input === undefined) {
        input = "\"The Sign\" by Ace of Base";
    };

    spotify.search({ type: "track", query: input }, function(error, data) {

        if (error) {
            console.log('Error occurred: ' + error);
            return;
        } else {
            // console.log(data.tracks.items);
            console.log("======== SONG: " + data.tracks.items[0].name + " ========");
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("======== PREVIEW LINK ========");
            console.log("Preview: " + data.tracks.items[0].preview_url);
            console.log("==================");
        }
    });
};

function UrlExists(url, cb) {
    $.ajax({
        url: url,
        dataType: 'text',
        type: 'GET',
        complete: function(xhr) {
            if (typeof cb === 'function')
                cb.apply(this, [xhr.status]);
        }
    });
}


function omdbThis(command, input) {

    // console.log("OMDB: " + input);

    if (input === undefined) {
        input = "Mr.Nobody";
    };
    request("http://www.omdbapi.com/?t=" + input, function(error, response, body) {
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

            rottenUrl = "https://www.rottentomatoes.com/m/" + JSON.parse(body).Title.replace(/ /g, "_");

            var omdbFuckers = $.get(rottenUrl, function (data) {
                if ($("#mainColumn", "h1").val() === "404 - NOT FOUND") {
                    console.log("OMG");
                }
            }).statusCode(function(){
                console.log("I have no idea what I'm doing.")
            });
            console.log(omdbFuckers.statusCode[0]);
            // console.log($("#mainColumn", "h1").val());

            UrlExists(rottenUrl, function(status) {
                if (status === 200) {
                    console.log(rottenUrl);
                } else if (status === 404) {
                    errRottenUrl = "https://www.rottentomatoes.com/m/" + JSON.parse(body).Title.replace(/ /g, "_") + "_" + JSON.parse(body).Year;
                    console.log(errRottenUrl);
                }
            });
            console.log(rottenUrl);
        }
    });
};




function letsFuckinDoThis() {

    commandMe(userCommand, userInput);

    // console.log("Fuck : " + input);

    if (input) {
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
                // console.log("Fuck Twitter: " + input);
                myTweets(command);
            } else if (command === "spotify-this-song") {
                // console.log("Fuck Spotify: " + input);
                spotifyThis(command, input);
            } else if (command === "movie-this") {
                // console.log("Fuck OMDB: " + input);
                omdbThis(command, input);
            } else {
                console.log("Please enter a valid command. Type 'node liri.js help' for a command list.");
            };
        };
    }, 5);
}


letsFuckinDoThis();
