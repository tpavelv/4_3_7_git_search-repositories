const input = document.querySelector(".search__search-input");
const dropdown = document.querySelector(".search__dropdown");
const cardsList = document.querySelector(".search__cards-list");
let db;

input.addEventListener(
  "input",
  debounce(async () => {
    const value = input.value.trim();
    if (value) {
      try {
        const repositories = await getRepos(value);
        db = repositories;

        dropdown.innerHTML = "";

        repositories.forEach((el) => {
          let newItem = createMenuItem(el);
          dropdown.append(newItem);
        });
      } catch (error) {
        console.log(`Возникла ошибка при запросе данных `, error.name);
      }
    } else {
      dropdown.innerHTML = "";
    }
  }, 400)
);

dropdown.addEventListener("click", (e) => {
  db.forEach((el) => {
    if (el.id === Number(e.target.dataset.id)) {
      let newCard = createCard(el);
      cardsList.append(newCard);
    }
    input.value = null;
  });
  dropdown.innerHTML = "";
  db = null;
});

cardsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    e.target.closest("li").remove();
  }
});

async function getRepos(name) {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${name}&per_page=5`
  );
  if (response.ok) {
    const data = await response.json();
    const repos = data.items;
    return repos;
  } else {
    alert("При запросе данных произошла ошибка" + response.status);
  }
}
function debounce(fn, debounceTime) {
  let timer;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arg);
    }, debounceTime);
  };
}

function createMenuItem(searchObj) {
  const fragment = document.createDocumentFragment();
  const item = document.createElement("li");
  item.classList.add("search__item");
  item.textContent = searchObj.name;
  item.setAttribute("data-id", searchObj.id);

  fragment.append(item);
  return fragment;
}

function createCard(searchObj) {
  const fragment = document.createDocumentFragment();
  const card = document.createElement("li");
  card.classList.add("search__addCard");
  const name = document.createElement("p");
  name.textContent = `Name: ${searchObj.name}`;
  const owner = document.createElement("p");
  owner.textContent = `Owner: ${searchObj.owner.login}`;
  const stars = document.createElement("p");
  stars.textContent = `Stars: ${searchObj.stargazers_count}`;
  // const deleteBtn = document.createElement("span");
  const deleteBtn = document.createElement("buton");
  deleteBtn.classList.add("btn-delete");

  card.append(name, owner, stars, deleteBtn);
  fragment.append(card);
  return fragment;
}
