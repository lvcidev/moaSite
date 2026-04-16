(() => {

//////////////////////////////////////////////////
// MENU BURGER
//////////////////////////////////////////////////

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

if(menuBtn && sidebar){

    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });

}

//////////////////////////////////////////////////
// SLIDER
//////////////////////////////////////////////////

const slides = document.querySelectorAll(".slide");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

if(slides.length > 0){

    let index = 0;

    function showSlide(i){

        slides.forEach(slide =>
            slide.classList.remove("active")
        );

        slides[i].classList.add("active");
    }

    if(next){
        next.addEventListener("click", () => {

            index++;
            if(index >= slides.length) index = 0;

            showSlide(index);
        });
    }

    if(prev){
        prev.addEventListener("click", () => {

            index--;
            if(index < 0) index = slides.length - 1;

            showSlide(index);
        });
    }

    setInterval(()=>{

        index++;
        if(index >= slides.length) index = 0;

        showSlide(index);

    },5000);

}

})();