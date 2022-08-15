const searchContainer = document.querySelector(".container__input");
const searchInput = document.querySelector(".container__search");
const searchResults = document.querySelector(".container__auto");
const repList = document.querySelector(".container__reps-list");

const debouncedSearchReps = debounce(searchReps, 250);

searchInput.addEventListener("keyup", debouncedSearchReps);

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

async function searchReps() {
  let userData = searchInput.value;
  if (!userData) {
    searchResults.classList.remove("active");
    return;
  }
  return await fetch(
    `https://api.github.com/search/repositories?q=${searchInput.value}`
  ).then((result) => {
    if (result.ok) {
      result.json().then((result) => {
        processSearchResult(result.items);
      });
    }
  });
}

function processSearchResult(items) {
  if (!items || items.length == 0) {
    searchResults.classList.remove("active");
    return;
  }
  let userData = searchInput.value;
  if (!userData) {
    searchResults.classList.remove("active");
    return;
  }
  let filtredItems = items.filter((item) => {
    return item.name.toLowerCase().startsWith(userData.toLowerCase());
  });
  filtredItems = filtredItems.slice(0, 5);
  let listNames = "";
  filtredItems.forEach((item) => {
    listNames += "<li>" + item.name + "</li>";
  });
  searchResults.innerHTML = listNames;
  let list = searchResults.querySelectorAll("li");
  for (let i = 0; i < list.length; i++) {
    list[i].classList.add("container__search-item");
    list[i].repo = filtredItems[i];
  }
  searchResults.classList.add("active");
}

function showSearchRes(list) {
  let searchList;
  if (list.length) {
    searchList = list.join("");
  } else {
    return;
  }
  searchResults.innerHTML = searchList;
}

function createRep(repItem) {
  const rep = createElement("li", "rep-item");
  rep.innerHTML = `<div class="rep-container"><div class="rep-container__info">
                     <span>Name: ${repItem.name}</span><br>
                     <span>Owner: ${repItem.owner.login}</span><br>
                     <span>Stars: ${repItem.stargazers_count}</span>
                     </div>
                     <div class="rep-container__delete-button">
                     <button class="rep-container__delete close"></button>
                     </div></div>`;
  console.log(repItem);
  repList.append(rep);
}

function createElement(elementTag, elementClass) {
  const element = document.createElement(elementTag);
  if (elementClass) {
    element.classList.add(elementClass);
  }
  return element;
}

searchResults.addEventListener("click", (e) => {
  createRep(e.target.repo);
  searchInput.value = "";
  searchResults.classList.remove("active");
});

repList.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() !== "button") {
    return;
  }
  let parentOfButton = e.target.parentElement.parentElement.parentElement;
  parentOfButton.classList.add("hidden");
});
