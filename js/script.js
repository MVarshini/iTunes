var searchInput = document.getElementById('id_searchTerm');
searchInput.value = "anirudh"

var term = searchInput.value;

var url = "https://itunes.apple.com/search?term=";


// using XMLHttpRequest
function getData(term) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url + term, true);
    xhr.onload = function() {
        parser(xhr.responseText);
    };
    xhr.send();
}


getData(term)
var resultDiv = document.getElementById('result');

function parser(data) {

    var response = JSON.parse(data);
    var str = "";
    for (let i = 0; i < response.results.length; i++) {
        var hires = response.results[i].artworkUrl100.replace('100x100', '480x480');

        str += '<div class="card" style="margin:10px">' 
            + '<div class="imgWrapper">' 
            + '<span class="favouriteIcon">' 
            + '<i class="fa fa-heart unfavorite"></i></span>' 
            + '<img class="albumCover" src="' 
            + response.results[i].artworkUrl100 
            + '" alt="Avatar">' + '</div>' 
            + '<div class="container">' 
            + '<h4 class="artistName"><b>' + response.results[i].artistName + '</b></h4>' 
            + '<p>Interior Designer</p>' 
            + '</div>' 
            + '</div>';
    }
    resultDiv.innerHTML = str;
}


searchInput.onblur = function(event) {
    checkKey(event);
}

searchInput.onkeydown = function(event) {
    checkKey(event);
}

function checkKey(e) {
    if (!event.keyCode || event.keyCode == 13) {
        getData(searchInput.value);
    }
}