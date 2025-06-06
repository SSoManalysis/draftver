/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2000,
    delay: 200,
});

sr.reveal(".home p", {});
sr.reveal(".rq", { delay: 700 });
sr.reveal("#allComposers", { interval: 200 });

/*===== SCROLLAMA =====*/
var main = document.querySelector("main");
var scrolly = main.querySelector("#scrolly");
var sticky = scrolly.querySelector(".sticky-thing");
var article = scrolly.querySelector("article");
var steps = article.querySelectorAll(".step");

var scroller = scrollama();

function handleStepEnter(response) {
    var el = response.element;
    steps.forEach((step) => step.classList.remove("is-active"));
    el.classList.add("is-active");
    sticky.querySelector("p").innerText = el.dataset.step;
}

function init() {
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.33,
            debug: false,
        })
        .onStepEnter(handleStepEnter);

    window.addEventListener("resize", scroller.resize);
}

init();

