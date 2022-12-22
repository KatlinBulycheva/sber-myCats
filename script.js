const $wr = document.querySelector('[data-wr]');
const $modal = document.querySelector('[data-modal]');
const $modalContent = document.querySelector('.hystmodal__window');
const $templateContentCatAdd = document.getElementById('modal-add-cat');
const $templateContentCatView = document.getElementById('modal-view-cat');
const KEY_FOR_LS = 'keyCat for LS';
const ACTIONS = {
  DETAIL: 'detail',
  DELETE: 'delete',
  CHANGE: 'change',
};

// Вспомогательные переменные
const arrayOfItemTemplate = [];

function getCatHTML(cat) {
  return `
    <div class="card" data-cat-id="${cat.id}">
            ${getCatInnerHTML(cat)}
    </div> `;
}

function getCatInnerHTML(cat) {
  return `
    <div class="card-img">
        <img src="${cat.image}" alt="${cat.name}"/>
    </div>
    <div class="card-body">
        <h5>${cat.name}</h5>
        <p>${cat.description}</p>
        <div class="card-button">
          <button data-action='${ACTIONS.DETAIL}'><i class="fa-solid fa-circle-info"></i></button>
          <button data-action='${ACTIONS.CHANGE}'><i class="fa-solid fa-pen"></i></button>
          <button data-action='${ACTIONS.DELETE}'><i class="fa-solid fa-trash-can"></i></button>
        </div>
    </div>`;
}

fetch('https://cats.petiteweb.dev/api/single/KatlinBulycheva/show/')
  .then((response) => response.json())
  .then((data) => {
    $wr.insertAdjacentHTML('afterbegin', data.map((cat) => getCatHTML(cat)).join(''));
    // console.log(data);
  });

$wr.addEventListener('click', (event) => {
  if (event.target.dataset.action === ACTIONS.DELETE || event.target.classList.contains('fa-trash-can') === true) {
    // console.log(event.target);

    const $catWr = event.target.closest('[data-cat-id]'); // ПОВТОР
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

function closeModal(buttonCloseModal) {
  buttonCloseModal.addEventListener('click', () => {
    $modal.classList.remove('hystmodal--active');
    $modalContent.innerHTML = '';
  });
}

// Добавление кота
const $addCat = document.querySelector('[data-add]');

$addCat.addEventListener('click', () => {
  openModal();

  $modalContent.appendChild($templateContentCatAdd.content.cloneNode(true));

  closeModal(document.querySelector('[data-close-add]'));

  const dataFromLS = localStorage.getItem(KEY_FOR_LS); // тут строка
  const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS);
  // console.log({ preparedDataFromLS });

  const $applicantForm = document.querySelector('[data-form]');

  if (preparedDataFromLS) {
    Object.keys(preparedDataFromLS).forEach((key) => {
      $applicantForm[key].value = preparedDataFromLS[key];
    });
  }

  $applicantForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const resultCat = formData($applicantForm);
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

  $applicantForm.addEventListener('change', () => {
    const resultCat = formDataNew($applicantForm);

    localStorage.setItem(KEY_FOR_LS, JSON.stringify(resultCat));
  });
});

function formData(formNode) { // Собственное решение по сбору данных формы
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

function formDataNew(formNode) { // Решение препода по сбору данных формы
  const dataOfForm = Object.fromEntries(new FormData(formNode).entries());
  // console.log(dataOfForm);
  const resultCat = {
    ...dataOfForm,
    id: +dataOfForm.id,
    rate: +dataOfForm.rate,
    age: +dataOfForm.age,
    favorite: !!dataOfForm.favorite,
  };
  return resultCat;
}

// Просмотр кота
$wr.addEventListener('click', (event) => {
  if (event.target.dataset.action === ACTIONS.DETAIL || event.target.classList.contains('fa-circle-info') === true) {
    // console.log(event.target);

    const $catWr = event.target.closest('[data-cat-id]'); // ПОВТОР
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

        closeModal(document.querySelector('[data-close-view]'));
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

// Изменение кота
function changeCat(e) {
  if (e.target.dataset.action === ACTIONS.CHANGE || e.target.classList.contains('fa-pen') === true) {
    const $catWr = e.target.closest('[data-cat-id]'); // ПОВТОР
    const catId = $catWr.dataset.catId;

    fetch(`https://cats.petiteweb.dev/api/single/KatlinBulycheva/show/${catId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        $modalContent.appendChild($templateContentCatAdd.content.cloneNode(true));

        const $headForm = document.querySelector('.head-form h5');
        $headForm.innerHTML = '<i class="fa-solid fa-paw"></i>  Change cat';
        const $buttonForm = document.querySelector('[data-form] button');
        $buttonForm.innerText = 'Change';

        const $applicantForm = document.querySelector('[data-form]');

        Object.keys(data).forEach((key) => {
          $applicantForm[key].value = data[key];
        });

        openModal();

        closeModal(document.querySelector('[data-close-add]'));

        $applicantForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const resultCat = formDataNew($applicantForm);

          fetch(`https://cats.petiteweb.dev/api/single/KatlinBulycheva/update/${catId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultCat),
          })
            .then((response) => {
              if (response.status === 200) {
                const $currentCat = document.querySelector(`[data-cat-id="${resultCat.id}"]`);
                $currentCat.innerHTML = `${getCatInnerHTML(resultCat)}`;
                $modal.classList.remove('hystmodal--active');
                $modalContent.innerHTML = '';
              }
            });
        });
      });
  }
}

$wr.addEventListener('click', changeCat);
