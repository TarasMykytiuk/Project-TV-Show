//You can edit ALL of the code here
let allEpisodes = [];
const rootElem = document.getElementById("root");
async function setup() {
  allEpisodes = await getAllEpisodes("https://api.tvmaze.com/shows/82/episodes");
  makePageForEpisodes(allEpisodes);
}

async function getAllEpisodes(url) {
  let episodes = [];
  try {
    const response = await fetch(url);
    const data = await response.json();
    episodes = Array.from(data);
    return episodes;
  } catch (error) {
    console.log(error);
  }
}

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

const episodeSelector = document.createElement("select");
episodeSelector.setAttribute("id", "selector");
episodeSelector.setAttribute("name", "selector");
episodeSelector.setAttribute("placeholder", "Chose episode");

const defaultOption = document.createElement("option");
defaultOption.value = "all";
defaultOption.textContent = "All episodes";
defaultOption.value = "All episodes";
episodeSelector.appendChild(defaultOption);
navBar.appendChild(episodeSelector);

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

episodeSelector.addEventListener("change", () => {
  let selectEpisodeName = episodeSelector.value.substring(
    episodeSelector.value.indexOf("- ") + 2
  );
  let selectedEpisodes = [];

  if (episodeSelector.value === "All episodes") {
    makePageForEpisodes(allEpisodes);
  } else {
    for (episode of allEpisodes) {
      if (episode.name == selectEpisodeName) {
        selectedEpisodes.push(episode);
      }
    }
    countEpisodes(allEpisodes.length, selectedEpisodes.length);
    rootElem.innerHTML = "";
    makeEpisodeCard(selectedEpisodes[0]);
  }
});

const input = document.createElement("input");
input.setAttribute("id", "input");
input.setAttribute("placeholder", "Please insert your text");
input.setAttribute("type", "search");
navBar.appendChild(input);

// Created one place to hold data
const state = {
  allEpisodes,
  searchTerm: "",
};

input.addEventListener("input", () => {
  let searchTerm = input.value;
  // Update the page to be empty before filteredEpisodes append
  rootElem.innerHTML = "";
  let searchMatch = [];
  for (const episode of allEpisodes) {
    if (episode.name.includes(searchTerm) || episode.summary.includes(searchTerm)) {
      searchMatch.push(episode);
    }
  }
  makePageForEpisodes(searchMatch);
  countEpisodes(allEpisodes.length, searchMatch.length);
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
