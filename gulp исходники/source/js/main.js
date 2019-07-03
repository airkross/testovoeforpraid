//бургер
document.getElementById('menu-btn').onclick = function () {
    document.getElementById('menu').classList.toggle('block');
};

//скролл по якорям
var linkNav = document.querySelectorAll('.menu-item > [href^="#"]');
var V = 0.3;
for (var i = 0; i < linkNav.length; i++) {
    linkNav[i].addEventListener('click', function (e) {
        e.preventDefault();
        var w = window.pageYOffset,
            hash = this.href.replace(/[^#]*(.*)/, '$1');
        t = document.querySelector(hash).getBoundingClientRect().top,
            start = null;
        requestAnimationFrame(step);
        function step(time) {
            if (start === null) start = time;
            var progress = time - start,
                r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));
            window.scrollTo(0, r);
            if (r != w + t) {
                requestAnimationFrame(step);
            } else {
                location.hash = hash;
            }
        }
    }, false);
}
//ajax
function getInfo() {
    var arrImg = [];
    var arrTitles = [];
    fetch('https://jsonplaceholder.typicode.com/photos')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (var i = 0; i < 6; i++) {
                var rand = Math.floor(Math.random() * (data.length - 1)) + 1;
                arrTitles[i] = data[rand]['title'];
                arrImg[i] = data[rand]['thumbnailUrl'];
            }
            var images = document.querySelectorAll('.card-img img');
            var titles = document.querySelectorAll('.card-title h2');
            for (var i = 0; i < images.length; i++) {
                images[i].setAttribute('src', arrImg[i]);
                titles[i].innerHTML = arrTitles[i];
            }
        });
}
