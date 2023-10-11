const cart = [];

fetch("https://striveschool-api.herokuapp.com/books")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Errore");
    }
  })
  .then((data) => {
    const container = document.getElementById("book-container");
    data.forEach((book) => {
      const newCol = document.createElement("div");
      newCol.classList.add("col-4");
      newCol.classList.add("col-md-3");
      const newBook = document.createElement("div");
      newBook.classList.add("card");

      newBook.innerHTML = new Card(
        book.img,
        book.title,
        book.price,
        book.asin
      ).toString();
      newCol.appendChild(newBook);
      container.appendChild(newCol);
      //codice per eliminare una card dalla pagina
      document
        .getElementById(`discard-${book.asin}`)
        .addEventListener("click", function (e) {
          //e.target.parentElement.parentElement.parentElement.remove();
          //style.display = "none";
          e.target.closest(".col-4").remove(); //versione alternativa ma non va...
        });
      //codice per aggiungere al carrello
      document
        .getElementById(`buy-${book.asin}`)
        .addEventListener("click", function (e) {
          if (!containsBook(cart, book.asin)) {
            cart.push(book);
            refreshCart();
          }
        });
    });
  })
  .catch((err) => {
    console.error(err);
  });

function containsBook(arr, asin) {
  let res = false;
  arr.forEach((e) => {
    if (e.asin === asin) {
      res = true;
    }
  });
  return res;
}

function refreshCart() {
  const carrello = document.getElementById("cart");
  carrello.innerHTML = "";
  cart.forEach((book) => {
    const li = document.createElement("li");
    li.classList.add("d-flex");
    li.classList.add("my-2");
    li.classList.add("align-items-center");
    li.innerHTML = `<p class="flex-grow-1 me-5">${book.asin},${book.title} </p><a href="#" class="btn btn-primary" id="rm-from-cart-${book.asin}">Rimuovi</a>`;
    carrello.appendChild(li);
    document
      .getElementById(`rm-from-cart-${book.asin}`)
      .addEventListener("click", function () {
        removeFromCart(book.asin);
      });
  });
}

function removeFromCart(asin) {
  cart.forEach((book, i) => {
    if (book.asin === asin) {
      cart.splice(i, 1);
    }
  });
  refreshCart();
}

class Card {
  constructor(image, title, price, asin) {
    this.image = image;
    this.title = title;
    this.price = price;
    this.asin = asin;
  }
  toString() {
    return `
    
            <img src="${this.image}" class="card-img-top" alt="" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fs-6">${this.title}</h5>
              <p class="card-text flex-grow-1">
                Prezzo: ${this.price} &euro;
              </p>
              <a href="#" class="btn btn-primary" id="discard-${this.asin}">Scarta</a>
              <a href="#" class="btn btn-info mt-2" id="buy-${this.asin}">Compra Ora</a>
            </div>
          
    `;
  }
}
