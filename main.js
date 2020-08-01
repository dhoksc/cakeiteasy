//image slider
fetch(`http://api.dev.cakeiteasy.no/api/store/bakeries/?country_code=no`).then(response => {
    return response.json()
})
    .then(data => {
        createImageSlider(data);
    });

//location list
fetch(`http://api.dev.cakeiteasy.no/api/store/cities/?country_code=no&most_popular=true`).then(response => {
    return response.json()
})
    .then(locData => {
        placeCityArr(locData);
    });

// variables

let cityArr = [];
let btnForward = document.querySelector("#forward");
let btnBackward = document.querySelector("#backward");

//functions
//receive images and create img for slider

const createImageSlider = (data) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].picture !== null) {
            let sliderImages = document.querySelector("#sliderImages");
            let imgLi = document.createElement('li');
            sliderImages.appendChild(imgLi);
            let img = document.createElement('img');
            imgLi.appendChild(img);
            img.src = 'http://api.dev.cakeiteasy.no/api/store/images/' + data[i].picture + '/?size=small_url&compress_type=webp';
            img.alt = 'bakery logo';
        }
    }
};

// get locations info and create array

const placeCityArr = (locData) => {
    for (let i = 0; i < locData.length; i++) {
        cityArr.push(locData[i].name);
        let columns = document.getElementById('columns');
        let town = document.createElement('p');
        town.textContent = cityArr[i];
        columns.appendChild(town);
    }
};

//slider buttons

btnForward.addEventListener("click", () => {
    let item = document.querySelector(`li`);
    let itemWidth = (getComputedStyle(item).getPropertyValue(`width`));
    let integer = parseInt(itemWidth, 10);
    let gallery = document.querySelector("#sliderImages");
    gallery.scrollLeft += integer;
});

btnBackward.addEventListener("click", () => {
    let item = document.querySelector(`li`);
    let itemWidth = (getComputedStyle(item).getPropertyValue(`width`));
    let integer = parseInt(itemWidth, 10);
    let gallery = document.querySelector("#sliderImages");
    gallery.scrollLeft -= integer;
});