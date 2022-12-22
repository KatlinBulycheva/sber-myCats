const $wr = document.querySelector('[data-wr]');
const $modal = document.querySelector('[data-modal]');
const $modalContent = document.querySelector('.hystmodal__window');
const $templateContentCatAdd = document.getElementById('modal-add-cat');
const $templateContentCatView = document.getElementById('modal-view-cat');

const arrayOfItemTemplate = [];

const ACTIONS = {
  DETAIL: 'detail',
  DELETE: 'delete',
};

fetch('https://cats.petiteweb.dev/api/single/KatlinBulycheva/show/')
  .then((response) => response.json())
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

function openModal() {
  $modal.classList.add('hystmodal--active');
}

function closeModal() {
  $modal.classList.remove('hystmodal--active');
  $modalContent.innerHTML = '';
}

// Добавление кота
const $addCat = document.querySelector('[data-add]');

$addCat.addEventListener('click', () => {
  openModal();

  $modalContent.appendChild($templateContentCatAdd.content.cloneNode(true));

  const $closeModal = document.querySelector('[data-close-add]');
  $closeModal.addEventListener('click', () => {
    closeModal();
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
          $wr.insertAdjacentHTML('afterbegin', getCatHTML(resultCat));
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

// Просмотр кота
$wr.addEventListener('click', (event) => {
  if (event.target.dataset.action === ACTIONS.DETAIL || event.target.classList.contains('fa-circle-info') === true) {
    // console.log(event.target);

    const $catWr = event.target.closest('[data-cat-id]');
    const catId = $catWr.dataset.catId;
    // console.log(catId);

    fetch(`https://cats.petiteweb.dev/api/single/KatlinBulycheva/show/${catId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        changeItemsView(data);
        // console.log(arrayOfItemTemplate);
        $modalContent.appendChild($templateContentCatView.content.cloneNode(true));
        openModal();

        const $closeModal = document.querySelector('[data-close-view]');
        $closeModal.addEventListener('click', () => {
          closeModal();
        });
      });
  }
});

function changeItemsView(data) {
  const dataItem = Object.keys(data);
  for (let i = 0; i < dataItem.length; i++) {
    if (dataItem[i] === 'image') {
      arrayOfItemTemplate[i] = $templateContentCatView.content.querySelector(`[data-${dataItem[i]}]`);
      arrayOfItemTemplate[i].innerHTML = `<img src="${data[dataItem[i]]}">`;
    } else {
      arrayOfItemTemplate[i] = $templateContentCatView.content.querySelector(`[data-${dataItem[i]}]`);
      arrayOfItemTemplate[i].innerHTML = `${data[dataItem[i]]}`;
    }
  }
}
