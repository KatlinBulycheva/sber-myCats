const $wr = document.querySelector('[data-wr]');

fetch('https://cats.petiteweb.dev/api/single/KatlinBulycheva/show/')
  .then((res) => res.json()) // метод json() тоже возвращает промис
  .then((data) => {
    $wr.insertAdjacentHTML('afterbegin', data.map((cat) => getCatHTML(cat)).join(''));

    console.log(data);
  });

function getCatHTML(cat) {
  return `
    <div class="card">
            <div class="card-img">
                <img src="${cat.image}" alt="${cat.name}"/>
            </div>
            <div class="card-body">
                <h5 class="card-title">${cat.name}</h5>
                <button><i class="fa-solid fa-eye"></i></button>
                <button><i class="fa-solid fa-pen-to-square"></i></button>
                <button><i class="fa-solid fa-trash-can"></i></button>
            </div>
    </div> `;
}
