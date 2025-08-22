async function loadData() {
  const response = await fetch("data.json");
  return await response.json();
}

function renderMenu(pages) {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  pages.forEach((page) => {
    const link = document.createElement("a");
    link.href = `#${page.id}`;
    link.textContent = page.title;
    menu.appendChild(link);
  });
}

function renderPage(data, id) {
  const pages = data.pages;
  const page = pages.find((p) => p.id === id) || pages[0];

  const content = document.getElementById("content");

  if (id === "recipes") {
    content.innerHTML = `
    <div class="content-header">
    <h2>My Recipes</h2>
    <input type="text" id="search" placeholder="Search recipes..."/>
    </div>
    <div class="recipes-container"></div>
    `;

    const container = content.querySelector(".recipes-container");

    function renderRecipes(recipes) {
      container.innerHTML = "";

      if (recipes.length === 0) {
        container.innerHTML = `<p class="no-results">No recipes found.Try another search!</p>`;
        return;
      }

      recipes.forEach((recipe, index) => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        card.innerHTML = `
        <h3>${recipe.title}</h3>
        <img src="${recipe.image}" alt="${recipe.title}"/>
        <button data-index ="${index}">View Description</button>
        `;
        container.appendChild(card);
      });

      // Modal functionality
      container.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = btn.dataset.index;
          const recipe = recipes[idx];
          document.getElementById("modal-title").textContent = recipe.title;
          document.getElementById("modal-desc").innerHTML = `
          <p>${recipe.description}</p>
          <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
          <h4>Preparation:</h4>
          <p>${recipe.preparation}</p>
          `;

          document.getElementById("modal").style.display = "flex";
        });
      });
    }

    renderRecipes(data.recipes);

    //  Search filter
    document.getElementById("search").addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = data.recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.ingredients.some((i) => i.toLowerCase().includes(term))
      );
      renderRecipes(filtered);
    });

    // modal close

    document.querySelector(".close-btn").addEventListener("click", () => {
      document.getElementById("modal").style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target.id === "modal")
        document.getElementById("modal").style.display = "none";
    });
  } else {
    content.innerHTML = page.content;
  }
}

async function init() {
  const data = await loadData();
  renderMenu(data.pages);

  function updatePage() {
    const id = window.location.hash.substring(1) || "home";
    renderPage(data, id);
  }

  window.addEventListener("hashchange", updatePage);
  updatePage();
}
init();
