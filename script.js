//You can edit ALL of the code here
function setup() {
  //const allEpisodes = getAllEpisodes();
  makePageForEpisodes(state.allEpisodes);
}

function makePageForEpisodes() {
  const rootElem = document.getElementById("root");
  const filteredEpisodes = state.allEpisodes.filter((episode) => {
    return (
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  });
  countEpisodes(allEpisodes.length, filteredEpisodes.length);
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  for (const episode of filteredEpisodes) {
    makeEpisodeCard(episode, rootElem);
  }
}

function makeEpisodeCard(episode, rootElem) {
  const name = episode.name;
  const season = episode.season;
  const number = episode.number;
  const medImageUrl = episode.image.medium;
  const summary = episode.summary;
  const episodeCode =
    "S" + String(season) + "E" + String(number).padStart(2, "0");

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

const countArea = document.createElement("p");
countArea.id = "count-area";
navBar.appendChild(countArea);

function countEpisodes(countAllEpisodes, countFilteredEpisodes) {
  const countElements = document.getElementById("count-area");
  if (countElements) {
    countElements.textContent = `Displaying  ${countFilteredEpisodes} / ${countAllEpisodes} episodes`;
  }
}

const input = document.createElement("input");
input.setAttribute("id", "input");
input.setAttribute("placeholder", "Please insert your text");
input.setAttribute("type", "search");
navBar.appendChild(input);

const allEpisodes = getAllEpisodes();

// Created one place to hold data
const state = {
  allEpisodes,
  searchTerm: "",
};

input.addEventListener("input", () => {
  state.searchTerm = input.value;
  // Update the page to be empty before filteredEpisodes append
  document.getElementById("root").innerHTML = "";
  makePageForEpisodes();
});

window.onload = setup;
