//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  for (const episode of episodeList) {
    makeEpisodeCard(episode, rootElem);
  }
}

function makeEpisodeCard(episode, rootElem) {
  const name = episode.name;
  const season = episode.season;
  const number = episode.number;
  const medImageUrl = episode.image.medium;
  const summary = episode.summary;
  const episodeCode = "S" + String(season) + "E" + String(number).padStart(2, "0");

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

window.onload = setup;
