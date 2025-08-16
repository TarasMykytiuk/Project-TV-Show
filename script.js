//You can edit ALL of the code here

// Created one place to hold data
let allShows = [];
const state = {
  allShows,
  searchTerm: "",
};
// main dom elements of the page
const rootElem = document.getElementById("root");
const navBar = document.createElement("nav");
const selectorBlock = document.createElement("div");
// search elements
const showSelector = document.createElement("select");
const showInputContainer = document.createElement("div");
showInputContainer.setAttribute("id", "show-input-container");

//show selector used with show listing view
const showListingSelectorContainer = document.createElement("div");
showListingSelectorContainer.setAttribute("id", "show-selector-container");
const showListingSelect = document.createElement("select");
showListingSelect.setAttribute("id", "show-select");

const showsQuantityDomDom = document.createElement("p");
showsQuantityDomDom.setAttribute("id", "displayed-shows-squantity")

const episodeSelector = document.createElement("select");
const episodeInput = document.createElement("input");
const countArea = document.createElement("p");

const backToShowListingButton = document.createElement("button");
backToShowListingButton.setAttribute("id", "backToShowListingButton");
backToShowListingButton.textContent = "Shows listing";

// functions to get data from api

async function getAllShows() {
  let allShows;
  const cachedShows = localStorage.getItem("tvmazeShows");
  if (cachedShows) {
    allShows = JSON.parse(cachedShows);
  } else {
    try {
      const response = await fetch("https://api.tvmaze.com/shows");
      if (!response.ok) {
        throw new Error("Wait, we are loading your data");
      } else {
        allShows = await response.json();
        localStorage.setItem("tvmazeShows", JSON.stringify(allShows));
      }
    } catch (error) {
      alert("Failed to load data. Please check your network." + error.message);
      return [];
    }
  }
  return allShows;
}

async function getEpisodesByShowId(showId) {
  if (!showId) return [];
  let allEpisodes;
  const cachedEpisodes = localStorage.getItem(`tvmazeEpisodes_${showId}`);
  if (cachedEpisodes) {
    allEpisodes = JSON.parse(cachedEpisodes);
  } else {
    try {
      const response = await fetch(
        `https://api.tvmaze.com/shows/${showId}/episodes`
      );
      if (!response.ok) {
        throw new Error("Wait, we are loading your data");
      } else {
        allEpisodes = await response.json();

        localStorage.setItem(
          `tvmazeEpisodes_${showId}`,
          JSON.stringify(allEpisodes)
        );
      }
    } catch (error) {
      alert("Failed to load data. Please check your network." + error.message);
      return [];
    }
  }
  return allEpisodes;
}

// Created functions for the search bar creation
// And all events for its Dom elements

function createSearchBar(){
  document.body.insertBefore(navBar, document.body.firstChild);
  navBar.appendChild(selectorBlock);
  selectorBlock.classList.add("select");
}

function clearNavBarDoms(){
  navBar.innerHTML = "";
  selectorBlock.innerHTML = "";
  showSelector.innerHTML = "";
  showInputContainer.innerHTML = "";
  showListingSelectorContainer.innerHTML = "";
  showListingSelect.innerHTML = "";
}

function organiseShowInput(){
  const beforeShowInputDom = document.createElement("p");
  beforeShowInputDom.textContent = "Filtering for"
  const showInputField = document.createElement("input");
  showInputField.setAttribute("id", "show-input");
  showInputField.setAttribute("placeholder", "Please insert your text");
  showInputField.setAttribute("type", "search");
  showInputContainer.appendChild(beforeShowInputDom);
  showInputContainer.appendChild(showInputField);
  selectorBlock.appendChild(showInputContainer);

  showInputField.addEventListener("input", () => {
    let searchTerm = showInputField.value.toLowerCase();
    // Update the page to be empty before filteredShows append
    rootElem.innerHTML = "";
    const searchMatch = state.allShows.filter(
      (show) =>
        show.name.toLowerCase().includes(searchTerm) ||
        show.summary.toLowerCase().includes(searchTerm)
    );
    showsQuantityDomDom.textContent = `Found ${searchMatch.length} shows`;
    makePageForShows(searchMatch);
  });
}

function oganiseShowListingSelect(shows){
  showsQuantityDomDom.textContent = `Found ${shows.length} shows`;
  showListingSelectorContainer.appendChild(showsQuantityDomDom);
  showListingSelectorContainer.appendChild(showListingSelect);
  selectorBlock.appendChild(showListingSelectorContainer);
  createShowOptions(shows, showListingSelect);

  showListingSelect.addEventListener("change", async () => {
    let selectedShowId = Number(showListingSelect.value);
    if (isNaN(selectedShowId)) {
      rootElem.innerHTML = "";
      clearNavBarDoms();
      createSearchBar();
      countEpisodes(0, 0);
      return;
    }
    episodesListingForShow(selectedShowId);
  });

}

function organiseShowSelect(shows){
  showSelector.setAttribute("id", "select_show");
  showSelector.setAttribute("name", "select_show");
  showSelector.setAttribute("placeholder", "Chose show");
  selectorBlock.appendChild(showSelector);
  createShowOptions(shows, showSelector);

  showSelector.addEventListener("change", async () => {
    let selectedShowId = Number(showSelector.value);
    if (isNaN(selectedShowId)) {
      rootElem.innerHTML = "";
      clearNavBarDoms();
      createSearchBar();
      countEpisodes(0, 0);
      return;
    }
    episodesListingForShow(selectedShowId);
  });
}

function organiseEpisodeSelect(episodes){
  episodeSelector.setAttribute("id", "select_episode");
  episodeSelector.setAttribute("name", "select_episode");
  episodeSelector.setAttribute("placeholder", "Chose episode");
  selectorBlock.appendChild(episodeSelector);
  
  episodeSelector.addEventListener("change", async () => {
    const selectedEpisode = episodeSelector.value;
    //const rootElem = document.getElementById("root");
    if (selectedEpisode === "all") {
      makePageForEpisodes(episodes);
      countEpisodes(episodes.length, episodes.length);
      return;
    } else {
      const filteredEpisodes = episodes.filter((episode) => {
        const episodeCode =
          "S" +
          String(episode.season).padStart(2, "0") +
          "E" +
          String(episode.number).padStart(2, "0");
        return `${episodeCode} - ${episode.name}` === selectedEpisode;
      });
      makePageForEpisodes(filteredEpisodes);
      countEpisodes(episodes.length, filteredEpisodes.length);
    }
  });
}

function organiseEpisodeInput(episodes){
  episodeInput.setAttribute("id", "episode-input");
  episodeInput.setAttribute("placeholder", "Please insert your text");
  episodeInput.setAttribute("type", "search");
  selectorBlock.appendChild(episodeInput);

  episodeInput.addEventListener("input", () => {
    let searchTerm = episodeInput.value.toLowerCase();
    // Update the page to be empty before filteredEpisodes append
    rootElem.innerHTML = "";
    const searchMatch = episodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    makePageForEpisodes(searchMatch);
    countEpisodes(episodes.length, searchMatch.length);
  });
}

function organiseCountArea(){
  countArea.id = "count-area";
  selectorBlock.appendChild(countArea);
}

function attachBackToShowListingButton(){
  selectorBlock.appendChild(backToShowListingButton);
  backToShowListingButton.addEventListener("click", () => {
    clearNavBarDoms();
    createSearchBar();
    organiseShowInput();
    oganiseShowListingSelect(state.allShows);
    rootElem.innerHTML = "";
    makePageForShows(state.allShows);
  });

}

// create search options for search bar
// with data from api

function createShowOptions(shows, selector) {
  const sortedShows = shows.slice();
  sortedShows.sort((a, b) => {
    const A = a.name.toLowerCase();
    const B = b.name.toLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
  selector.innerHTML = "";
  sortedShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selector.appendChild(option);
  });
}

function createEpisodeOptions(episodes) {
  const placeholderEpisodeOption = document.createElement("option");
  placeholderEpisodeOption.value = "";
  placeholderEpisodeOption.textContent = "Please chose an episode";
  placeholderEpisodeOption.disabled = true;
  placeholderEpisodeOption.selected = true;
  placeholderEpisodeOption.hidden = false;
  episodeSelector.appendChild(placeholderEpisodeOption);

  const defaultEpisodeOption = document.createElement("option");
  defaultEpisodeOption.value = "all";
  defaultEpisodeOption.textContent = "All episodes";
  episodeSelector.appendChild(defaultEpisodeOption);

  episodes.forEach((episode) => {
    const episodeCode =
      "S" +
      String(episode.season).padStart(2, "0") +
      "E" +
      String(episode.number).padStart(2, "0");

    const optionText = episodeCode + " - " + episode.name;
    const option = document.createElement("option");
    option.value = optionText;
    option.textContent = optionText;
    episodeSelector.appendChild(option);
  });
}

// generate page for all shows  or episodes entities

function makePageForShows(shows){
  rootElem.innerHTML = "";
  // to apply differen positioning of show or episodes cards
  // new parent dom created
  const showCardsDom = document.createElement("div");
  showCardsDom.classList.add("show-cards-container");
  rootElem.appendChild(showCardsDom);
  for ( const show of shows){
    makeShowCard(show, showCardsDom);
  }
}

function makePageForEpisodes(episodes) {
  rootElem.innerHTML = "";
  // to apply differen positioning of show or episodes cards
  // new parent dom created
  const episodeCardsDom = document.createElement("div");
  episodeCardsDom.classList.add("episode-cards-container");
  rootElem.appendChild(episodeCardsDom);
  for (const episode of episodes) {
    makeEpisodeCard(episode, episodeCardsDom);
  }
}

// create listing of episodes for one show
async function episodesListingForShow(showId){
  clearNavBarDoms();
  createSearchBar();
  organiseShowSelect(state.allShows, showSelector);
  const episodes = await getEpisodesByShowId(showId);
  organiseEpisodeSelect(episodes);
  organiseEpisodeInput(episodes);
  organiseCountArea();
  attachBackToShowListingButton();
  showSelector.value = showId;
  createEpisodeOptions(episodes);
  rootElem.innerHTML = "";
  makePageForEpisodes(episodes);
  countEpisodes(episodes.length, episodes.length);
}

// generate single cards for shows or episodes

function makeShowCard(show, parentDom){
  const name = show.name;
  const medImageUrl = show.image.medium;
  const summary = show.summary;
  const rating = show.rating.average;
  const genres = show.genres;
  const status = show.status;
  const runtime = show.runtime;

  const cardDom = document.createElement("div");
  cardDom.classList.add("show-card");
  const nameDom = document.createElement("h2");
  nameDom.textContent = name;
  // if show name clicked, episodes listing displayed
  nameDom.addEventListener("click", () => {
    episodesListingForShow(show.id);
  });

  const contentDom = document.createElement("div");
  contentDom.classList.add("show-content");
  const imageDom = document.createElement("img");
  imageDom.src = medImageUrl;
  const summaryDom = document.createElement("p");
  // original summary contained "<p>" at start and "</p>" at the end
  summaryDom.innerHTML = summary.substring(3, summary.length - 4);

  const infoDom = document.createElement("div");
  infoDom.classList.add("show-info");

  const ratingDom = document.createElement("div");
  ratingDom.classList.add("show-info-item");
  const ratingNameDom = document.createElement("p");
  ratingNameDom.classList.add("info-item-name");
  ratingNameDom.textContent = "Rated:"
  const ratingValueDom = document.createElement("p");
  ratingValueDom.textContent = rating;
  ratingDom.appendChild(ratingNameDom);
  ratingDom.appendChild(ratingValueDom);

  const genresDom = document.createElement("div");
  genresDom.classList.add("show-info-item");
  const genresNameDom = document.createElement("p");
  genresNameDom.classList.add("info-item-name");
  genresNameDom.textContent = "Genres:"
  const genresValueDom = document.createElement("p");
  // add all genres to one string
  let genresStr = "";
  for ( let i = 0; i < genres.length; i++){
    i != genres.length - 1 ? genresStr += genres[i] + " | " : genresStr += genres[i];
  }
  genresValueDom.textContent = genresStr;
  genresDom.appendChild(genresNameDom);
  genresDom.appendChild(genresValueDom);

  const statusDom = document.createElement("div");
  statusDom.classList.add("show-info-item");
  const statusNameDom = document.createElement("p");
  statusNameDom.classList.add("info-item-name");
  statusNameDom.textContent = "Status:"
  const statusValueDom = document.createElement("p");
  statusValueDom.textContent = status;
  statusDom.appendChild(statusNameDom);
  statusDom.appendChild(statusValueDom);

  const runtimeDom = document.createElement("div");
  runtimeDom.classList.add("show-info-item");
  const runtimeNameDom = document.createElement("p");
  runtimeNameDom.classList.add("info-item-name");
  runtimeNameDom.textContent = "Runtime:"
  const runtimeValueDom = document.createElement("p");
  runtimeValueDom.textContent = runtime;
  runtimeDom.appendChild(runtimeNameDom);
  runtimeDom.appendChild(runtimeValueDom);

  infoDom.appendChild(ratingDom);
  infoDom.appendChild(genresDom);
  infoDom.appendChild(statusDom);
  infoDom.appendChild(runtimeDom);

  cardDom.appendChild(nameDom);
  contentDom.appendChild(imageDom);
  contentDom.appendChild(summaryDom);
  contentDom.appendChild(infoDom);

  cardDom.appendChild(contentDom);
  parentDom.appendChild(cardDom);
}

function makeEpisodeCard(episode, parentDom) {
  const name = episode.name;
  const season = episode.season;
  const number = episode.number;
  const medImageUrl = episode.image.medium;
  const summary = episode.summary;
  const episodeCode =
    "S" +
    String(season).padStart(2, "0") +
    "E" +
    String(number).padStart(2, "0"); //suggestion: I added "padStar(2, "0") for season element of episodeCode.

  const cardDom = document.createElement("div");
  cardDom.classList.add("episode-card");
  const nameDom = document.createElement("h2");
  nameDom.textContent = name + " - " + episodeCode;
  const imageDom = document.createElement("img");
  imageDom.src = medImageUrl;
  const summaryDom = document.createElement("p");
  // original summary contained "<p>" at start and "</p>" at the end
  summaryDom.innerHTML = summary;
  cardDom.appendChild(nameDom);
  cardDom.appendChild(imageDom);
  cardDom.appendChild(summaryDom);
  parentDom.appendChild(cardDom);
}

// change dom for number of selected episodes
function countEpisodes(countAllEpisodes, countFilteredEpisodes) {
  const countElements = document.getElementById("count-area");
  if (countElements) {
    countElements.textContent = `Displaying  ${countFilteredEpisodes} / ${countAllEpisodes} episodes`;
  }
}

// start of page rendering
async function setup() {
  state.allShows = await getAllShows();
  createSearchBar();
  organiseShowInput();
  oganiseShowListingSelect(state.allShows);
  rootElem.innerHTML = "";
  makePageForShows(state.allShows);
}

window.onload = setup;
