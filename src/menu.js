export default function loadMenu() {
  const content = document.getElementById("content");
  const menuSections = ["MAIN", "DRINKS", "DESSERTS"];
  const elements = createCarouselElements();

  addClassesToElements(elements);
  createMenuSections(elements, menuSections);
  assembleCarousel(elements, content);
  initializeCarousel(elements);

  const preview = document.createElement("div");
  preview.classList.add("preview");
  content.appendChild(preview);

  const menuCategories = content.querySelectorAll(".carousel__item");
  const mainFoodNames = [
    `YUJI ITADORI 
KATSU CURRY`,
    `MEGUMI FUSHIGURO
KANGO AN'EITEI BURGER`,
    `NOBARA KUGISAKI
AGLIO OLIO`,
    `MAKI ZEN'IN
AYAM PENYET SAMBAL IJO`,
    `TOGE INUMAKI
ONIGIRI SET`,
  ];

  const drinksNames = [
    `SATORU GOJO
KYOSHIKI 'MURASAKI'`,
    `RYOMEN SUKUNA
BERRY BOOZE`,
    `MAHITO
BLUE OCEAN`,
    `NANAMI KENTO
BLACK SHAKE`,
    `SUGURU GETO
'UZUMAKI'`,
  ];

  const dessertsNames = [
    `RYOMEN SUKUNA
FINGER PARFAIT`,
    `PANDA TOAST`,
  ];

  menuCategories.forEach((item, index) => {
    if (index === 0) {
      mainFoodNames.forEach((food, innerIndex) => {
        const button = document.createElement("button");
        button.textContent = mainFoodNames[innerIndex];
        menuCategories[index].appendChild(button);
      });
    }

    if (index === 1) {
      drinksNames.forEach((food, innerIndex) => {
        const button = document.createElement("button");
        button.textContent = drinksNames[innerIndex];
        menuCategories[index].appendChild(button);
      });
    }

    if (index === 2) {
      dessertsNames.forEach((food, innerIndex) => {
        const button = document.createElement("button");
        button.textContent = dessertsNames[innerIndex];
        menuCategories[index].appendChild(button);
      });
    }
  });
}

function createCarouselElements() {
  return {
    carouselDiv: document.createElement("div"),
    leftButton: document.createElement("button"),
    trackContainer: document.createElement("div"),
    carouselList: document.createElement("ul"),
    rightButton: document.createElement("button"),
    carouselNav: document.createElement("div"),
  };
}

function addClassesToElements(elements) {
  const classMap = {
    carouselDiv: ["carousel"],
    leftButton: ["carousel__button", "carousel__button--left"],
    trackContainer: ["carousel__track-container"],
    carouselList: ["carousel__track"],
    rightButton: ["carousel__button", "carousel__button--right"],
    carouselNav: ["carousel__nav"],
  };

  Object.entries(classMap).forEach(([element, classes]) => {
    elements[element].classList.add(...classes);
  });
}

function createMenuSections(elements, menuSections) {
  menuSections.forEach((title) => {
    const li = document.createElement("li");
    li.classList.add("carousel__slide");

    const fieldset = createFieldset(title);
    fieldset.classList.add("carousel__item");
    li.appendChild(fieldset);
    elements.carouselList.appendChild(li);

    const button = document.createElement("button");
    button.textContent = title;
    button.classList.add("carousel__indicator");
    elements.carouselNav.appendChild(button);
  });
}

function createFieldset(title) {
  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.textContent = title;
  fieldset.appendChild(legend);
  return fieldset;
}

function assembleCarousel(elements, container) {
  elements.trackContainer.appendChild(elements.carouselList);
  elements.carouselDiv.append(
    elements.leftButton,
    elements.trackContainer,
    elements.rightButton,
    elements.carouselNav
  );
  container.appendChild(elements.carouselDiv);
}

function initializeCarousel(elements) {
  const slides = Array.from(elements.carouselList.children);
  const menus = Array.from(elements.carouselNav.children);
  const slideWidth = slides[0].getBoundingClientRect().width;

  setupInitialState(elements);
  setupSlidePositions(slides, slideWidth);
  setupEventListeners(elements, slides, menus);
}

function setupInitialState(elements) {
  elements.carouselList.children[0].classList.add("current-slide");
  elements.carouselNav.children[0].classList.add("current-slide");
  elements.leftButton.classList.add("is-hidden");
}

function setupSlidePositions(slides, slideWidth) {
  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + "px";
  });
}

function setupEventListeners(elements, slides, menus) {
  elements.leftButton.addEventListener("click", () =>
    handleNavigation("prev", elements, slides)
  );
  elements.rightButton.addEventListener("click", () =>
    handleNavigation("next", elements, slides)
  );
  elements.carouselNav.addEventListener("click", (e) =>
    handleMenuClick(e, elements, slides, menus)
  );
}

function handleNavigation(direction, elements, slides) {
  const currentSlide = elements.carouselList.querySelector(".current-slide");
  const currentMenu = elements.carouselNav.querySelector(".current-slide");
  const targetSlide =
    direction === "prev"
      ? currentSlide.previousElementSibling
      : currentSlide.nextElementSibling;
  const targetMenu =
    direction === "prev"
      ? currentMenu.previousElementSibling
      : currentMenu.nextElementSibling;
  const targetIndex = slides.findIndex((slide) => slide === targetSlide);

  updateCarousel(
    elements,
    slides,
    currentSlide,
    targetSlide,
    currentMenu,
    targetMenu,
    targetIndex
  );
}

function handleMenuClick(e, elements, slides, menus) {
  const targetMenu = e.target.closest("button");
  if (!targetMenu) return;

  const currentSlide = elements.carouselList.querySelector(".current-slide");
  const currentMenu = elements.carouselNav.querySelector(".current-slide");
  const targetIndex = menus.findIndex((menu) => menu === targetMenu);
  const targetSlide = slides[targetIndex];

  updateCarousel(
    elements,
    slides,
    currentSlide,
    targetSlide,
    currentMenu,
    targetMenu,
    targetIndex
  );
}

function updateCarousel(
  elements,
  slides,
  currentSlide,
  targetSlide,
  currentMenu,
  targetMenu,
  targetIndex
) {
  elements.carouselList.style.transform = `translateX(-${targetSlide.style.left})`;
  updateActiveElements(currentSlide, targetSlide, currentMenu, targetMenu);
  updateNavigationButtons(elements, slides, targetIndex);
}

function updateActiveElements(
  currentSlide,
  targetSlide,
  currentMenu,
  targetMenu
) {
  [currentSlide, currentMenu].forEach((el) =>
    el.classList.remove("current-slide")
  );
  [targetSlide, targetMenu].forEach((el) => el.classList.add("current-slide"));
}

function updateNavigationButtons(elements, slides, targetIndex) {
  const isFirst = targetIndex === 0;
  const isLast = targetIndex === slides.length - 1;

  elements.leftButton.classList.toggle("is-hidden", isFirst);
  elements.rightButton.classList.toggle("is-hidden", isLast);
}
