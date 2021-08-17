'use strict';


let btn = document.getElementById('btn');
let leftImg = document.getElementById('leftImg');
let CenterImg = document.getElementById('CenterImg');
let rightImg = document.getElementById('rightImg');
let result = document.getElementById('results');
let busImages = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg'];
let maxAttempts = 25;
let attempt = 1;
let products = [];
let PNames = [];
let votes = [];
let times = [];

function ProductImage(productName) {
    this.PName = productName.split('.')[0];
    this.PImg = `img/${productName}`;
    this.votes = 0;
    this.times = 0;
    products.push(this);
    PNames.push(this.PName);
}

for (let i = 0; i < busImages.length; i++) {
    new ProductImage(busImages[i]);
}

console.log(products);
function randomImage() {
    return Math.floor(Math.random() * products.length);
}


let leftIndex;
let CenterIndex;
let rightIndex;
let Tleft = -1;
let Tcenter = -1;
let Tright = -1;
function renderImg() {
    leftIndex = randomImage();
    CenterIndex = randomImage();
    rightIndex = randomImage();
    while (leftIndex === Tleft || leftIndex === Tcenter || leftIndex === Tright) {
        leftIndex = randomImage();
    }
    while(CenterIndex === leftIndex || CenterIndex === Tleft || CenterIndex === Tcenter || CenterIndex === Tright){
        CenterIndex = randomImage();
    }
    while(rightIndex === CenterIndex || rightIndex === leftIndex || rightIndex === Tleft || rightIndex === Tcenter || rightIndex === Tright){
        rightIndex = randomImage();
    }
    Tleft = leftIndex;
    Tcenter = CenterIndex;
    Tright = rightIndex;
    leftImg.setAttribute('src', products[leftIndex].PImg);
    CenterImg.setAttribute('src', products[CenterIndex].PImg);
    rightImg.setAttribute('src', products[rightIndex].PImg);
    products[leftIndex].times++;
    products[CenterIndex].times++;
    products[rightIndex].times++;
}
renderImg();

leftImg.addEventListener('click', clickHandler);
CenterImg.addEventListener('click', clickHandler);
rightImg.addEventListener('click', clickHandler);

function clickHandler(event) {
    if (attempt <= maxAttempts) {
        let clickedImage = event.target.id;
        if (clickedImage === 'leftImg') {
            products[leftIndex].votes++;
        } else if (clickedImage === 'rightImg') {
            products[rightIndex].votes++;
        } else if(clickedImage === 'CenterImg'){
            products[CenterIndex].votes++;
        }
        renderImg();
        console.log(products);
        attempt++;

    } else {

        leftImg.removeEventListener('click', clickHandler);
        CenterImg.removeEventListener('click', clickHandler);
        rightImg.removeEventListener('click', clickHandler);


    }
}

function saveToLocalStorage() {
    let data = JSON.stringify(products);
    localStorage.setItem('products', data);
}
function readFromLocalStorage() {
    let stringObj = localStorage.getItem('products');
    let normalObj = JSON.parse(stringObj);

    if (normalObj) {
        products = normalObj;
        renderImg();
    }
}
readFromLocalStorage();

btn.addEventListener('click', final);
function final(){
    if(attempt === maxAttempts +1){
        for (let i = 0; i < products.length; i++) {
            let liEl = document.createElement('li');
            result.appendChild(liEl);
            liEl.textContent = `${products[i].PName} had ${products[i].votes} votes and was seen ${products[i].times} times.`;
            votes.push(products[i].votes);
            times.push(products[i].times);
        }
        btn.removeEventListener('click', final);
        renderImg();
        saveToLocalStorage();

    }
    chartRender();
}
function chartRender(){
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: PNames,
            datasets: [{
                label: '# of votes',
                data: votes,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }, {
                label: '# of times',
                data: times,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1

            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


