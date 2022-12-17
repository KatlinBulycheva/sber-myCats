const $wr = document.querySelector('[data-wr]');

const ACTIONS = {
  DETAIL: 'detail',
  DELETE: 'delete',
};

fetch('https://cats.petiteweb.dev/api/single/KatlinBulycheva/show/')
  .then((res) => res.json()) // метод json() тоже возвращает промис
  .then((data) => {
    $wr.insertAdjacentHTML('afterbegin', data.map((cat) => getCatHTML(cat)).join(''));

    // console.log(data);
  });

function getCatHTML(cat) {
  return `
    <div class="card" data-cat-id="${cat.id}">
            <div class="card-img">
                <img src="${cat.image}" alt="${cat.name}"/>
            </div>
            <div class="card-body">
                <h5>${cat.name}</h5>
                <div class="card-button">
                  <button data-action='${ACTIONS.DETAIL}'><i class="fa-solid fa-circle-info"></i></button>
                  <button><i class="fa-solid fa-pen"></i></button>
                  <button data-action='${ACTIONS.DELETE}'><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
    </div> `;
}

$wr.addEventListener('click', (event) => {
  if (event.target.dataset.action === ACTIONS.DELETE || event.target.classList.contains('fa-trash-can') === true) {
    // console.log(event.target);
  }

  const $catWr = event.target.closest('[data-cat-id]');
  const catId = $catWr.dataset.catId;
  // console.log(catId);
  fetch(`https://cats.petiteweb.dev/api/single/KatlinBulycheva/delete/${catId}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (res.status === 200) {
        $catWr.remove();
      }
    });
});
