let elInput = document.querySelector(".search-input"),
  elForm = document.querySelector("#form"),
  elWrapperCards = document.querySelector(".wrapper"),
  elTemplateCard = document.querySelector("#card-template").content,
  elModal = document.querySelector("#exampleModal"),
  elTemplateBookmark = document.querySelector("#bookmark-template").content,
  elBookmark_wrapper = document.querySelector("#bookmark_wrapper"),
  elBooksNumber = document.querySelector("#books_number");

elForm.addEventListener("submit", (event) => {
  event.preventDefault();
  (async function () {
    let responce = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${elInput.value}`
    );
    let result = await responce.json();
    let data = result.items;

    renderingData(data, elWrapperCards);
  })();
});

function renderingData(array, place) {
  place.innerHTML = null;

  let elFragment = document.createDocumentFragment();

  array.forEach((item) => {
    let cloneCard = elTemplateCard.cloneNode(true);

    cloneCard.querySelector(".card-img-top").src =
      item.volumeInfo.imageLinks.smallThumbnail;
    cloneCard.querySelector("#card-title").textContent = item.volumeInfo.title;
    cloneCard.querySelector("#box-text").textContent = item.volumeInfo.authors;
    cloneCard.querySelector("#box-year").textContent =
      item.volumeInfo.publishedDate;
    cloneCard.querySelector("#read-btn").href = item.volumeInfo.previewLink;
    cloneCard.querySelector("#moreInfo-btn").dataset.moreInfoBtnId = item.id;
    cloneCard.querySelector("#bookmarkBtn").dataset.bookmarkBtnId = item.id;
    elFragment.appendChild(cloneCard);
  });
  place.appendChild(elFragment);
  elBooksNumber.textContent = array.length;
}

let bookmarkedarray = JSON.parse(localStorage.getItem("bookmarkedarray")) || [];
renderingBookmark(bookmarkedarray, elBookmark_wrapper);

elWrapperCards.addEventListener("click", (event) => {
  let bookmarkBtnId = event.target.dataset.bookmarkBtnId;

  if (bookmarkBtnId) {
    (async function () {
      let responce = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookmarkBtnId}`
      );
      let data = await responce.json();
      let deleteItem = bookmarkedarray.find((item) => item.id == data.id);
      let indexItem = bookmarkedarray.indexOf(deleteItem);
      if (indexItem == -1) {
        bookmarkedarray.push(data);
        localStorage.setItem(
          "bookmarkedarray",
          JSON.stringify(bookmarkedarray)
        );
        renderingBookmark(bookmarkedarray, elBookmark_wrapper);
      }
    })();
  }
});

function renderingBookmark(array, place) {
  place.innerHTML = null;

  let bookmarkFragment = document.createDocumentFragment();

  array.forEach((item) => {
    let cloneBookmarkTemp = elTemplateBookmark.cloneNode(true);
    cloneBookmarkTemp.querySelector("#book_title").textContent =
      item.volumeInfo.title;
    cloneBookmarkTemp.querySelector("#book_author").textContent =
      item.volumeInfo.authors;
    cloneBookmarkTemp.querySelector("#delete_icon").dataset.deleteIconId =
      item.id;
    cloneBookmarkTemp.querySelector("#read_btn_icon").href =
      item.volumeInfo.previewLink;
    bookmarkFragment.appendChild(cloneBookmarkTemp);
  });
  place.appendChild(bookmarkFragment);
}
elBookmark_wrapper.addEventListener("click", (e) => {
  let deleteIconId = e.target.dataset.deleteIconId;

  if (deleteIconId) {
    let deleteItem = bookmarkedarray.find((item) => item.id == deleteIconId);
    let indexItem = bookmarkedarray.indexOf(deleteItem);
    bookmarkedarray.splice(indexItem, 1);
    localStorage.setItem("bookmarkedarray", JSON.stringify(bookmarkedarray));
    renderingBookmark(bookmarkedarray, elBookmark_wrapper);
  }
});

elWrapperCards.addEventListener("click", (event) => {
  let infoBtnId = event.target.dataset.moreInfoBtnId;

  if (infoBtnId) {
    (async function () {
      let responce = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${infoBtnId}`
      );
      let result = await responce.json();
      let data = result.volumeInfo;

      elModal.querySelector("#img_modal").src = data.imageLinks.thumbnail;
      elModal.querySelector(".modal_info").textContent = data.description;
      elModal.querySelector("#modal_author").textContent = data.authors;
      elModal.querySelector("#modal_categories").textContent =
        data.categories || "-";
      elModal.querySelector("#modal_year").textContent =
        data.publishedDate.slice(0, 4);
      elModal.querySelector("#modal_publisher").textContent = data.publisher;
      elModal.querySelector("#modal_pgCount").textContent = data.pageCount;
      elModal.querySelector(".modal-title").textContent = data.title;
      elModal.querySelector("#modal_read_btn").href = data.previewLink;
    })();
  }
});
