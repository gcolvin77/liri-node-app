require("dotenv").config();
var keys = require("./keys.js");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var input = process.argv[2];
var choice = process.argv[3];
var inputLength = process.argv.length;

var params = {screen_name: 'SucksTweeting',
              count: 20,
};

var switches= function(){

switch (input){
    case "my-tweets":
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          var response = JSON.parse(response.body)
      
          for (var i=0; i<response.length; i++){
          
          console.log("tweet: " + response[i].text);
          console.log("creation time: " + response[i].created_at);    
          console.log("----------------------");

           }
      
          }
      });

      break;

    case "spotify-this-song":
                
            if (inputLength < 4){
                choice = "The Sign Ace of Base"
            }

            spotify.search({ type: 'track', query: choice, limit: 1 })
            .then(function(response) {

               var url = response.tracks.items[0].preview_url;     
               if (!url){    //if preview url is null, assigns another URL
                    url = response.tracks.items[0].external_urls.spotify;
               }
               console.log("-------------------------")
               console.log("artist: " + response.tracks.items[0].artists[0].name);
               console.log("song: " + response.tracks.items[0].name);
               console.log("url: " + url);
               console.log("album: " + response.tracks.items[0].album.name); 
               
               results =  "\n-------------------------\nartist: " + response.tracks.items[0].artists[0].name +
               "\nsong: " + response.tracks.items[0].name +
               "\nurl: " + url +
               "\nalbum: " + response.tracks.items[0].album.name

               logResults(results);

            })
            .catch(function(err) {
            console.log(err);
            });

            break;

    case "movie-this":
        if (inputLength < 4){
            choice = "Mr. Nobody"
        }

        var queryUrl = "http://www.omdbapi.com/?t=" + choice + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {
            var movieInfo = JSON.parse(body) 
            
            for (var i = 0; i<movieInfo.Ratings.length; i++){
                if (movieInfo.Ratings[i].Source === "Rotten Tomatoes"){
                    var tomatoRating = movieInfo.Ratings[i].Value;  
                }
            }

            if (tomatoRating === undefined){
                 tomatoRating = "N/A";

            }

            console.log("---------------------------");
            console.log("Title: " + movieInfo.Title);
            console.log("Year: " + movieInfo.Released);
            console.log("IMDB Rating: " + movieInfo.imdbRating);
            console.log("Rotten Tomato Rating: " + tomatoRating);
            console.log("Country of Production: " + movieInfo.Country);
            console.log("Language: " + movieInfo.Language);
            console.log("Plot Summary: " + movieInfo.Plot);
            console.log("Actors: " + movieInfo.Actors);
            console.log("---------------------------")
           
            var results = "\n---------------------------\nTitle: " + movieInfo.Title +
            "\nYear: " + movieInfo.Released +
            "\nIMDB Rating: " + movieInfo.imdbRating +
            "\nRotten Tomato Rating: " + tomatoRating +
            "\nCountry of Production: " + movieInfo.Country +
            "\nLanguage: " + movieInfo.Language +
            "\nPlot Summary: " + movieInfo.Plot +
            "\nActors: " + movieInfo.Actors +
            "\n---------------------------"
            
             logResults(results); 

                }
            });
            
        break;

    case "do-what-it-says":

            fs.readFile("random.txt", "utf8", function(error, data) {

            if (error) {
            return console.log(error);
            }
        
            var dataArr = data.split(",");
            console.log(dataArr);

            input = dataArr[0];
            choice = dataArr[1];
            inputLength = 4;

            switches();
        
             });

             break;

        default: 
             console.log("Unrecognized input, try again");
             break;

} //end switch

}//end function switches



var logResults = function(results){
fs.appendFile("log.txt", results, function(err) {
    
    if (err) {
      console.log(err);
    }
  
    else {
      console.log("Content Added!");
    }
    
  });
}

switches();