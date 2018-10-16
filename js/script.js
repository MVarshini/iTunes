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
    var favoriteArray = JSON.parse(localStorage.getItem('favorites'));
    var str = "";
    for (let i = 0; i < response.results.length; i++) {
        var hires = response.results[i].artworkUrl100.replace('100x100', '480x480');
        var trackId = response.results[i].trackId;

        isfavorite = (favoriteArray != null && favoriteArray.indexOf(trackId) >=0) ? "favorite" : ""; 
        str += '<div class="card" style="margin:10px">' 
            + '<div class="imgWrapper">' 
            + '<span class="favouriteContainer" onclick="makefavorite(event,'+ trackId+',)">' 
            + '<i class="favouriteIcon fa fa-heart '+ isfavorite +' "></i></span>' 
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

function makefavorite(event, trackId) {

    var favoriteArray = localStorage.getItem('favorites') == null ? [] : JSON.parse(localStorage.getItem('favorites'));
    var el = event.currentTarget.firstChild
    if (hasClass(el, 'favorite')) {
        localStorage.setItem('favorites', JSON.stringify(removeFavorite(favoriteArray, trackId)));
        el.classList.remove("favorite");

    } else {
        favoriteArray.push(trackId);
        localStorage.setItem('favorites', JSON.stringify(favoriteArray));
        if (el.classList)
            el.classList.add("favorite");

    }

}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function removeFavorite(favoriteList, trackId) {

    var index = favoriteList.indexOf(trackId);

    if (index > -1) {
        favoriteList.splice(index, 1);
    }
    return favoriteList;
}