'use strict';

const image = document.querySelector('#image');

//applying filters
const filters = document.querySelector('.filters');
function rangeHandler (range) {
    range.addEventListener('input', (e) =>{
        let filter = image.style.filter ?? "";
        let regex = new RegExp('(?<=' + e.target.getAttribute('name') + '\\().*?(?=\\);?)', 'gm');
        if (regex.test(filter))
        {
            image.style.filter = filter.replace(regex, `${e.target.value}${e.target.getAttribute('data-sizing')}`);
        }
        else
        {
            image.style.filter += `${e.target.getAttribute('name')}(${e.target.value}${e.target.getAttribute('data-sizing')})`
        }
        e.target.nextElementSibling.textContent = e.target.value;
    });
};
rangeHandler(filters);

//reset
const resetBtn = document.querySelector('.btn-reset');
function resetFilters () {
    image.removeAttribute('style');
    filters.querySelectorAll('input[type=range]').forEach((input) => {
        input.value = input.getAttribute('value');
        input.nextElementSibling.textContent = input.getAttribute('value');
  })
};
resetBtn.addEventListener('click', resetFilters);

//fullscreen
const fullscreenBtn = document.querySelector('.fullscreen');

fullscreenBtn.addEventListener('click', () => {
    (document.fullscreenElement) ? document.exitFullscreen() : document.body.requestFullscreen();
});

//downloading images

const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))

let currentImage = 0;
const baseUrl = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
document.querySelector('.btn-next').addEventListener('click', (e) => {
    let currentUrl = baseUrl;
    let currentTime = new Date();
    if (currentTime >= 6 && currentTime.getHours() <=12)
        currentUrl += 'morning/'
    else if (currentTime >= 12 && currentTime.getHours() <= 18)
        currentUrl += 'day/'
    else if (currentTime >= 18 && (currentTime.getHours() <= 23 && currentTime.getMinutes() <= 59))
        currentUrl += 'evening/'
    else if (currentTime >= 0 && currentTime.getHours() <= 6)
        currentUrl += 'night/'
    currentImage = (currentImage >= 20) ? 1 : currentImage + 1;
    currentUrl += currentImage.toString().padStart(2, '0') + '.jpg';
    toDataURL(currentUrl)
        .then(data => image.setAttribute('src', data));
});


//uploading images
document.querySelector('.btn-load--input')
    .addEventListener('change', (e) =>{
        image.src = URL.createObjectURL(e.target.files[0]);
        e.target.value = '';
    });

//download image with filters
document.querySelector('.btn-save').addEventListener('click', (e) => {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = image.getBoundingClientRect().width;
    canvas.height = image.getBoundingClientRect().height;
    context.filter = image.style.filter;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    let link = document.createElement('a');
    link.download = "download.jpg";
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
}, false);
