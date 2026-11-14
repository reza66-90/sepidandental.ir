/* ================================
   مقالات تصویری سپیدان
================================ */

function openImplantArticle(imageSrc) {

  const modal = document.getElementById("implantArticleModal");
  const image = document.getElementById("implantArticleLargeImage");

  if (!modal || !image) return;

  image.src = imageSrc;

  modal.classList.add("active");

  document.body.style.overflow = "hidden";
}


function closeImplantArticle(event) {

  if (event) {
    event.stopPropagation();
  }

  const modal = document.getElementById("implantArticleModal");
  const image = document.getElementById("implantArticleLargeImage");

  if (!modal) return;

  modal.classList.remove("active");

  if (image) {
    image.src = "";
  }

  document.body.style.overflow = "";
}


/* بستن با دکمه ESC */

document.addEventListener("keydown", function(event) {

  if (event.key === "Escape") {
    closeImplantArticle();
  }

});
document.addEventListener("DOMContentLoaded", function () {

  const implantSwiperElement = document.querySelector(".implantSwiper");

  if (!implantSwiperElement) return;

  new Swiper(".implantSwiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,

    navigation: {
      nextEl: ".implant-next",
      prevEl: ".implant-prev",
    },

    pagination: {
      el: ".implant-pagination",
      clickable: true,
    },

    observer: true,
    observeParents: true,

    direction: "horizontal",

    breakpoints: {
      0: {
        slidesPerView: 1
      },

      768: {
        slidesPerView: 1
      }
    }

  });

});