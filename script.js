//You can edit ALL of the code here
// Created one place to hold data

let allShows = [];
let allEpisodes = [];
let cachedEpisodes = {};

const state = {
  allShows,
  allEpisodes,
  searchTerm: "",
};

const rootElem = document.getElementById("root");
async function setup() {
  allShows = await getAllShows("https://api.tvmaze.com/shows");
  //allEpisodes = await getAllEpisodes("https://api.tvmaze.com/shows/82/episodes");
  //makePageForEpisodes(allEpisodes);
  //makePageForEpisodes(allEpisodes);
  state.allShows = allShows;
  createShowOptions(state.allShows);
}

async function getAllShows(url) {
  let shows = [];
  try {
    const response = await fetch(url);
    const data = await response.json();
    shows = Array.from(data);
    return shows;
  } catch (error) {
    console.log(error);
  }
}

// async function getEpisodes() {
//   let episodes = [];
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     episodes = Array.from(data);
//     return episodes;
//   } catch (error) {
//     console.log(error);
//   }
// }

function makePageForEpisodes(episodes) {
  for (const episode of episodes) {
    makeEpisodeCard(episode, rootElem);
  }
  createEpisodeOptions(episodes);
}

function makeEpisodeCard(episode) {
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
  cardDom.classList.add("card");
  const nameDom = document.createElement("h2");
  nameDom.textContent = name + " - " + episodeCode;
  const imageDom = document.createElement("img");
  imageDom.src = medImageUrl;
  const summaryDom = document.createElement("p");
  // original summary contained "<p>" at start and "</p>" at the end
  summaryDom.textContent = summary.substring(3, summary.length - 4);
  cardDom.appendChild(nameDom);
  cardDom.appendChild(imageDom);
  cardDom.appendChild(summaryDom);
  rootElem.appendChild(cardDom);
}

// Created a place for the search bar
const navBar = document.createElement("nav");
document.body.insertBefore(navBar, document.body.firstChild);

const selectorBlock = document.createElement("div");
selectorBlock.classList.add("select");
navBar.appendChild(selectorBlock);

const showSelector = document.createElement("select");
showSelector.setAttribute("id", "select_show");
showSelector.setAttribute("name", "select_show");
showSelector.setAttribute("placeholder", "Chose show");

const defaultShowOption = document.createElement("option");
defaultShowOption.value = "all";
defaultShowOption.textContent = "All shows";
defaultShowOption.value = "All shows";
showSelector.appendChild(defaultShowOption);
selectorBlock.appendChild(showSelector);

const episodeSelector = document.createElement("select");
episodeSelector.setAttribute("id", "select_episode");
episodeSelector.setAttribute("name", "select_episode");
episodeSelector.setAttribute("placeholder", "Chose episode");

const defaultOption = document.createElement("option");
defaultOption.value = "all";
defaultOption.textContent = "All episodes";
defaultOption.value = "All episodes";
episodeSelector.appendChild(defaultOption);
selectorBlock.appendChild(episodeSelector);

function createShowOptions(shows) {
  shows.forEach((show) => {
    const optionText = show.name;
    const option = document.createElement("option");
    option.value = optionText;
    option.textContent = optionText;
    showSelector.appendChild(option);
  });
}

function createEpisodeOptions(episodes) {
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

showSelector.addEventListener("change", async () => {
  let selectShowName = showSelector.value.toLowerCase().trim();
  if (selectShowName === "all shows") {
    rootElem.innerHTML = "";
    makePageForEpisodes(state.allEpisodes);
  }
  const selectedShow = state.allShows.find(
    (show) => show.name.toLowerCase() === selectShowName
  );
  if (cachedEpisodes[selectedShow.id]) {
    state.allEpisodes = cachedEpisodes[selectedShow.id];
  } else {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${selectedShow.id}/episodes`
    );
    const data = await response.json();
    cachedEpisodes[selectedShow.id] = data;
    state.allEpisodes = cachedEpisodes[selectedShow.id];
  }
  countEpisodes(state.allEpisodes.length, state.allEpisodes.length);
  rootElem.innerHTML = "";
  makePageForEpisodes(state.allEpisodes);
});

episodeSelector.addEventListener("change", () => {
  let selectEpisodeName = episodeSelector.value.substring(
    episodeSelector.value.indexOf("- ") + 2
  );
  let selectedEpisodes = [];

  if (episodeSelector.value === "All episodes") {
    makePageForEpisodes(state.allEpisodes);
  } else {
    for (episode of state.allEpisodes) {
      if (episode.name == selectEpisodeName) {
        selectedEpisodes.push(episode);
      }
    }
    countEpisodes(state.allEpisodes.length, selectedEpisodes.length);
    rootElem.innerHTML = "";
    makeEpisodeCard(selectedEpisodes[0]);
  }
});

const input = document.createElement("input");
input.setAttribute("id", "input");
input.setAttribute("placeholder", "Please insert your text");
input.setAttribute("type", "search");
navBar.appendChild(input);

input.addEventListener("input", () => {
  let searchTerm = input.value;
  // Update the page to be empty before filteredEpisodes append
  rootElem.innerHTML = "";
  let searchMatch = [];
  for (const episode of state.allEpisodes) {
    if (
      episode.name.includes(searchTerm) ||
      episode.summary.includes(searchTerm)
    ) {
      searchMatch.push(episode);
    }
  }
  makePageForEpisodes(searchMatch);
  countEpisodes(state.allEpisodes.length, searchMatch.length);
});

const countArea = document.createElement("p");
countArea.id = "count-area";
navBar.appendChild(countArea);

function countEpisodes(countAllEpisodes, countFilteredEpisodes) {
  const countElements = document.getElementById("count-area");
  if (countElements) {
    countElements.textContent = `Displaying  ${countFilteredEpisodes} / ${countAllEpisodes} episodes`;
  }
}

window.onload = setup;
