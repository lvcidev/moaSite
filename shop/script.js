const cartBtn = document.getElementById("cartBtn")
const cartSidebar = document.getElementById("cartSidebar")
const cartItems = document.getElementById("cartItems")
const cartCount = document.getElementById("cartCount")

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

let cart = JSON.parse(localStorage.getItem("cart")) || []

cartBtn.addEventListener("click", () => {

cartSidebar.classList.toggle("active")

})

function addToCart(product){

cart.push(product)

saveCart()

renderCart()

}

function saveCart(){

localStorage.setItem("cart", JSON.stringify(cart))

}

function renderCart(){

cartItems.innerHTML = ""

cart.forEach(item => {

const div = document.createElement("div")

div.classList.add("cart-item")

div.innerText = item

cartItems.appendChild(div)

})

cartCount.innerText = cart.length

}

renderCart()