(function () {
  // Make entire program card clickable, but ignore clicks on the button itself
  const cards = document.querySelectorAll(".program-card");
  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // If the clicked element is an <a> tag or inside an <a>, let the browser handle it normally.
      if (e.target.closest("a")) return;

      // Otherwise, navigate to the URL stored in data-url
      const url = this.dataset.url;
      if (url) {
        window.location.href = url;
      }
    });
  });
})();

window.addEventListener('scroll', function() {
  if (window.scrollY > 100) {
    document.body.classList.add('nav-scrolled');
  } else {
    document.body.classList.remove('nav-scrolled');
  }
});