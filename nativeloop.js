let countId1 = 0;
let countId2 = 0;
let countId3 = 0;
let countCrossClick = 0;
let spanValueId = [];
let spanIngredientName = [];
let queryTagContain;
let childTagContainer;
let ingredientRecipes = [];
let spanIngredientRecipes = [];
let spanApplianceRecipes = [];
let spanAppliance = [];
let spanUstensileRecipes = [];
let ustensileRecipes = [];
let searchBarContainer = document.querySelector(".search_bar_container");
let noResultMsg = document.querySelector(".no_result_msg");
const searchContainer = document.querySelectorAll(
  ".search_container--ingredients"
);
const ingredient = document.querySelector(".search_ingredient");
let searchBarResult = [];
let searchResultCopy = [];
let newName = [];
let newDescription = [];
let newIngredient = [];
function dishesFactory(data) {
  const { name, servings, ingredients, id, time, description } = data;
  // Affiche chaque plats dans la page d'index
  function getAllDishes() {
    const article = document.createElement("article");
    article.setAttribute("class", "dishes_container");
    const img = document.createElement("div");
    img.setAttribute("class", "dishes_img");
    const title = document.createElement("span");
    title.setAttribute("class", "dishes_title");
    title.innerText = name;
    const dishesIngredients = document.createElement("div");
    dishesIngredients.setAttribute("class", "dishes_ingredients");
    ingredients.forEach((item) => {
      const items = document.createElement("div");
      items.setAttribute("class", "ingredients_items");
      const itemBold = document.createElement("span");
      itemBold.setAttribute("class", "bold");
      itemBold.innerText = item.ingredient;
      const itemSpan = document.createElement("span");
      if (item.unit) {
        itemSpan.innerText = " " + item.quantity + item.unit;
      } else if (!item.quantity && !item.unit) {
        itemSpan.innerText = " ";
      } else {
        itemSpan.innerText = " " + item.quantity;
      }
      items.appendChild(itemBold);
      items.appendChild(itemSpan);
      dishesIngredients.appendChild(items);
      article.appendChild(dishesIngredients);
    });
    const disheDescription = document.createElement("div");
    disheDescription.setAttribute("class", "dishes_description");
    disheDescription.innerText = description;
    const timer = document.createElement("div");
    timer.setAttribute("class", "dishes_time");
    const timeIcon = document.createElement("i");
    timeIcon.setAttribute("class", "fa-regular fa-clock");
    const spanTime = document.createElement("span");
    spanTime.innerText = " " + time + " " + "min";
    spanTime.setAttribute("class", "bold");
    timer.appendChild(timeIcon);
    timer.appendChild(spanTime);
    article.appendChild(img);
    article.appendChild(title);
    article.appendChild(timer);
    article.appendChild(disheDescription);
    return article;
  }
  return {
    name,
    servings,
    name,
    ingredients,
    id,
    time,
    description,
    getAllDishes,
  };
}
const ingredientArray = [];
const applianceArray = [];
const ustentilesArray = [];
const ingredientSearch = document.querySelector(".search_ingredient");
const applianceSearch = document.querySelector(".search_appareil");
const ustensileSearch = document.querySelector(".search_ustenstile");
const dishesSection = document.querySelector(".dishes_section");
let searchIngredient = document.querySelector(".search_ingredient");
let searchAppliance = document.querySelector(".search_appareil");
let searchContainerAppliance = document.querySelectorAll(
  ".search_container--appareils"
);
let dropdownAppliance;
//Affiche les plats en fonction d'objet entré en parametre
async function displayData(recipes) {
  recipes.forEach((recipe) => {
    const factory = dishesFactory(recipe);
    const displayDishes = factory.getAllDishes();
    dishesSection.appendChild(displayDishes);
    recipe.ingredients.forEach((item) => {
      ingredientArray.push(item.ingredient);
    });
    recipe.ustensils.forEach((item) => {
      ustentilesArray.push(item);
    });
    applianceArray.push(recipe.appliance);
  });
}
async function init() {
  // Récupère les datas des photographes
  let { recipes } = await getRecipes();
  displayData(recipes);
}
//Affiche tous les plats disponible
init();
//Ouvre le dropdown du tag ingredient
ingredientSearch.addEventListener("click", (e) => {
  if (searchContainer[0]) {
    searchContainer[0].setAttribute(
      "class",
      "search_dropdown_container--ingredients"
    );
    searchContainer[0].children[1].setAttribute(
      "class",
      "fa-solid fa-angle-up"
    );
  }
  searchIngredient.setAttribute("class", "search_dropdown");
  searchIngredient.removeAttribute("value");
  searchIngredient.setAttribute("placeholder", "Ingredients");
  let allIngredient = document.createElement("div");

  allIngredient.setAttribute("class", "all_ingredients");
  const dropdownContainer = document.querySelector(
    ".search_dropdown_container--ingredients"
  );

  searchIngredient.style.width = "32rem";
  dropdownContainer.style.width = "32rem";

  // Redimensionne la taille du dropdown en fonction du nombre d'ingredient disponible a l'intérieur
  if (searchBarContainer.children.length >= 4) {
    ingredientSearch.addEventListener("click", (event) => {
      if (ingredientRecipes.length > 10 && event.target === ingredient) {
        dropdownContainer.style.width = "32rem";
        allIngredient.style.display = "grid";
        allIngredient.style.textAlign = "center";
      } else if (
        ingredientRecipes.length <= 10 &&
        document.querySelector(".tag_container")
      ) {
        allIngredient.style.display = "flex";
        allIngredient.style.flexDirection = "column";
        allIngredient.style.textAlign = "center";
        dropdownContainer.style.width = "9rem";
      }
    });

    if (childTagContainer.length === 0 && searchBar.value.length < 3) {
      const itemIngredient = allIngredient.children.length;
      for (let i = 0; i < itemIngredient; i++) {
        const element = allIngredient.firstChild;
        element.remove();
      }
      const filteredingredientArray = ingredientArray.filter(function (
        ele,
        pos
      ) {
        return ingredientArray.indexOf(ele) == pos;
      });
      filteredingredientArray.forEach((element) => {
        const Span = document.createElement("span");
        Span.innerText = element;
        allIngredient.appendChild(Span);
      });
      dropdownContainer.style.width = "32rem";
      allIngredient.style.display = "grid";
      allIngredient.style.textAlign = "center";
    } else if (
      childTagContainer.length === 0 &&
      searchBar.value.length >= 3 &&
      dishesSection.children.length > 1
    ) {
      displaySearchBarResult();
    } else {
      resultCombined();
    }
  }
  const queryAllIgredients = document.querySelectorAll(".all_ingredients");
  //Place les ingredients dans le dropdown

  dropdownContainer.appendChild(allIngredient);
  //Active le systeme de recherche pour le tag ingredient
  searchIngredient.addEventListener("keyup", (e) => {
    const currentValue = e.target.value;

    //Réinitialise la liste d'ingredients dans le dropdown
    if (
      currentValue.length === 0 &&
      allIngredient.children.length != filteredingredientArray.length &&
      searchBarContainer.children.length < 4 &&
      dishesSection.children.length === recipes.length
    ) {
      dropdownContainer.style.width = "32rem";
      allIngredient.style.display = "grid";
      allIngredient.style.textAlign = "center";
      const itemIngredient = allIngredient.children.length;
      for (let i = 0; i < itemIngredient; i++) {
        const element = allIngredient.firstChild;
        element.remove();
      }
      filteredingredientArray.forEach((element) => {
        const tagIngredientContainer = document.createElement("div");
        tagIngredientContainer.setAttribute("class", "tag_container");
        const Span = document.createElement("span");
        Span.innerText = element;
        allIngredient.appendChild(Span);
        Span.addEventListener("mouseup", () => {
          const searchBar = document.querySelector(".search_bar_container");
          const newFilter = document.createElement("div");
          newFilter.setAttribute("class", "item_ingredients");
          newFilter.setAttribute("id", 1);
          const spanFilter = document.createElement("span");
          spanFilter.innerText = Span.innerHTML;
          const iconFilter = document.createElement("icon");
          iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
          newFilter.appendChild(spanFilter);
          newFilter.appendChild(iconFilter);
          tagIngredientContainer.appendChild(newFilter);
          searchBar.appendChild(tagIngredientContainer);
          const queryTagContainer = document.querySelector(".tag_container");
          if (!queryTagContainer) {
            Span.addEventListener("click", () => {
              const queryTagContainer =
                document.querySelector(".tag_container");
              childTagContainer = queryTagContainer.children;
              resultCombined();
              closeDropdownIngredient();
            });
          } else {
            Span.addEventListener("click", () => {
              queryTagContain = document.querySelector(".tag_container");
              childTagContainer = queryTagContainer.children;
              queryTagContain.appendChild(newFilter);
              resultCombined();
              closeDropdownIngredient();
            });
          }
        });
      });
    }
    // Redimensionne la taille du dropdown en fonction du nombre d'ingredient disponible a l'intérieur
    if (currentValue.length >= 3) {
      dropdownContainer.style.width = "9rem";
      allIngredient.style.display = "flex";
      allIngredient.style.flexDirection = "column";
      allIngredient.style.textAlign = "center";
      const itemIngredient = allIngredient.children.length;

      for (let i = 0; i < itemIngredient; i++) {
        const element = allIngredient.firstChild;
        element.remove();
      }
      filteredDropdownArray = filteredingredientArray.filter((element) =>
        element
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(currentValue.toLowerCase())
      );
      //Affiche les tags ingredients sous la barre de recherche ainsi que les ingredients dans le dropdown (En tapant notre recherche dans l'input)
      filteredDropdownArray.forEach((element) => {
        const tagIngredientContainer = document.createElement("div");
        tagIngredientContainer.setAttribute("class", "tag_container");
        const Span = document.createElement("span");
        Span.innerText = element;
        allIngredient.appendChild(Span);
        Span.addEventListener("mouseup", () => {
          const searchBar = document.querySelector(".search_bar_container");
          const newFilter = document.createElement("div");
          newFilter.setAttribute("class", "item_ingredients");
          newFilter.setAttribute("id", 1);
          const spanFilter = document.createElement("span");
          spanFilter.innerText = Span.innerHTML;
          const iconFilter = document.createElement("icon");
          iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
          newFilter.appendChild(spanFilter);
          newFilter.appendChild(iconFilter);
          tagIngredientContainer.appendChild(newFilter);
          searchBar.appendChild(tagIngredientContainer);
          const queryTagContainer = document.querySelector(".tag_container");
          if (!queryTagContainer) {
            Span.addEventListener("click", () => {
              const queryTagContainer =
                document.querySelector(".tag_container");
              childTagContainer = queryTagContainer.children;
              resultCombined();
              closeDropdownIngredient();
            });
          } else {
            Span.addEventListener("click", () => {
              queryTagContain = document.querySelector(".tag_container");
              childTagContainer = queryTagContainer.children;
              queryTagContain.appendChild(newFilter);
              resultCombined();
              closeDropdownIngredient();
            });
          }
        });
      });
    }
  });
  //Affiche les tags ingredients sous la barre de recherche ainsi que les ingredients dans le dropdown (Lors du premier clic initial sur la partie ingredient)
  const filteredingredientArray = ingredientArray.filter(function (ele, pos) {
    return ingredientArray.indexOf(ele) == pos;
  });
  filteredingredientArray.forEach((element) => {
    const Span = document.createElement("span");
    Span.innerText = element;
    allIngredient.appendChild(Span);
  });
  const spanIngredients = [];
  const itemIngredient = allIngredient.children.length;
  for (let i = 0; i < itemIngredient; i++) {
    const element = allIngredient.children[i];
    spanIngredients.push(element);
  }
  spanIngredients.forEach((item) => {
    item.addEventListener("mouseup", () => {
      const searchBar = document.querySelector(".search_bar_container");
      const newFilter = document.createElement("div");
      newFilter.setAttribute("class", "item_ingredients");
      newFilter.setAttribute("id", 1);
      const spanFilter = document.createElement("span");
      spanFilter.innerText = item.innerHTML;
      const iconFilter = document.createElement("icon");
      iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
      newFilter.appendChild(spanFilter);
      newFilter.appendChild(iconFilter);
      const queryTagContainer = document.querySelector(".tag_container");
      if (!queryTagContainer) {
        const tagIngredientContainer = document.createElement("div");
        tagIngredientContainer.setAttribute("class", "tag_container");
        tagIngredientContainer.appendChild(newFilter);
        searchBar.appendChild(tagIngredientContainer);
        item.addEventListener("click", () => {
          const queryTagContainer = document.querySelector(".tag_container");
          childTagContainer = queryTagContainer.children;
          resultCombined();
        });
      } else {
        item.addEventListener("click", () => {
          queryTagContain = document.querySelector(".tag_container");
          childTagContainer = queryTagContainer.children;
          queryTagContain.appendChild(newFilter);
          resultCombined();
        });
      }
    });
  });
  //Ferme le dropdown lors du click en dehors de l'élément
  window.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".search_dropdown");
    const all_ingredients = document.querySelector(".all_ingredients");
    if (e.target === dropdown || e.target === all_ingredients) {
    } else if (!all_ingredients) {
    } else {
      closeDropdownIngredient();
      function closeDropdownIngredient() {
        const all_ingredients = document.querySelector(".all_ingredients");
        dropdownContainer.style.width = "9rem";
        searchIngredient.style.width = "9rem";
        searchContainer[0].setAttribute(
          "class",
          "search_container--ingredients"
        );
        searchIngredient.setAttribute("class", "search_ingredient");
        searchIngredient.value = "Ingredients";
        searchIngredient.addEventListener("click", () => {
          searchIngredient.value = "";
        });
        all_ingredients.remove();
        searchContainer[0].children[1].setAttribute(
          "class",
          "fa-solid fa-angle-down"
        );
      }
    }
  });
});

let filteredRecipesArray = [];
//Ouvre le dropdown du tag appareil
applianceSearch.addEventListener("click", () => {
  var allAppliance = document.createElement("div");
  allAppliance.setAttribute("class", "all_appliances");

  searchAppliance.setAttribute(
    "class",
    "search_dropdown search_dropdown--appareils"
  );

  searchContainerAppliance[0].setAttribute(
    "class",
    "search_dropdown_container--appareils"
  );
  searchContainerAppliance[0].children[1].setAttribute(
    "class",
    "fa-solid fa-angle-up"
  );
  searchAppliance.removeAttribute("value");
  searchAppliance.setAttribute("placeholder", "Appareil");

  const dropdownContain = document.querySelector(
    ".search_dropdown_container--appareils"
  );
  dropdownContain.style.width = "32rem";
  // Redimensionne la taille du dropdown en fonction du nombre d'appareils disponible a l'intérieur
  let searchBarContainer = document.querySelector(".search_bar_container");
  if (searchBarContainer.children.length >= 4) {
    window.addEventListener("click", () => {
      if (spanApplianceRecipes.length <= 10) {
        dropdownContain.style.width = "9rem";
        allAppliance.style.display = "flex";
        allAppliance.style.flexDirection = "column";
        allAppliance.style.textAlign = "center";
      } else {
        dropdownContain.style.width = "32rem";
        allAppliance.style.display = "grid";
        allAppliance.style.textAlign = "center";
      }
    });
    if (childTagContainer.length === 0 && searchBar.value.length < 3) {
      init();
      dropdownContain.style.width = "32rem";
      allAppliance.style.display = "grid";
      allAppliance.style.textAlign = "center";
    } else if (
      childTagContainer.length === 0 &&
      searchBar.value.length >= 3 &&
      dishesSection.children.length > 1
    ) {
      displaySearchBarResult();
    } else {
      resultCombined();
    }
  }
  //Place les appareils dans le dropdown
  dropdownContain.appendChild(allAppliance);
  const filteredApplianceArray = applianceArray.filter(function (ele, pos) {
    return applianceArray.indexOf(ele) == pos;
  });
  //Active le systeme de recherche pour le tag appareil
  let dropdownAppliance = document.querySelector(".search_dropdown--appareils");
  dropdownAppliance.addEventListener("keyup", async (e) => {
    let currentValue = e.target.value;
    const searBarApplianceContainer = document.querySelector(
      ".search_dropdown_container--appareils"
    );
    //Réinitialise la liste d'appareils dans le dropdown
    const { recipes } = await getRecipes();
    if (
      currentValue.length === 0 &&
      allAppliance.children.length != filteredApplianceArray.length &&
      searchBarContainer.children.length < 4 &&
      dishesSection.children.length === recipes.length
    ) {
      const newFilter = document.createElement("div");
      const itemAppliance = allAppliance.children.length;
      for (let i = 0; i < itemAppliance; i++) {
        const element = allAppliance.firstChild;
        element.remove();
      }
      searBarApplianceContainer.style.width = "32rem";
      allAppliance.style.display = "grid";
      allAppliance.style.textAlign = "center";
      filteredApplianceArray.forEach((element) => {
        let queryTagContain = document.createElement("div");
        queryTagContain.setAttribute("class", "tag_container");
        childTagContainer = queryTagContain.children;
        let Span = document.createElement("span");
        Span.innerText = element;
        allAppliance.appendChild(Span);

        Span.addEventListener("mouseup", () => {
          const searchBar = document.querySelector(".search_bar_container");
          newFilter.setAttribute("class", "item_appliance");
          newFilter.setAttribute("id", 2);
          const spanFilter = document.createElement("span");
          spanFilter.innerText = Span.innerHTML;
          const iconFilter = document.createElement("icon");
          iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
          newFilter.appendChild(spanFilter);
          newFilter.appendChild(iconFilter);
          const queryTagContainer = document.querySelector(".tag_container");
          if (!queryTagContainer) {
            const tagIngredientContainer = document.createElement("div");
            tagIngredientContainer.setAttribute("class", "tag_container");
            tagIngredientContainer.appendChild(newFilter);
            searchBar.appendChild(tagIngredientContainer);
            Span.addEventListener("click", () => {
              const queryTagContainer =
                document.querySelector(".tag_container");
              childTagContainer = queryTagContainer.children;
              resultCombined();
            });
          } else {
            Span.addEventListener("click", () => {
              queryTagContain = document.querySelector(".tag_container");
              childTagContainer = queryTagContain.children;
              queryTagContainer.appendChild(newFilter);
              resultCombined();
            });
          }
        });
      });
    }

    if (currentValue.length >= 3) {
      const searBarApplianceContainer = document.querySelector(
        ".search_dropdown_container--appareils"
      );
      const allAppliance = document.querySelector(".all_appliances");
      searBarApplianceContainer.style.width = "9rem";
      allAppliance.style.display = "flex";
      allAppliance.style.flexDirection = "column";
      allAppliance.style.textAlign = "center";
      const newFilter = document.createElement("div");
      const itemAppliance = allAppliance.children.length;
      for (let i = 0; i < itemAppliance; i++) {
        const element = allAppliance.firstChild;
        element.remove();
      }
      filteredRecipesArray = filteredApplianceArray.filter((element) =>
        element
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(currentValue.toLowerCase())
      );
      //Affiche les tags appareils sous la barre de recherche ainsi que les appareils dans le dropdown (En tapant notre recherche dans l'input)
      filteredRecipesArray.forEach((element) => {
        let queryTagContain = document.createElement("div");
        queryTagContain.setAttribute("class", "tag_container");
        childTagContainer = queryTagContain.children;
        let Span = document.createElement("span");
        Span.innerText = element;
        allAppliance.appendChild(Span);

        Span.addEventListener("mouseup", () => {
          const searchBar = document.querySelector(".search_bar_container");
          newFilter.setAttribute("class", "item_appliance");
          newFilter.setAttribute("id", 2);
          const spanFilter = document.createElement("span");
          spanFilter.innerText = Span.innerHTML;
          const iconFilter = document.createElement("icon");
          iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
          newFilter.appendChild(spanFilter);
          newFilter.appendChild(iconFilter);
          const queryTagContainer = document.querySelector(".tag_container");
          if (!queryTagContainer) {
            const tagIngredientContainer = document.createElement("div");
            tagIngredientContainer.setAttribute("class", "tag_container");
            tagIngredientContainer.appendChild(newFilter);
            searchBar.appendChild(tagIngredientContainer);
            Span.addEventListener("click", () => {
              const queryTagContainer =
                document.querySelector(".tag_container");
              childTagContainer = queryTagContainer.children;
              resultCombined();
            });
          } else {
            Span.addEventListener("click", () => {
              queryTagContain = document.querySelector(".tag_container");
              childTagContainer = queryTagContain.children;
              queryTagContainer.appendChild(newFilter);
              resultCombined();
            });
          }
        });
      });
    }
  });

  //Affiche les tags ingredients sous la barre de recherche ainsi que les ingredients dans le dropdown (Lors du premier clic initial sur la partie ingredient)
  filteredApplianceArray.forEach((element) => {
    const Span = document.createElement("span");
    Span.innerText = element;
    allAppliance.appendChild(Span);
  });
  const spanAppliance = [];
  const itemAppliance = allAppliance.children.length;
  for (let i = 0; i < itemAppliance; i++) {
    const element = allAppliance.children[i];
    spanAppliance.push(element);
  }
  spanAppliance.forEach((item) => {
    item.addEventListener("mouseup", () => {
      const searchBar = document.querySelector(".search_bar_container");
      const newFilter = document.createElement("div");
      newFilter.setAttribute("class", "item_appliance");
      newFilter.setAttribute("id", 2);
      const spanFilter = document.createElement("span");
      spanFilter.innerText = item.innerHTML;
      const iconFilter = document.createElement("icon");
      iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
      newFilter.appendChild(spanFilter);
      newFilter.appendChild(iconFilter);
      const queryTagContainer = document.querySelector(".tag_container");
      if (!queryTagContainer) {
        const tagIngredientContainer = document.createElement("div");
        tagIngredientContainer.setAttribute("class", "tag_container");
        tagIngredientContainer.appendChild(newFilter);
        searchBar.appendChild(tagIngredientContainer);
        item.addEventListener("click", () => {
          const queryTagContainer = document.querySelector(".tag_container");
          childTagContainer = queryTagContainer.children;
          resultCombined();
        });
      } else {
        item.addEventListener("click", () => {
          queryTagContain = document.querySelector(".tag_container");
          childTagContainer = queryTagContain.children;
          queryTagContainer.appendChild(newFilter);
          resultCombined();
        });
      }
    });
  });
  //Ferme le dropdown lors du click en dehors de l'élément
  window.addEventListener("click", (e) => {
    const all_appliances = document.querySelector(".all_appliances");
    const dropdown_appliance = document.querySelector(
      ".search_dropdown--appareils"
    );
    if (e.target === dropdown_appliance || e.target === all_appliances) {
    } else if (!all_appliances) {
    } else {
      searchContainerAppliance[0].style.width = "9rem";

      searchContainerAppliance[0].setAttribute(
        "class",
        "search_container--appareils"
      );
      searchAppliance.setAttribute("class", "search_appareil");
      searchAppliance.value = "Appareils";
      searchAppliance.addEventListener("click", () => {
        searchAppliance.value = "";
      });
      all_appliances.remove();
      searchContainerAppliance[0].children[1].setAttribute(
        "class",
        "fa-solid fa-angle-down"
      );
    }
  });
});
//Ouvre le dropdown du tag ustensile
ustensileSearch.addEventListener("click", () => {
  let searchUstensiles = document.querySelector(".search_ustenstile");
  let searchUstensileContainer = document.querySelectorAll(
    ".search_container--ustenstiles"
  );
  if (searchUstensileContainer[0]) {
    searchUstensileContainer[0].setAttribute(
      "class",
      "search_dropdown_container--ustensiles"
    );
  }
  if (searchUstensiles) {
    searchUstensiles.setAttribute(
      "class",
      "search_dropdown search_dropdown--ustenstiles"
    );
    searchUstensiles.style.width = "32rem";
  }
  if (searchUstensileContainer[0]) {
    searchUstensileContainer[0].children[1].setAttribute(
      "class",
      "fa-solid fa-angle-up"
    );
    searchUstensileContainer[0].style.width = "32rem";
  }

  const allUstensiles = document.createElement("div");
  allUstensiles.setAttribute("class", "all_ustensiles");
  let searchBarContainer = document.querySelector(".search_bar_container");
  // Redimensionne la taille du dropdown en fonction du nombre d'ingredient disponible a l'intérieur
  if (searchBarContainer.children.length >= 4) {
    window.addEventListener("click", () => {
      if (
        spanUstensileRecipes.length <= 10 &&
        document.querySelector(".tag_container")
      ) {
        searchUstensileContainer[0].style.width = "9rem";
        allUstensiles.style.display = "flex";
        allUstensiles.style.flexDirection = "column";
        allUstensiles.style.textAlign = "center";
      } else {
        searchUstensileContainer[0].style.width = "32rem";
        allUstensiles.style.display = "grid";
        allUstensiles.style.textAlign = "center";
      }
    });
    if (childTagContainer.length === 0 && searchBar.value.length < 3) {
      init();
      searchUstensileContainer[0].style.width = "32rem";
      allUstensiles.style.display = "grid";
      allUstensiles.style.textAlign = "center";
    } else if (
      childTagContainer.length === 0 &&
      searchBar.value.length >= 3 &&
      dishesSection.children.length > 1
    ) {
      displaySearchBarResult();
    } else {
      resultCombined();
    }
  }
  //Place les ustensiles dans le dropdown
  if (searchUstensileContainer[0]) {
    searchUstensileContainer[0].appendChild(allUstensiles);
  }

  const filteredUstensilesArray = ustentilesArray.filter(function (ele, pos) {
    return ustentilesArray.indexOf(ele) == pos;
  });
  if (searchUstensiles) {
    searchUstensiles.removeAttribute("value");
    searchUstensiles.setAttribute("placeholder", "Ustensiles");
    //Active le systeme de recherche pour le tag ustensile
    searchUstensiles.addEventListener("keyup", (e) => {
      let currentValue = e.target.value;
      //Réinitialise la liste d'ustensiles dans le dropdown
      if (
        currentValue.length === 0 &&
        allUstensiles.children.length != filteredUstensilesArray.length &&
        searchBarContainer.children.length < 4
      ) {
        const itemUstensiles = allUstensiles.children.length;
        for (let i = 0; i < itemUstensiles; i++) {
          const element = allUstensiles.firstChild;
          element.remove();
        }
        searchUstensileContainer[0].style.width = "32rem";
        allUstensiles.style.display = "grid";
        allUstensiles.style.textAlign = "center";
        filteredUstensilesArray.forEach((element) => {
          const Span = document.createElement("span");
          Span.innerText = element;
          allUstensiles.appendChild(Span);
          Span.addEventListener("mouseup", () => {
            const searchBar = document.querySelector(".search_bar_container");
            const newFilter = document.createElement("div");
            newFilter.setAttribute("class", "item_ustensile");
            newFilter.setAttribute("id", 3);
            const spanFilter = document.createElement("span");
            spanFilter.innerText = Span.innerHTML;
            const iconFilter = document.createElement("icon");
            iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
            newFilter.appendChild(spanFilter);
            newFilter.appendChild(iconFilter);
            const queryTagContainer = document.querySelector(".tag_container");
            if (!queryTagContainer) {
              const tagIngredientContainer = document.createElement("div");
              tagIngredientContainer.setAttribute("class", "tag_container");
              tagIngredientContainer.appendChild(newFilter);
              searchBar.appendChild(tagIngredientContainer);
              async function newUstensiles() {
                const { recipes } = await getRecipes();
                const dishesSection = document.querySelector(".dishes_section");
                const dishesLength = dishesSection.children.length;
                for (let i = 0; i < dishesLength; i++) {
                  const element = dishesSection.firstChild;
                  element.remove();
                }
                const newRecipes = recipes.filter((recipe) => {
                  return recipe.ustensils.includes(Span.innerHTML);
                });
                const filteredNewRecipes = newRecipes.filter(function (
                  ele,
                  pos
                ) {
                  return newRecipes.indexOf(ele) == pos;
                });
                displayData(filteredNewRecipes);
              }
              newUstensiles();
              closeDropdownUstensile();
            } else {
              queryTagContain = document.querySelector(".tag_container");
              childTagContainer = queryTagContain.children;
              queryTagContain.appendChild(newFilter);
              resultCombined();
              closeDropdownUstensile();
            }
          });
        });
      }
      if (currentValue.length >= 3) {
        const searBarUstensileContainer = document.querySelector(
          ".search_dropdown_container--ustensiles"
        );
        searBarUstensileContainer.style.width = "9rem";
        allUstensiles.style.display = "flex";
        allUstensiles.style.flexDirection = "column";
        allUstensiles.style.textAlign = "center";

        const itemUstensiles = allUstensiles.children.length;
        for (let i = 0; i < itemUstensiles; i++) {
          const element = allUstensiles.firstChild;
          element.remove();
        }
        filteredDropdownArray = filteredUstensilesArray.filter((element) =>
          element
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(currentValue.toLowerCase())
        );
        //Affiche les tags ustensiles sous la barre de recherche ainsi que les ustensiles dans le dropdown (En tapant notre recherche dans l'input)
        filteredDropdownArray.forEach((element) => {
          const Span = document.createElement("span");
          Span.innerText = element;
          allUstensiles.appendChild(Span);
          Span.addEventListener("mouseup", () => {
            const searchBar = document.querySelector(".search_bar_container");
            const newFilter = document.createElement("div");
            newFilter.setAttribute("class", "item_ustensile");
            newFilter.setAttribute("id", 3);
            const spanFilter = document.createElement("span");
            spanFilter.innerText = Span.innerHTML;
            const iconFilter = document.createElement("icon");
            iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
            newFilter.appendChild(spanFilter);
            newFilter.appendChild(iconFilter);
            const queryTagContainer = document.querySelector(".tag_container");
            if (!queryTagContainer) {
              const tagIngredientContainer = document.createElement("div");
              tagIngredientContainer.setAttribute("class", "tag_container");
              tagIngredientContainer.appendChild(newFilter);
              searchBar.appendChild(tagIngredientContainer);
              async function newUstensiles() {
                const { recipes } = await getRecipes();
                const dishesSection = document.querySelector(".dishes_section");
                const dishesLength = dishesSection.children.length;
                for (let i = 0; i < dishesLength; i++) {
                  const element = dishesSection.firstChild;
                  element.remove();
                }
                const newRecipes = recipes.filter((recipe) => {
                  return recipe.ustensils.includes(Span.innerHTML);
                });
                const filteredNewRecipes = newRecipes.filter(function (
                  ele,
                  pos
                ) {
                  return newRecipes.indexOf(ele) == pos;
                });
                displayData(filteredNewRecipes);
              }
              newUstensiles();
            } else {
              queryTagContain = document.querySelector(".tag_container");
              childTagContainer = queryTagContain.children;
              queryTagContain.appendChild(newFilter);
              resultCombined();
              closeDropdownUstensile();
            }
          });
        });
      }
    });
  }

  //Affiche les tags ustensiles sous la barre de recherche ainsi que les ustensiles dans le dropdown (Lors du premier clic initial sur la partie ustensile)
  filteredUstensilesArray.forEach((element) => {
    const Span = document.createElement("span");
    Span.innerText = element;
    allUstensiles.appendChild(Span);
  });
  const spanUstensiles = [];
  const itemUstensiles = allUstensiles.children.length;
  for (let i = 0; i < itemUstensiles; i++) {
    const element = allUstensiles.children[i];
    spanUstensiles.push(element);
  }
  spanUstensiles.forEach((item) => {
    item.addEventListener("mouseup", () => {
      const searchBar = document.querySelector(".search_bar_container");
      const newFilter = document.createElement("div");
      newFilter.setAttribute("class", "item_ustensile");
      newFilter.setAttribute("id", 3);
      const spanFilter = document.createElement("span");
      spanFilter.innerText = item.innerHTML;
      const iconFilter = document.createElement("icon");
      iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
      newFilter.appendChild(spanFilter);
      newFilter.appendChild(iconFilter);
      const queryTagContainer = document.querySelector(".tag_container");
      if (!queryTagContainer) {
        const tagIngredientContainer = document.createElement("div");
        tagIngredientContainer.setAttribute("class", "tag_container");
        tagIngredientContainer.appendChild(newFilter);
        searchBar.appendChild(tagIngredientContainer);
        resultCombined();
        closeDropdownUstensile();
      } else {
        queryTagContain = document.querySelector(".tag_container");
        childTagContainer = queryTagContain.children;
        queryTagContain.appendChild(newFilter);
        resultCombined();
        closeDropdownUstensile();
      }
    });
  });
  //Ferme le dropdown lors du click en dehors de l'élément
  window.addEventListener("click", (e) => {
    const dropdownUstensiles = document.querySelector(
      ".search_dropdown--ustenstiles"
    );
    if (e.target === allUstensiles || e.target === dropdownUstensiles) {
    } else {
      closeDropdownUstensile();
    }
  });
  function closeDropdownUstensile() {
    if (searchUstensileContainer[0]) {
      searchUstensileContainer[0].style.width = "9rem";
      searchUstensiles.style.width = "9rem";
      searchUstensileContainer[0].setAttribute(
        "class",
        "search_container--ustenstiles"
      );
      searchUstensileContainer[0].children[1].setAttribute(
        "class",
        "fa-solid fa-angle-down"
      );
    }
    if (searchUstensiles) {
      searchUstensiles.setAttribute("class", "search_ustenstile");
      searchUstensiles.value = "Ustensiles";
      searchUstensiles.addEventListener("click", () => {
        searchUstensiles.value = "";
      });
    }
    allUstensiles.remove();
  }
});
//ALGORITHME DE LA BARRE DE RECHERCHE EN VERSION PROGRAMMATION NATIVE
const searchBar = document.querySelector(".search_bar");
searchBar.addEventListener("keyup", (e) => {
  const currentValue = e.target.value;
  let msgInput = document.querySelector(".msg_input_value");
  if (currentValue.length <= 3) {
    msgInput.style.visibility = "visible";
  }
  window.addEventListener("click", () => {
    if (document.activeElement != searchBar) {
      msgInput.style.visibility = "hidden";
    }
  });
  if (currentValue.length >= 3) {
    //Filtre les plats en fonction de des données entrée dans la barre de recherche
    msgInput.style.visibility = "hidden";

    async function newResult() {
      const { recipes } = await getRecipes();
      const dishesContainer = document.querySelectorAll(".dishes_container");
      dishesContainer.forEach((container) => {
        container.remove();
      });

      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        if (
          recipe.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(currentValue.toLowerCase())
        ) {
          newName.push(recipe);
        }
      }
      for (let i = 0; i < newName.length; i++) {
        const name = newName[i];
        if (name === name + 1) {
          newName.splice(i, 1);
        }
      }
      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        if (
          recipe.description
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(currentValue.toLowerCase())
        ) {
          newDescription.push(recipe);
        }
      }
      for (let i = 0; i < newDescription.length; i++) {
        const name = newDescription[i];
        if (name === name + 1) {
          newDescription.splice(i, 1);
        }
      }
      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        for (let g = 0; g < recipe.ingredients.length; g++) {
          const ingredient = recipe.ingredients[g].ingredient;
          if (
            ingredient
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(currentValue.toLowerCase())
          ) {
            newIngredient.push(recipe);
          }
        }
      }
      for (let i = 0; i < newIngredient.length; i++) {
        const name = newIngredient[i];
        if (name === name + 1) {
          newIngredient.splice(i, 1);
        }
      }
      searchBarResult = [];
      //Affiche les résultats de la recherche
      if (newName.length > 0) {
        noResultMsg.style.visibility = "hidden";
        for (let i = 0; i < newName.length; i++) {
          const recipe = newName[i];
          searchBarResult.push(recipe);
        }
      }
      if (newDescription.length > 0) {
        noResultMsg.style.visibility = "hidden";
        for (let i = 0; i < newDescription.length; i++) {
          const recipe = newDescription[i];
          searchBarResult.push(recipe);
        }
      }
      if (newIngredient.length > 0) {
        noResultMsg.style.visibility = "hidden";
        for (let i = 0; i < newIngredient.length; i++) {
          const recipe = newIngredient[i];
          searchBarResult.push(recipe);
        }
      }
      if (searchBarResult.length > 0) {
        const filtereSearchResult = searchBarResult.filter(function (ele, pos) {
          return searchBarResult.indexOf(ele) == pos;
        });
        searchResultCopy   = [];
        filtereSearchResult.forEach((item) => {
        searchResultCopy.push(item);
      });
        displayData(filtereSearchResult);
        searchIngredient.addEventListener("click", displaySearchBarResult);
        applianceSearch.addEventListener("click", displaySearchBarResult);
        ustensileSearch.addEventListener("click", displaySearchBarResult);
      }

      //Affiche un message si aucun resultat n'a été trouvé
      else if (
        newName.length === 0 &&
        newDescription.length === 0 &&
        newIngredient.length === 0
      ) {
        while (dishesSection.children.length === 0) {
          noResultMsg = document.createElement("div");
          noResultMsg.setAttribute("class", "no_result_msg");
          dishesSection.appendChild(noResultMsg);
        }
        noResultMsg.style.visibility = "visible";
        let primaryIngredient =
          " " +
          ingredientArray[Math.floor(Math.random() * ingredientArray.length)];
        let secondaryIngredient =
          " " +
          ingredientArray[Math.floor(Math.random() * ingredientArray.length)];
        noResultMsg.innerText =
          noResultMsg.innerText +
          " " +
          "<<" +
          primaryIngredient +
          ">>" +
          "," +
          "<<" +
          secondaryIngredient +
          ">>";
        if (noResultMsg.innerText.includes(primaryIngredient)) {
          noResultMsg.innerHTML =
            "Aucune recette ne correspond à votre critère... vous pouvez chercher" +
            " " +
            "<<" +
            primaryIngredient +
            ">>" +
            "," +
            "<<" +
            secondaryIngredient +
            ">>";
        }
      }
      newName = [];
      newDescription = [];
      newIngredient = [];
      searchIngredient.addEventListener("click", displaySearchBarResult);
      applianceSearch.addEventListener("click", displaySearchBarResult);
      ustensileSearch.addEventListener("click", displaySearchBarResult);
    }
    newResult();
  }
  //Supprime le resultat de la recherche précédente
  let allArticle = document.querySelectorAll("article");
  noResultMsg.style.visibility = "hidden";
  if (currentValue === "" &&(childTagContainer === 0 || !childTagContainer)) {
    async function removeDishes(time = 2) {
      for (let i = 0; i < time; i++) {
        for (let i = 0; i < allArticle.length; ++i) {
          allArticle[i].remove();
        }
      }
    }
    removeDishes();
    setTimeout(init, 10);
    ingredientSearch.addEventListener("click", () => {
      function resizeIngredient() {
        const dropdownContainer = document.querySelector(
          ".search_dropdown_container--ingredients"
        );

        searchIngredient.style.width = "32rem";
        dropdownContainer.style.width = "32rem";
      }
      setTimeout(resizeIngredient, 0.000000000000001);
    });
    ustensileSearch.addEventListener("click", () => {
      function resizeUstensile() {
        let ustensileContainer = document.querySelectorAll(
          ".search_dropdown_container--ustensiles"
        );
        let allUstensiles = document.querySelector(".all_ustensiles");
        ustensileContainer[0].style.width = "32rem";
        allUstensiles.style.display = "grid";
        allUstensiles.style.textAlign = "center";
      }

      setTimeout(resizeUstensile, 0.000000000000001);
    });
  }
  else {
    setTimeout(resultCombined, 10); 
  }
});
//Affiche les les plats en fonction des tags actif
async function resultCombined() {
  let arrayRecipes = [];
  arrayRecipes = [];
  spanValueId = [];
  spanUstensileRecipes = [];
  spanApplianceRecipes = [];
  spanAppliance = [];
  ustensileRecipes = [];
  queryTagContain = document.querySelector(".tag_container");
  childTagContainer = queryTagContain.children;

  //Ajoute la valeur des tags dans un tableau
  for (let i = 0; i < childTagContainer.length; i++) {
    const child = childTagContainer[i];
    const objectValue = {
      id: child.id,
      value: child.children[0].innerHTML,
    };
    spanValueId.push(objectValue);
  }
  // Filtre le tableau contenant les tags n'avoir aucun doublon
  var spanValueIdObjectToString = spanValueId.map(JSON.stringify);
  var filteredSpanValueId = spanValueIdObjectToString.filter(function (
    ele,
    pos
  ) {
    return spanValueIdObjectToString.indexOf(ele) == pos;
  });
  var uniqueSpanValueId = Array.from(filteredSpanValueId).map(JSON.parse);
  if (uniqueSpanValueId.length > childTagContainer.length) {
    uniqueSpanValueId.pop();
  }

  const { recipes } = await getRecipes();
  const dishesSection = document.querySelector(".dishes_section");
  const dishesLength = dishesSection.children.length;
  for (let i = 0; i < dishesLength + 1; i++) {
    const element = dishesSection.firstChild;
    if (element) {
      element.remove();
    }
  }
  let itemRecipes = [];
  //Vérifie qua la valeur de chaque tag est compris dans le plat
  recipes.forEach((recipe) => {
    uniqueSpanValueId.forEach((object) => {
      if (object.id === "1") {
        recipe.ingredients.forEach((element) => {
          itemRecipes.push(element.ingredient);
        });
        if (itemRecipes.includes(object.value)) {
          ++countId1;
        }
      }
      if (object.id === "2") {
        if (recipe.appliance.includes(object.value)) {
          ++countId2;
        }
      }
      if (object.id === "3") {
        if (recipe.ustensils.includes(object.value)) {
          ++countId3;
        }
      }
      if (countId1 + countId2 + countId3 === uniqueSpanValueId.length) {
        arrayRecipes.push(recipe);
      }
    });
    countId1 = 0;
    countId2 = 0;
    countId3 = 0;
    itemRecipes = [];
  });

  if (searchBar.value.length >= 3 && childTagContainer.length > 0) {
    let includeValueRecipe = [];
    const newNameBis = arrayRecipes.filter((recipe) => {
      return recipe.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(searchBar.value.toLowerCase());
    });
    const filteredNewNameBis = newNameBis.filter(function (ele, pos) {
      return newNameBis.indexOf(ele) == pos;
    });
    const newDescriptionBis = arrayRecipes.filter((recipe) => {
      return recipe.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(searchBar.value.toLowerCase());
    });
    const filteredNewDescriptionBis = newDescriptionBis.filter(function (
      ele,
      pos
    ) {
      return newDescriptionBis.indexOf(ele) == pos;
    });
    const newIngredientBis = arrayRecipes.filter((recipe) => {
      return recipe.ingredients.some((ingredient) =>
        ingredient.ingredient
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .startsWith(searchBar.value.toLowerCase())
      );
    });
    const filteredNewIngredientBis = newIngredientBis.filter(function (
      ele,
      pos
    ) {
      return newIngredientBis.indexOf(ele) == pos;
    });

    if (filteredNewNameBis.length > 0) {
      filteredNewNameBis.forEach((recipe) => {
        includeValueRecipe.push(recipe);
      });
    }
    if (filteredNewDescriptionBis.length > 0) {
      filteredNewDescriptionBis.forEach((recipe) => {
        includeValueRecipe.push(recipe);
      });
    }
    if (filteredNewIngredientBis.length > 0) {
      filteredNewIngredientBis.forEach((recipe) => {
        includeValueRecipe.push(recipe);
      });
    }
    if (includeValueRecipe.length > 0) {
      const filteredIncludeValueRecipe = includeValueRecipe.filter(function (
        ele,
        pos
      ) {
        return includeValueRecipe.indexOf(ele) == pos;
      });
      arrayRecipes = [];
      filteredIncludeValueRecipe.forEach((recipe) => {
        arrayRecipes.push(recipe);
      });
    }
  }

  //Initialise des variables en fonction des elements disponible sur la page pour ne pas provoquer d'erreurs
  if (document.querySelector(".all_ingredients")) {
    var allIngredients = document.querySelector(".all_ingredients");
    var childIngredientLength = allIngredients.children.length;
    displayIngredient();
  }
  if (document.querySelector(".all_appliances")) {
    var allAppliance = document.querySelector(".all_appliances");
    var childApplianceLength = allAppliance.children.length;
    displayAppliance();
  }
  if (document.querySelector(".all_ustensiles")) {
    var allUstensile = document.querySelector(".all_ustensiles");
    var childUstensileLength = allUstensile.children.length;
    displayUstenstile();
  }

  //Rafraichis le nombre d'ingredients dans le dropdown
  async function displayIngredient() {
    ingredientRecipes = [];
    for (let i = 0; i < childIngredientLength; i++) {
      const element = allIngredients.firstChild;
      element.remove();
    }
    arrayRecipes.forEach((element) => {
      element.ingredients.forEach((ingredient) => {
        ingredientRecipes.push(ingredient.ingredient);
      });
    });
    const filteredIngredientRecipes = ingredientRecipes.filter(function (
      ele,
      pos
    ) {
      return ingredientRecipes.indexOf(ele) == pos;
    });
    const queryAllIgredients = document.querySelectorAll(".all_ingredients");

    filteredIngredientRecipes.forEach((item) => {
      const Span = document.createElement("span");
      Span.innerText = item;
      spanIngredientRecipes.push(Span);
      allIngredients.appendChild(Span);
    });
    if (queryAllIgredients.length > 1) {
      for (let i = 1; i < queryAllIgredients.length; i++) {
        const element = queryAllIgredients[i];
        for (let j = 0; j < element.children.length; j++) {
          while (element.children.length > 0) element.firstChild.remove();
        }
        element.remove();
      }
    }
    spanIngredientRecipes.forEach((item) => {
      item.addEventListener("mousedown", () => {
        const searchBar = document.querySelector(".search_bar_container");
        const newFilter = document.createElement("div");
        newFilter.setAttribute("class", "item_ingredients");
        newFilter.setAttribute("id", 1);
        const spanFilter = document.createElement("span");
        spanFilter.innerText = item.innerHTML;
        const iconFilter = document.createElement("icon");
        iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
        newFilter.appendChild(spanFilter);
        newFilter.appendChild(iconFilter);
        const queryTagContainer = document.querySelector(".tag_container");
        if (!queryTagContainer) {
          const tagIngredientContainer = document.createElement("div");
          tagIngredientContainer.setAttribute("class", "tag_container");
          tagIngredientContainer.appendChild(newFilter);
          searchBar.appendChild(tagIngredientContainer);
          async function newInit() {
            const { recipes } = await getRecipes();
            const dishesSection = document.querySelector(".dishes_section");
            const dishesLength = dishesSection.children.length;
            for (let i = 0; i < dishesLength; i++) {
              const element = dishesSection.firstChild;
              element.remove();
            }
            const newRecipes = recipes.filter((recipe) => {
              return recipe.ingredients.some(
                (ingredient) => ingredient.ingredient === item.innerHTML
              );
            });
            const filteredNewRecipes = newRecipes.filter(function (ele, pos) {
              return newRecipes.indexOf(ele) == pos;
            });
            displayData(filteredNewRecipes);
          }
          newInit();
          closeDropdownIngredient();
          function closeDropdownIngredient() {
            const all_ingredients = document.querySelector(".all_ingredients");
            dropdownContainer.style.width = "9rem";
            searchIngredient.style.width = "9rem";
            searchContainer[0].setAttribute(
              "class",
              "search_container--ingredients"
            );
            searchIngredient.setAttribute("class", "search_ingredient");
            searchIngredient.value = "Ingredients";
            searchIngredient.addEventListener("click", () => {
              searchIngredient.value = "";
            });
            all_ingredients.remove();
            searchContainer[0].children[1].setAttribute(
              "class",
              "fa-solid fa-angle-down"
            );
          }
        } else {
          queryTagContain = document.querySelector(".tag_container");
          childTagContainer = queryTagContainer.children;
          queryTagContain.appendChild(newFilter);
          resultCombined();
        }
      });
    });
  }
  //Rafraichis le nombre d'appareil dans le dropdown
  async function displayAppliance() {
    for (let i = 0; i < childApplianceLength; i++) {
      const element = allAppliance.firstChild;
      element.remove();
    }
    arrayRecipes.forEach((item) => {
      spanAppliance.push(item.appliance);
    });
    const filteredSpanAppliance = spanAppliance.filter(function (ele, pos) {
      return spanAppliance.indexOf(ele) == pos;
    });
    filteredSpanAppliance.forEach((appliance) => {
      const Span = document.createElement("span");
      Span.innerText = appliance;
      spanApplianceRecipes.push(Span);
      allAppliance.appendChild(Span);
    });
    let queryAllAppliances = document.querySelectorAll(".all_appliances");
    if (queryAllAppliances.length > 1) {
      for (let i = 1; i < queryAllAppliances.length; i++) {
        const element = queryAllAppliances[i];
        for (let j = 0; j < element.children.length; j++) {
          while (element.children.length > 0) element.firstChild.remove();
        }
        element.remove();
      }
    }
    spanApplianceRecipes.forEach((item) => {
      item.addEventListener("click", () => {
        const searchBar = document.querySelector(".search_bar_container");
        const newFilter = document.createElement("div");
        newFilter.setAttribute("class", "item_appliance");
        newFilter.setAttribute("id", 2);
        const spanFilter = document.createElement("span");
        spanFilter.innerText = item.innerHTML;
        const iconFilter = document.createElement("icon");
        iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
        newFilter.appendChild(spanFilter);
        newFilter.appendChild(iconFilter);
        const queryTagContainer = document.querySelector(".tag_container");
        if (!queryTagContainer) {
          const tagIngredientContainer = document.createElement("div");
          tagIngredientContainer.setAttribute("class", "tag_container");
          tagIngredientContainer.appendChild(newFilter);
          searchBar.appendChild(tagIngredientContainer);
          newAppliance();
        } else {
          queryTagContain = document.querySelector(".tag_container");
          childTagContainer = queryTagContain.children;
          queryTagContain.appendChild(newFilter);
          resultCombined();
        }
      });
    });
  }
  async function newAppliance() {
    displayData(arrayRecipes);
  }
  //Rafraichis le nombre d'ustensile dans le dropdown
  async function displayUstenstile() {
    for (let i = 0; i < childUstensileLength; i++) {
      const element = allUstensile.firstChild;
      element.remove();
    }
    arrayRecipes.forEach((item) => {
      item.ustensils.forEach((ustensil) => {
        ustensileRecipes.push(ustensil);
      });
    });
    const filteredUstensilestRecipes = ustensileRecipes.filter(function (
      ele,
      pos
    ) {
      return ustensileRecipes.indexOf(ele) == pos;
    });
    filteredUstensilestRecipes.forEach((item) => {
      const Span = document.createElement("span");
      Span.innerText = item;
      spanUstensileRecipes.push(Span);
      allUstensile.appendChild(Span);
    });
    let queryAllUstensiles = document.querySelectorAll(".all_ustensiles");
    if (queryAllUstensiles.length > 1) {
      for (let i = 1; i < queryAllUstensiles.length; i++) {
        const element = queryAllUstensiles[i];
        for (let j = 0; j < element.children.length; j++) {
          while (element.children.length > 0) element.firstChild.remove();
        }
        element.remove();
      }
    }
    spanUstensileRecipes.forEach((item) => {
      item.addEventListener("click", () => {
        const searchBar = document.querySelector(".search_bar_container");
        const newFilter = document.createElement("div");
        newFilter.setAttribute("class", "item_ustensile");
        newFilter.setAttribute("id", 3);
        const spanFilter = document.createElement("span");
        spanFilter.innerText = item.innerHTML;
        const iconFilter = document.createElement("icon");
        iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
        newFilter.appendChild(spanFilter);
        newFilter.appendChild(iconFilter);
        const queryTagContainer = document.querySelector(".tag_container");
        if (!queryTagContainer) {
          const tagIngredientContainer = document.createElement("div");
          tagIngredientContainer.setAttribute("class", "tag_container");
          tagIngredientContainer.appendChild(newFilter);
          searchBar.appendChild(tagIngredientContainer);
          newUstensiles();
          async function newUstensiles() {
            const { recipes } = await getRecipes();
            const dishesSection = document.querySelector(".dishes_section");
            const dishesLength = dishesSection.children.length;
            for (let i = 0; i < dishesLength; i++) {
              const element = dishesSection.firstChild;
              element.remove();
            }
            const newRecipes = recipes.filter((recipe) => {
              return recipe.ustensils.includes(item.innerHTML);
            });
            const filteredNewRecipes = newRecipes.filter(function (ele, pos) {
              return newRecipes.indexOf(ele) == pos;
            });
            displayData(filteredNewRecipes);
          }
        } else {
          queryTagContain = document.querySelector(".tag_container");
          childTagContainer = queryTagContain.children;
          queryTagContain.appendChild(newFilter);
          resultCombined();
        }
      });
    });
  }
  //Affiche les plats
  displayData(arrayRecipes);
  searchBarResult = arrayRecipes;
  //Supprime les plats superflu lors du résultat
  if (dishesSection.children.length != arrayRecipes.length) {
    dishesSection.firstChild.remove();
  }
}
//Supprime les tags et réactualise le résultat
window.addEventListener("mousedown", (e) => {
  if (searchBarContainer.children.length >= 4) {
    let allCross = document.querySelectorAll(".fa-regular.fa-circle-xmark");
    AllTagContain = document.querySelectorAll(".tag_container");
    queryTagContain = document.querySelector(".tag_container");
    childTagContainer = queryTagContain.children;
    for (const cross of allCross) {
      if (e.target === cross) {
        cross.parentElement.remove();
        function reInit() {
          if (
            childTagContainer.length === 0 &&
            e.target === cross &&
            searchBar.value.length < 3
          ) {
            e.stopImmediatePropagation();
            const dishesSection = document.querySelector(".dishes_section");
            const dishesLength = dishesSection.children.length;
            if (dishesLength > 0) {
              for (let i = 0; i < dishesLength; i++) {
                const element = dishesSection.firstChild;
                element.remove();
              }
            }
            searchIngredient.removeEventListener(
              "click",
              displaySearchBarResult
            );
            init();
            AllTagContain.forEach((container) => {
              container.remove();
            });
          } else if (
            childTagContainer.length === 0 &&
            e.target === cross &&
            searchBar.value.length >= 3
          ) {
            searchIngredient.removeEventListener(
              "click",
              displaySearchBarResult
            );
            const dishesSection = document.querySelector(".dishes_section");
            const dishesLength = dishesSection.children.length;
            if (dishesLength > 0) {
              for (let i = 0; i < dishesLength; i++) {
                const element = dishesSection.children[0];
                element.remove();
              }

              displayData(searchResultCopy);
            }
          } else {
            searchIngredient.removeEventListener(
              "click",
              displaySearchBarResult
            );
            resultCombined();
          }
        }
        reInit();
      }
    }
  }
});

async function displaySearchBarResult() {
  async function RefreshTagItem() {
    if (document.querySelector(".all_ingredients")) {
      const { recipes } = await getRecipes();
      var allIngredients = document.querySelector(".all_ingredients");
      var childIngredientLength = allIngredients.children.length;
      if (
        dishesSection.children.length === recipes.length + 1 ||
        dishesSection.children.length === recipes.length ||
        dishesSection.children.length === recipes.length * 2 ||
        dishesSection.children.length === recipes.length * 2 + 1
      ) {
        const dishesLength = dishesSection.children.length;
        for (let i = 1; i < dishesLength; i++) {
          const element = dishesSection.children[1];
          element.remove();
        }
        init().then(() => {
          let ingredientTest = document.querySelector(".all_ingredients");
          const itemIngredient = ingredientTest.children.length;
          for (let i = 0; i < itemIngredient; i++) {
            const element = ingredientTest.firstChild;
            element.remove();
          }
          const filteredingredientArray = ingredientArray.filter(function (
            ele,
            pos
          ) {
            return ingredientArray.indexOf(ele) == pos;
          });
          filteredingredientArray.forEach((element) => {
            const Span = document.createElement("span");
            Span.innerText = element;
            ingredientTest.appendChild(Span);
            Span.addEventListener("click", () => {
              let div = document.createElement("div");
              let icon = document.createElement("i");
              div.setAttribute("class", "item_ingredients");
              div.setAttribute("id", "1");
              icon.setAttribute("class", "fa-regular fa-circle-xmark");
              div.appendChild(Span);
              div.appendChild(icon);
              queryTagContain.appendChild(div);
              resultCombined();
            });
          });
        });

        if (dishesSection.children.length > recipes.length + 1) {
          for (let i = 1; i < dishesLength; i++) {
            const element = dishesSection.children[1];
            element.remove();
          }
          displayIngredient();
        }
      } else if (dishesSection.children.length <= 1) {
        searchBarResult = [];
        resultCombined();
      } else {
        displayIngredient();
      }
    }

    if (document.querySelector(".all_appliances")) {
      const { recipes } = await getRecipes();
      var allAppliance = document.querySelector(".all_appliances");
      var childApplianceLength = allAppliance.children.length;
      if (
        dishesSection.children.length === recipes.length + 1 ||
        dishesSection.children.length === recipes.length ||
        dishesSection.children.length === recipes.length * 2 ||
        dishesSection.children.length === recipes.length * 2 + 1
      ) {
        if (childApplianceLength > 10) {
          const allAppliance = document.querySelector(".all_appliances");
          searchContainerAppliance[0].style.width = "32rem";
          allAppliance.style.display = "grid";
          allAppliance.style.textAlign = "center";
        }

        const dishesLength = dishesSection.children.length;
        for (let i = 1; i < dishesLength; i++) {
          const element = dishesSection.children[1];
          element.remove();
        }
        init().then(() => {
          if (dishesSection.children.length > recipes.length + 1) {
            for (let i = 1; i < dishesLength; i++) {
              const element = dishesSection.children[1];
              element.remove();
            }
            let ingredientTest = document.querySelector(".all_appliances");
            const itemIngredient = ingredientTest.children.length;
            for (let i = 0; i < itemIngredient; i++) {
              const element = ingredientTest.firstChild;
              element.remove();
            }
            const filteredingredientArray = applianceArray.filter(function (
              ele,
              pos
            ) {
              return ingredientArray.indexOf(ele) == pos;
            });
            filteredingredientArray.forEach((element) => {
              const Span = document.createElement("span");
              Span.innerText = element;
              ingredientTest.appendChild(Span);
              Span.addEventListener("click", () => {
                let div = document.createElement("div");
                let icon = document.createElement("i");
                div.setAttribute("class", "item_appliances");
                div.setAttribute("id", "2");
                icon.setAttribute("class", "fa-regular fa-circle-xmark");
                div.appendChild(Span);
                div.appendChild(icon);
                queryTagContain.appendChild(div);
                resultCombined();
              });
            });
          }
        });
      } else if (dishesSection.children.length <= 1) {
        searchBarResult = [];
        resultCombined();
      } else {
        displayAppliance();
      }
    }
    if (document.querySelector(".all_ustensiles")) {
      let { recipes } = await getRecipes();
      var allUstensile = document.querySelector(".all_ustensiles");
      var childUstensileLength = allUstensile.children.length;
      if (
        dishesSection.children.length === recipes.length + 1 ||
        dishesSection.children.length === recipes.length ||
        dishesSection.children.length === recipes.length * 2 ||
        dishesSection.children.length === recipes.length * 2 + 1
      ) {
        const dishesLength = dishesSection.children.length;
        for (let i = 1; i < dishesLength; i++) {
          const element = dishesSection.children[1];
          element.remove();
        }
        init().then(() => {
          if (dishesSection.children.length > recipes.length + 1) {
            for (let i = 1; i < dishesLength; i++) {
              const element = dishesSection.children[1];
              element.remove();
            }
            let ingredientTest = document.querySelector(".all_ustensiles");
            const itemIngredient = ingredientTest.children.length;
            for (let i = 0; i < itemIngredient; i++) {
              const element = ingredientTest.firstChild;
              element.remove();
            }
            const filteredingredientArray = ingredientArray.filter(function (
              ele,
              pos
            ) {
              return ingredientArray.indexOf(ele) == pos;
            });
            filteredingredientArray.forEach((element) => {
              const Span = document.createElement("span");
              Span.innerText = element;
              ingredientTest.appendChild(Span);
              Span.addEventListener("click", () => {
                let div = document.createElement("div");
                let icon = document.createElement("i");
                div.setAttribute("class", "item_ustensile");
                div.setAttribute("id", "3");
                icon.setAttribute("class", "fa-regular fa-circle-xmark");
                div.appendChild(Span);
                div.appendChild(icon);
                queryTagContain.appendChild(div);
                resultCombined();
              });
            });
          }
        });
      } else if (dishesSection.children.length <= 1) {
        searchBarResult = [];
        resultCombined();
      } else {
        displayUstenstile();
      }
    }

    async function displayIngredient() {
      let { recipes } = await getRecipes();
      if (
        searchBarContainer.children.length >= 4 &&
        childTagContainer.length > 0
      ) {
        resultCombined();
      } else if (
        dishesSection.children.length === recipes.length + 1 ||
        dishesSection.children.length === recipes.length
      ) {
      } else {
        ingredientRecipes = [];
        for (let i = 0; i < childIngredientLength; i++) {
          const element = allIngredients.firstChild;
          element.remove();
        }
        const dropdownContainer = document.querySelector(
          ".search_dropdown_container--ingredients"
        );
        if (childIngredientLength > 10) {
          searchIngredient.style.width = "32rem";
          dropdownContainer.style.width = "32rem";
        }
        let filteredSearchResultCopy = searchResultCopy.filter(function (
          ele,
          pos
        ) {
          return searchResultCopy.indexOf(ele) == pos;
        });
        filteredSearchResultCopy.forEach((element) => {
          element.ingredients.forEach((ingredient) => {
            ingredientRecipes.push(ingredient.ingredient);
          });
        });
        const filteredIngredientRecipes = ingredientRecipes.filter(function (
          ele,
          pos
        ) {
          return ingredientRecipes.indexOf(ele) == pos;
        });

        filteredIngredientRecipes.forEach((item) => {
          const Span = document.createElement("span");
          Span.innerText = item;
          spanIngredientRecipes.push(Span);
          allIngredients.appendChild(Span);
        });

        spanIngredientRecipes.forEach((item) => {
          item.addEventListener("click", () => {
            let sortSearchResult = [];
            sortSearchResult = [];
            const searchBar = document.querySelector(".search_bar_container");
            const newFilter = document.createElement("div");
            newFilter.setAttribute("class", "item_ingredients");
            newFilter.setAttribute("id", 1);
            const spanFilter = document.createElement("span");
            spanFilter.innerText = item.innerHTML;
            const iconFilter = document.createElement("icon");
            iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
            newFilter.appendChild(spanFilter);
            newFilter.appendChild(iconFilter);
            const queryTagContainer = document.querySelector(".tag_container");
            if (!queryTagContainer) {
              const tagIngredientContainer = document.createElement("div");
              tagIngredientContainer.setAttribute("class", "tag_container");
              tagIngredientContainer.appendChild(newFilter);
              searchBar.appendChild(tagIngredientContainer);
              const dishesSection = document.querySelector(".dishes_section");
              const dishesLength = dishesSection.children.length;

              for (let i = 0; i < dishesLength + 1; i++) {
                const element = dishesSection.children[0];
                if (element) {
                  element.remove();
                }
              }
              filteredSearchResultCopy.forEach((element) => {
                sortSearchResult.push(element);
              });
              sortSearchResult = sortSearchResult.filter((recipe) => {
                return recipe.ingredients.some((ingredient) =>
                  ingredient.ingredient.startsWith(item.innerHTML)
                );
              });

              resultCombined();
              ingredientSearch.addEventListener("click", () => {
                function test() {
                  const dropdownContainer = document.querySelector(
                    ".search_dropdown_container--ingredients"
                  );

                  var allIngredients =
                    document.querySelector(".all_ingredients");
                  var childIngredientLength = allIngredients.children.length;
                  if (childIngredientLength > 10) {
                    searchIngredient.style.width = "32rem";
                    dropdownContainer.style.width = "32rem";
                  }
                  for (let i = 0; i < childIngredientLength; i++) {
                    const element = allIngredients.firstChild;
                    element.remove();
                  }
                  filteredSearchResultCopy.forEach((ingredient) => {
                    ingredient.ingredients.forEach((ingredients) => {
                      const span = document.createElement("span");
                      span.innerText = ingredients.ingredient;
                      spanIngredientRecipes.push(span);
                      allIngredients.appendChild(span);
                    });
                  });
                  spanIngredientRecipes.forEach((item) => {
                    item.addEventListener("mouseup", () => {
                      const searchBar = document.querySelector(
                        ".search_bar_container"
                      );
                      const newFilter = document.createElement("div");
                      newFilter.setAttribute("class", "item_ingredients");
                      newFilter.setAttribute("id", 1);
                      const spanFilter = document.createElement("span");
                      spanFilter.innerText = item.innerHTML;
                      const iconFilter = document.createElement("icon");
                      iconFilter.setAttribute(
                        "class",
                        "fa-regular fa-circle-xmark"
                      );
                      newFilter.appendChild(spanFilter);
                      newFilter.appendChild(iconFilter);
                      const queryTagContainer =
                        document.querySelector(".tag_container");
                      if (!queryTagContainer) {
                        const queryTagContain = document.createElement("div");
                        queryTagContain.setAttribute("class", "tag_container");
                        searchBarContainer.appendChild(queryTagContain);
                        queryTagContain.appendChild(newFilter);
                        resultCombined();
                      } else {
                        queryTagContainer.appendChild(newFilter);
                        resultCombined();
                      }
                    });
                  });
                }
                test();
              });

              closeDropdownIngredient();
              function closeDropdownIngredient() {
                const dropdownContainer = document.querySelector(
                  ".search_dropdown_container--ingredients"
                );
                const all_ingredients =
                  document.querySelector(".all_ingredients");
                dropdownContainer.style.width = "9rem";
                searchIngredient.style.width = "9rem";
                searchContainer[0].setAttribute(
                  "class",
                  "search_container--ingredients"
                );
                searchIngredient.setAttribute("class", "search_ingredient");
                searchIngredient.value = "Ingredients";
                searchIngredient.addEventListener("click", () => {
                  searchIngredient.value = "";
                });
                all_ingredients.remove();
                searchContainer[0].children[1].setAttribute(
                  "class",
                  "fa-solid fa-angle-down"
                );
              }
            } else {
              queryTagContain.appendChild(newFilter);
              const dishesSection = document.querySelector(".dishes_section");
              const dishesLength = dishesSection.children.length;
              for (let i = 1; i < dishesLength; i++) {
                const element = dishesSection.children[1];
                element.remove();
              }

              resultCombined();
              closeDropdownIngredient();
              function closeDropdownIngredient() {
                const dropdownContainer = document.querySelector(
                  ".search_dropdown_container--ingredients"
                );
                const all_ingredients =
                  document.querySelector(".all_ingredients");
                dropdownContainer.style.width = "9rem";
                searchIngredient.style.width = "9rem";
                searchContainer[0].setAttribute(
                  "class",
                  "search_container--ingredients"
                );
                searchIngredient.setAttribute("class", "search_ingredient");
                searchIngredient.value = "Ingredients";
                searchIngredient.addEventListener("click", () => {
                  searchIngredient.value = "";
                });
                all_ingredients.remove();
                searchContainer[0].children[1].setAttribute(
                  "class",
                  "fa-solid fa-angle-down"
                );
              }
            }
          });
        });

        const queryAllIgredients =
          document.querySelectorAll(".all_ingredients");
        if (queryAllIgredients.length > 1) {
          for (let i = 1; i < queryAllIgredients.length; i++) {
            const element = queryAllIgredients[i];
            for (let j = 0; j < element.children.length; j++) {
              while (element.children.length > 0) element.firstChild.remove();
            }
            element.remove();
          }
        }
      }
    }
    async function displayAppliance() {
      const { recipes } = await getRecipes();
      if (
        searchBarContainer.children.length >= 4 &&
        childTagContainer.length > 0
      ) {
        resultCombined();
      } else if (
        dishesSection.children.length === recipes.length + 1 ||
        dishesSection.children.length === recipes.length
      ) {
      } else {
        for (let i = 0; i < childApplianceLength; i++) {
          const element = allAppliance.firstChild;
          element.remove();
        }
        if (childApplianceLength > 10) {
          const allAppliance = document.querySelector(".all_appliances");
          searchContainerAppliance[0].style.width = "32rem";
          allAppliance.style.display = "grid";
          allAppliance.style.textAlign = "center";
        }
        let filteredSearchResultCopy = searchResultCopy.filter(function (
          ele,
          pos
        ) {
          return searchResultCopy.indexOf(ele) == pos;
        });
        filteredSearchResultCopy.forEach((item) => {
          spanAppliance.push(item.appliance);
        });
        let filteredSpanAppliances = spanAppliance.filter(function (ele, pos) {
          return spanAppliance.indexOf(ele) == pos;
        });
        spanAppliance = [];
        filteredSpanAppliances.forEach((appliance) => {
          const Span = document.createElement("span");
          Span.innerText = appliance;
          spanApplianceRecipes.push(Span);
          allAppliance.appendChild(Span);
        });

        let queryAllAppliances = document.querySelectorAll(".all_appliances");
        if (queryAllAppliances.length > 1) {
          for (let i = 1; i < queryAllAppliances.length; i++) {
            const element = queryAllAppliances[i];
            for (let j = 0; j < element.children.length; j++) {
              while (element.children.length > 0) element.firstChild.remove();
            }
            element.remove();
          }
        }
        spanApplianceRecipes.forEach((item) => {
          item.addEventListener("click", () => {
            const searchBar = document.querySelector(".search_bar_container");
            const newFilter = document.createElement("div");
            newFilter.setAttribute("class", "item_appliance");
            newFilter.setAttribute("id", 2);
            const spanFilter = document.createElement("span");
            spanFilter.innerText = item.innerHTML;
            const iconFilter = document.createElement("icon");
            iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
            newFilter.appendChild(spanFilter);
            newFilter.appendChild(iconFilter);
            const queryTagContainer = document.querySelector(".tag_container");
            if (!queryTagContainer) {
              const tagIngredientContainer = document.createElement("div");
              tagIngredientContainer.setAttribute("class", "tag_container");
              tagIngredientContainer.appendChild(newFilter);
              searchBar.appendChild(tagIngredientContainer);
              const dishesSection = document.querySelector(".dishes_section");
              const dishesLength = dishesSection.children.length;
              for (let i = 0; i < dishesLength + 1; i++) {
                const element = dishesSection.children[0];
                if (element) {
                  element.remove();
                }
              }

              filteredSearchResultCopy = filteredSearchResultCopy.filter(
                (recipe) => {
                  return recipe.appliance.startsWith(item.innerHTML);
                }
              );
              newAppliance();
              async function newAppliance() {
                resultCombined();
              }
              applianceSearch.addEventListener("mouseup", () => {
                function testAppliance() {
                  var allAppliance = document.querySelector(".all_appliances");
                  var childApplianceLength = allAppliance.children.length;
                  for (let i = 0; i < childApplianceLength; i++) {
                    const element = allAppliance.firstChild;
                    element.remove();
                  }
                  filteredSearchResult.forEach((recipe) => {
                    const span = document.createElement("span");
                    span.innerText = recipe.appliance;
                    spanApplianceRecipes.push(span);
                    allAppliance.appendChild(span);
                  });
                  spanApplianceRecipes.forEach((item) => {
                    item.addEventListener("mouseup", () => {
                      const searchBar = document.querySelector(
                        ".search_bar_container"
                      );
                      const newFilter = document.createElement("div");
                      newFilter.setAttribute("class", "item_ingredients");
                      newFilter.setAttribute("id", 1);
                      const spanFilter = document.createElement("span");
                      spanFilter.innerText = item.innerHTML;
                      const iconFilter = document.createElement("icon");
                      iconFilter.setAttribute(
                        "class",
                        "fa-regular fa-circle-xmark"
                      );
                      newFilter.appendChild(spanFilter);
                      newFilter.appendChild(iconFilter);
                      const queryTagContainer =
                        document.querySelector(".tag_container");
                      queryTagContainer.appendChild(newFilter);
                      resultCombined();
                    });
                  });
                }
                testAppliance();
              });
            } else {
              queryTagContain = document.querySelector(".tag_container");
              childTagContainer = queryTagContain.children;
              queryTagContain.appendChild(newFilter);
              resultCombined();
            }
          });
        });
      }
    }

    async function displayUstenstile() {
      const { recipes } = await getRecipes();
      if (
        searchBarContainer.children.length >= 4 &&
        childTagContainer.length > 0
      ) {
        resultCombined();
      } else if (
        dishesSection.children.length === recipes.length + 1 ||
        dishesSection.children.length === recipes.length
      ) {
      } else {
        ustensileRecipes = [];
        for (let i = 0; i < childUstensileLength; i++) {
          const element = allUstensile.firstChild;
          element.remove();
        }
        let filteredSearchResultCopy = searchResultCopy.filter(function (
          ele,
          pos
        ) {
          return searchResultCopy.indexOf(ele) == pos;
        });

        filteredSearchResultCopy.forEach((element) => {
          element.ustensils.forEach((ustensile) => {
            ustensileRecipes.push(ustensile);
          });
        });
        const filteredUstensileRecipes = ustensileRecipes.filter(function (
          ele,
          pos
        ) {
          return ustensileRecipes.indexOf(ele) == pos;
        });

        filteredUstensileRecipes.forEach((item) => {
          const Span = document.createElement("span");
          Span.innerText = item;
          spanUstensileRecipes.push(Span);
          allUstensile.appendChild(Span);
        });

        spanUstensileRecipes.forEach((item) => {
          item.addEventListener("click", () => {
            const searchBar = document.querySelector(".search_bar_container");
            const newFilter = document.createElement("div");
            newFilter.setAttribute("class", "item_ustensile");
            newFilter.setAttribute("id", 3);
            const spanFilter = document.createElement("span");
            spanFilter.innerText = item.innerHTML;
            const iconFilter = document.createElement("icon");
            iconFilter.setAttribute("class", "fa-regular fa-circle-xmark");
            newFilter.appendChild(spanFilter);
            newFilter.appendChild(iconFilter);
            const queryTagContainer = document.querySelector(".tag_container");
            if (!queryTagContainer) {
              const tagUstensilContainer = document.createElement("div");
              tagUstensilContainer.setAttribute("class", "tag_container");
              tagUstensilContainer.appendChild(newFilter);
              searchBar.appendChild(tagUstensilContainer);
              const dishesSection = document.querySelector(".dishes_section");
              const dishesLength = dishesSection.children.length;
              for (let i = 0; i < dishesLength + 1; i++) {
                const element = dishesSection.children[0];
                if (element) {
                  element.remove();
                }
              }
              filteredSearchResultCopy = filteredSearchResultCopy.filter(
                (recipe) => {
                  return recipe.ustensils.some((ustensile) =>
                    ustensile.startsWith(item.innerHTML)
                  );
                }
              );
              resultCombined();
              ustensileSearch.addEventListener("mouseup", () => {
                function testUstensile() {
                  var allUstensile = document.querySelector(".all_ustensiles");
                  var childUstensileLength = allUstensile.children.length;
                  for (let i = 0; i < childUstensileLength; i++) {
                    const element = allUstensile.firstChild;
                    element.remove();
                  }
                  filteredSearchResultCopy.forEach((ustensiles) => {
                    ustensiles.forEach((ustensile) => {
                      const span = document.createElement("span");
                      span.innerText = ustensile;
                      spanUstensileRecipes.push(span);
                      allUstensile.appendChild(span);
                    });
                  });
                  spanUstensileRecipes.forEach((item) => {
                    item.addEventListener("mouseup", () => {
                      const searchBar = document.querySelector(
                        ".search_bar_container"
                      );
                      const newFilter = document.createElement("div");
                      newFilter.setAttribute("class", "item_ustensile");
                      newFilter.setAttribute("id", 3);
                      const spanFilter = document.createElement("span");
                      spanFilter.innerText = item.innerHTML;
                      const iconFilter = document.createElement("icon");
                      iconFilter.setAttribute(
                        "class",
                        "fa-regular fa-circle-xmark"
                      );
                      newFilter.appendChild(spanFilter);
                      newFilter.appendChild(iconFilter);
                      const queryTagContainer =
                        document.querySelector(".tag_container");
                      queryTagContainer.appendChild(newFilter);
                      resultCombined();
                    });
                  });
                }
                testUstensile();
              });
            } else {
              queryTagContain.appendChild(newFilter);
              const dishesSection = document.querySelector(".dishes_section");
              const dishesLength = dishesSection.children.length;
              for (let i = 1; i < dishesLength; i++) {
                const element = dishesSection.children[1];
                element.remove();
              }
              filteredSearchResultCopy = filteredSearchResultCopy.filter(
                (recipe) => {
                  return recipe.ingredients.some((ingredient) =>
                    ingredient.ingredient.startsWith(item.innerHTML)
                  );
                }
              );
              if ((noResultMsg.style.visibility = "visible")) {
                filteredSearchResult = [];
              }
              resultCombined();
              closeDropdownIngredient();
              function closeDropdownIngredient() {
                const dropdownContainer = document.querySelector(
                  ".search_dropdown_container--ingredients"
                );
                const all_ingredients =
                  document.querySelector(".all_ingredients");
                dropdownContainer.style.width = "9rem";
                searchIngredient.style.width = "9rem";
                searchContainer[0].setAttribute(
                  "class",
                  "search_container--ingredients"
                );
                searchIngredient.setAttribute("class", "search_ingredient");
                searchIngredient.value = "Ingredients";
                searchIngredient.addEventListener("click", () => {
                  searchIngredient.value = "";
                });
                all_ingredients.remove();
                searchContainer[0].children[1].setAttribute(
                  "class",
                  "fa-solid fa-angle-down"
                );
              }
            }
          });
        });

        const queryAllIgredients =
          document.querySelectorAll(".all_ingredients");
        if (queryAllIgredients.length > 1) {
          for (let i = 1; i < queryAllIgredients.length; i++) {
            const element = queryAllIgredients[i];
            for (let j = 0; j < element.children.length; j++) {
              while (element.children.length > 0) element.firstChild.remove();
            }
            element.remove();
          }
        }
      }
    }
  }
  setTimeout(RefreshTagItem, 0, 1);
}
