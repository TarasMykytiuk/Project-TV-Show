//You can edit ALL of the code here
// Created one place to hold data

let allShows = [];
let allEpisodes = [];

const state = {
  allShows,
  allEpisodes,
  searchTerm: "",
};

const rootElem = document.getElementById("root");
async function setup() {
  state.allShows = await getAllShows();

  createShowOptions(state.allShows);

  const firstShowId = state.allShows[0].id;
  showSelector.value = firstShowId;

  const episodes = await getEpisodesByShowId(firstShowId);
  state.allEpisodes = episodes;

  episodeSelector.innerHTML = "";
  createEpisodeOptions(state.allEpisodes);

  rootElem.innerHTML = "";
  makePageForEpisodes(state.allEpisodes);
  countEpisodes(state.allEpisodes.length, state.allEpisodes.length);
}

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

function makePageForEpisodes(episodes) {
  rootElem.innerHTML = "";
  for (const episode of episodes) {
    makeEpisodeCard(episode, rootElem);
  }
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
  summaryDom.innerHTML = summary;
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
selectorBlock.appendChild(showSelector);

const episodeSelector = document.createElement("select");
episodeSelector.setAttribute("id", "select_episode");
episodeSelector.setAttribute("name", "select_episode");
episodeSelector.setAttribute("placeholder", "Chose episode");
selectorBlock.appendChild(episodeSelector);

function createShowOptions(shows) {
  const sortedShows = shows.slice();
  sortedShows.sort((a, b) => {
    const A = a.name.toLowerCase();
    const B = b.name.toLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
  showSelector.innerHTML = "";
  sortedShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
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

showSelector.addEventListener("change", async () => {
  let selectedShowId = Number(showSelector.value);
  if (isNaN(selectedShowId)) {
    rootElem.innerHTML = "";
    episodeSelector.innerHTML = "";
    countEpisodes(0, 0);
    return;
  }

  const episodes = await getEpisodesByShowId(selectedShowId);
  state.allEpisodes = episodes;

  episodeSelector.innerHTML = "";
  createEpisodeOptions(state.allEpisodes);

  rootElem.innerHTML = "";
  makePageForEpisodes(state.allEpisodes);
  countEpisodes(state.allEpisodes.length, state.allEpisodes.length);
});

episodeSelector.addEventListener("change", async () => {
  const selectedEpisode = episodeSelector.value;
  //const rootElem = document.getElementById("root");
  if (selectedEpisode === "all") {
    makePageForEpisodes(state.allEpisodes);
    countEpisodes(state.allEpisodes.length, state.allEpisodes.length);
    return;
  } else {
    const filteredEpisodes = state.allEpisodes.filter((episode) => {
      const episodeCode =
        "S" +
        String(episode.season).padStart(2, "0") +
        "E" +
        String(episode.number).padStart(2, "0");
      return `${episodeCode} - ${episode.name}` === selectedEpisode;
    });
    makePageForEpisodes(filteredEpisodes);
    countEpisodes(state.allEpisodes.length, filteredEpisodes.length);
  }
});

const input = document.createElement("input");
input.setAttribute("id", "input");
input.setAttribute("placeholder", "Please insert your text");
input.setAttribute("type", "search");
selectorBlock.appendChild(input);

input.addEventListener("input", () => {
  let searchTerm = input.value.toLowerCase();
  // Update the page to be empty before filteredEpisodes append
  rootElem.innerHTML = "";
  const searchMatch = state.allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );
  makePageForEpisodes(searchMatch);
  countEpisodes(state.allEpisodes.length, searchMatch.length);
});

const countArea = document.createElement("p");
countArea.id = "count-area";
selectorBlock.appendChild(countArea);

function countEpisodes(countAllEpisodes, countFilteredEpisodes) {
  const countElements = document.getElementById("count-area");
  if (countElements) {
    countElements.textContent = `Displaying  ${countFilteredEpisodes} / ${countAllEpisodes} episodes`;
  }
}

window.onload = setup;
