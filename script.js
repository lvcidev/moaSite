const menuBtn = document.getElementById("menuBtn")
const sidebar = document.getElementById("sidebar")

menuBtn.addEventListener("click", () => {

sidebar.classList.toggle("active")

})


const slides = document.querySelectorAll(".slide")

const next = document.querySelector(".next")
const prev = document.querySelector(".prev")

let index = 0

function showSlide(i){

slides.forEach(slide => slide.classList.remove("active"))

slides[i].classList.add("active")

}

next.addEventListener("click", () => {

index++

if(index >= slides.length){
index = 0
}

showSlide(index)

})

prev.addEventListener("click", () => {

index--

if(index < 0){
index = slides.length - 1
}

showSlide(index)

})


setInterval(()=>{

index++

if(index >= slides.length){
index = 0
}

showSlide(index)

},5000)