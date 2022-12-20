const $wr = document.querySelector('[data-wr]');

const ACTIONS = {
  DETAIL: 'detail',
  DELETE: 'delete',
};

fetch('https://cats.petiteweb.dev/api/single/KatlinBulycheva/show/')
  .then((res) => res.json())
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

    const $catWr = event.target.closest('[data-cat-id]');
    const catId = $catWr.dataset.catId;
    // console.log(catId);
    fetch(`https://cats.petiteweb.dev/api/single/KatlinBulycheva/delete/${catId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 200) {
          $catWr.remove();
        }
      });
  }
});

// Добавление кота
const $addCat = document.querySelector('[data-add]');
$addCat.addEventListener('click', () => {
  const $openModal = document.querySelector('[data-modal]');
  $openModal.classList.add('hystmodal--active');

  const $closeModal = document.querySelector('[data-close-add]');
  $closeModal.addEventListener('click', () => {
    $openModal.classList.remove('hystmodal--active');
  });

  const $applicantForm = document.querySelector('[data-form]');
  $applicantForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const resultCat = serializeForm($applicantForm);
    // console.log(JSON.stringify(resultCat));

    fetch('https://cats.petiteweb.dev/api/single/KatlinBulycheva/add/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultCat),
    })
      .then((response) => {
        if (response.status === 200) {
          $wr.insertAdjacentHTML('beforeend', getCatHTML(resultCat));
        }
      });
  });
});

function serializeForm(formNode) {
  const { elements } = formNode;
  // console.log(elements);
  const data = Array.from(elements)
    .filter((item) => !!item.name)
    .map((elem) => {
      const { name, value } = elem;
      return { name, value };
    });
  // console.log(data);
  const objCat = {};
  data.forEach((obj) => {
    if (obj.value === 'true') {
      objCat[obj.name] = true;
    } else if (obj.value === 'false') {
      objCat[obj.name] = false;
    } else if (parseInt(obj.value, 10)) {
      objCat[obj.name] = +obj.value;
    } else {
      objCat[obj.name] = obj.value;
    }
  });

  return objCat;
}
