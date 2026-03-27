const currentPage = document.body.dataset.page;

document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  const isHome = currentPage === "home" && href === "index.html";
  const matches = href === `${currentPage}.html`;

  if (isHome || matches) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});
