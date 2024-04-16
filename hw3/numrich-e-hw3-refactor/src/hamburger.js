// Get tabs working
const init = () => {
    const appTab = document.querySelector("#app-tab");
    const aboutTab = document.querySelector("#about-tab");

    appTab.addEventListener('click', () => {
        aboutTab.classList.remove('is-active');
        appTab.classList.add('is-active');
    });
    aboutTab.addEventListener('click', () => {
        appTab.classList.remove('is-active');
        aboutTab.classList.add('is-active');
    });

    const burgerIcon = document.querySelector("#burger");
    const navbarMenu = document.querySelector("#nav-links");

    burgerIcon.addEventListener("click", () => {
        navbarMenu.classList.toggle("is-active");
    });
}

init();