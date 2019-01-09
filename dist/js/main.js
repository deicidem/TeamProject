window.addEventListener('DOMContentLoaded', function () {
  let burger = document.querySelector('.burger');
  let menu = document.querySelector('.header-nav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('cross');
    menu.classList.toggle('header-nav_active');
  });

  let loadmore = document.querySelector('.loadmore'),
    morePosts = document.querySelector('.more');
  morePosts.classList.add('hidden');

  loadmore.addEventListener('click', function () {
    let height = document.querySelector('.posts').clientHeight - 100;
    this.style.display = 'none';
    animate({
      duration: 2000,
      timing: makeEaseInOut(quad),
      draw: function (progress) {
        morePosts.style.height = progress * height + 'px';
        window.scrollBy(0, height);
      }
    });
  });

  function quad(progress) {
    return Math.pow(progress, 2);
  }

  function makeEaseInOut(timing) {
    return function (timeFraction) {
      if (timeFraction < 0.5)
        return timing(2 * timeFraction) / 2;
      else
        return (2 - timing(2 * (1 - timeFraction))) / 2;
    };
  }
  menu.addEventListener('click', (event) => {
    let target = event.target;
    event.preventDefault();
    if (target.tagName == 'A') scroll(target);
  });

  function scroll(target) {
    let scrollTo = document.querySelector(target.getAttribute('href')).offsetTop - window.pageYOffset;
    window.scrollBy({
      top: scrollTo,
      left: 0,
      behavior: 'smooth'
    });
  }


function animate(options) {

  var start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction от 0 до 1
    let timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) timeFraction = 1;

    // текущее состояние анимации
    let progress = options.timing(timeFraction);

    options.draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}

let message = {};
  message.loading = "Загрузка...";
  message.success = '&#10004;';
  message.failure = "Что то пошло не так...";
  let form = document.getElementById('form'),
    input = form.getElementsByTagName('input'),
    statusMessage = document.createElement('div');
    statusMessage.classList.add('status');
  
  function ajaxRequest(event){
    event.preventDefault();
    statusMessage.innerHTML = message.success;
    this.insertBefore(statusMessage, this.children[0]);

    // AJAX
    let request = new XMLHttpRequest();
    request.open('POST', 'dist/php/server.php');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    let formData = new FormData(this);

    request.send(formData);

    // request.onreadystatechange = () => {
    //   if (request.readyState < 4) {
    //     statusMessage.innerHTML = message.loading;
    //   } else if (request.readyState === 4) {
    //     if (request.status == 200 && request.status < 300) {
    //       statusMessage.innerHTML = message.success;
    //       // Добавляем контент
    //     } else {
    //       statusMessage.innerHTML = message.error;
    //     }
    //   }
    // };
    for (let i = 0; i < input.length; i++) {
      input[i].value = '';
      // Очищаем Поля Ввода
    }
  }
  form.addEventListener('submit', ajaxRequest);
});