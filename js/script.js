//Global variables
var searchInput = document.getElementById('id_searchTerm');
var limit = 20,
    offset = 0;
searchInput.value = "anirudh"
var term = searchInput.value;
var resultDiv = document.getElementById('result');

searchList(limit, offset, term);

// using XMLHttpRequest to get API response
function getData(url, cbk) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        cbk(xhr.responseText);
    };
    xhr.send();
}

//Search API call
function searchList(limit, offset, term) {
    var url = "https://itunes.apple.com/search" + "?limit=" + limit + "&offset=" + offset + "&term=" + term;
    getData(url, listCbk);
}

//Search API call response parser
function listCbk(data) {

    var response = JSON.parse(data);
    var favoriteArray = JSON.parse(localStorage.getItem('favorites'));
    var str = "";
    for (let i = 0; i < response.results.length; i++) {
        var hires = response.results[i].artworkUrl100.replace('100x100', '480x480');
        var trackId = response.results[i].trackId;

        isfavorite = (favoriteArray != null && favoriteArray.indexOf(trackId) >= 0) ? "favorite" : "";
        str += '<div class="card" style="margin:10px">' +
            '<div class="imgWrapper">' +
            '<span class="favouriteContainer" onclick="makefavorite(event,' + trackId + ',)">' +
            '<i class="favouriteIcon fa fa-heart ' + isfavorite + ' "></i></span>' +
            '<label  for="modalDiv"><div class="container" onclick="showDetails(' + trackId + ')" >' +
            '<img class="albumCover" src="' +
            response.results[i].artworkUrl100 +
            '" alt="Avatar">' + '</div>' +
            '<p>' + (response.results[i].trackName ? response.results[i].trackName : "") + '</p>' +
            '<p>' + (response.results[i].artistName ? response.results[i].artistName : "") + '</p>' +
            '<p>' + (response.results[i].trackTimeMillis ? millisToMinutesAndSeconds(response.results[i].trackTimeMillis) : "") + '</p>' +
            '</label>' +
            '</div>' +
            '</div>';
    }
    resultDiv.innerHTML += str;
}

//Details API call response parser
function detailsCbk(data) {
    var response = JSON.parse(data);
    response = response.results[0];
    var hires = response.artworkUrl100.replace('100x100', '480x480');
    var releaseYear = new Date(response.releaseDate).getFullYear();
    var detailsHTML = "";
    var detailsDiv = document.getElementById("detailsModal");
    detailsDiv.innerHTML = "";
    detailsHTML = '<div class="songDetail">' +
        '<div class="leftColumn">' +
        '<img class="albumCover" src="' + hires + '" alt="Avatar">' +
        '</div>' +
        '<div class="rightColumn">' +
        '<div class="container">' +
        '<p><b>Song Name: </b>' + response.trackName + '</p>' +
        '<p><b>Artist Name: </b>' + response.artistName + '</p>' +
        '<p><b>Release Year: </b>' + releaseYear + '</p>' +
        '<p><b>Song Duration: </b>' + millisToMinutesAndSeconds(response.trackTimeMillis) + '</p>' +
        '<p><b>Price: </b>' + response.currency + ' ' + response.trackPrice + '</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    detailsDiv.innerHTML = detailsHTML;
}
//Details API call
function showDetails(trackId) {
    var detailsDiv = document.getElementById("detailsModal");
    detailsDiv.innerHTML = "";
    var url = "https://itunes.apple.com/lookup?id=" + trackId;
    getData(url, detailsCbk);
}

//Favorites
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

function removeFavorite(favoriteList, trackId) {

    var index = favoriteList.indexOf(trackId);

    if (index > -1) {
        favoriteList.splice(index, 1);
    }
    return favoriteList;
}

// Helper Functions
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

searchInput.onkeypress = function (event) {
    if (!event.keyCode || event.keyCode == 13) {
        resultDiv.innerHTML = "";
        searchList(limit, 0, searchInput.value);

    }
}

document.addEventListener('scroll', function (e) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        offset += 20;
        searchList(limit, offset, term);
    }
}, true);