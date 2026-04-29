(function () {
  const STORAGE_KEY = "yic-library-state";
  const DAY_MS = 24 * 60 * 60 * 1000; // Calculates milliseconds in a full day (24h * 60m * 60s * 1000ms)

  const seedState = {
    books: [
      {
        id: 1,
        title: "Instruction in Functional Assessment",
        author: "Robert C. Martin",
        category: "Educational",
        year: 2008,
        description: "nstruction in Functional Assessment introduces learners to functional assessment (FA).",
        featured: true,
        cover: "images/books/book1.png"
      },
      {
        id: 2,
        title: "The body keeps the score",
        author: "Bessel van der Kolk",
        category: "Psychology",
        year: 2022,
        description: "explores how trauma reshapes both body and brain, limiting survivors' capacities for pleasure, engagement, and self-contro.",
        featured: true,
        cover: "images/books/book2.png"
      },
      {
        id: 3,
        title: "Come Closer",
        author: "Sara Gran",
        category: "Horror",
        year: 2003,
        description: "Amanda is life unravels as strange events push her into violent impulses and haunting blood‑red dreams.",
        featured: true,
        cover: "images/books/book3.png"
      },
      {
        id: 4,
        title: "Mrs England",
        author: "Stacey Halls",
        category: "Adventure",
        year: 2013,
        description: "Mrs England follows nurse Ruby May as she uncovers the dark secrets of a wealthy family and their unsettling mistress in an isolated Yorkshire home.",
        featured: false,
        cover: "images/books/book4.png"
      },
      {
        id: 5,
        title: "Ikigai",
        author: "Héctor García",
        category: "Psychology",
        year: 2017,
        description: "The book shows how the Japanese idea of *ikigai* offers simple, calming guidance for finding purpose in everyday life.",
        featured: false,
        cover: "images/books/book5.png"
      },
      {
        id: 6,
        title: "Ibn Saud",
        author: "Professor Barbara Bray",
        category: "Historical",
        year: 2015,
        description: "Ibn Saud rose from a harsh nomadic desert life to become a fearless warrior and decisive leader.",
        featured: true,
        cover: "images/books/book6.png"
      }
    ],

    // information about the user  might delete.
    users: [
      {
        id: 1,
        name: "Demo User",
        email: "example@gmail.com",
        role: "User",
        
      }
    ],
    borrowings: [
      {
        id: 101,
        userId: 1,
        bookId: 3,
        borrowDate: "2026-04-01",
        dueDate: "2026-04-10",
        returnDate: null
      },
      {
        id: 102,
        userId: 1,
        bookId: 1,
        borrowDate: "2026-03-12",
        dueDate: "2026-03-21",
        returnDate: "2026-03-23"
      }
    ]
  };
// (index page)The categoryMeta array provides a icon display information about book categories
  const categoryMeta = [
    {
      name: "Educational",
      summary: "Books that help you learn new skills, concepts, and academic subjects.",
      icon: "ri-school-line"
    },
    {
      name: "Psychology",
      summary: "Books about the mind, behavior, and personal growth.",
      icon: "ri-brain-line"
    },
    {
      name: "Horror",
      summary: "Scary and thrilling books that keep you on edge.",
      icon: "ri-ghost-line"
    },
    {
      name: "Adventure",
      summary: "Exciting journeys, discoveries, and action-filled stories.",
      icon: "ri-treasure-map-line"
    },
    {
      name: "Historical",
      summary: "Books based on past events, cultures, and historical stories.",
      icon: "ri-ancient-gate-line"
    }
  ];
// The pageMap object serves as a reference for the different pages of the application.

  const pageMap = {
    home: "index.html",
    search: "search.html",
    details: "book-details.html",
    account: "account.html",
    login: "login.html",
    register: "register.html",
    contact: "contact.html",
    admin: "admin/manage-books.html"
  };
 // The deepClone function creates a deep copy of a given value using JSON serialization and deserialization. This is useful for creating independent copies of objects or arrays without reference to the original.
  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }
// The normalizeState function takes a state object and ensures that it has a consistent structure by filling in any missing properties with default values from the seedState. It also adds cover images for books if they are not provided, using a fallback naming convention based on the book's ID.
  function normalizeState(state) {
    const defaultBooks = seedState.books;
    const normalizedBooks = (state.books || []).map((book) => {
      const fallback = defaultBooks.find((item) => item.id === book.id) || {};
      return {
        ...book,
        id: book.id,
        title: fallback.title || book.title,
        author: fallback.author || book.author,
        category: fallback.category || book.category,
        isbn: fallback.isbn || book.isbn,
        year: fallback.year || book.year,
        description: fallback.description || book.description,
        featured: typeof fallback.featured === "boolean" ? fallback.featured : book.featured,
        cover: fallback.cover || book.cover || `images/books/book${book.id}.png`
      };
    });
// This part of the normalizeState function identifies any books that are present in the defaultBooks array but missing from the normalizedBooks array. It then creates new book objects for these missing books, ensuring they have all necessary properties and a cover image, before adding them to the final state.
    const additionalBooks = defaultBooks
      .filter((seedBook) => !normalizedBooks.some((book) => book.id === seedBook.id))
      .map((seedBook) => ({
        ...seedBook,
        cover: seedBook.cover || `images/books/book${seedBook.id}.png`
      }));

    return {
      ...state,
      books: [...normalizedBooks, ...additionalBooks]
    };
  }
// The loadState function attempts to retrieve the application's state from the browser's localStorage. If no saved state is found, it initializes the storage with a deep clone of the seedState. If a saved state is found, it parses the JSON string and normalizes it before returning. In case of any errors during this process (e.g., corrupted data), it falls back to returning a deep clone of the seedState.
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
        return deepClone(seedState);
      }
      return normalizeState(JSON.parse(saved));
    } catch (error) {
      return deepClone(seedState);
    }
  }
// The saveState function takes a state object as an argument and saves it to the browser's localStorage under the key defined by STORAGE_KEY. It converts the state object into a JSON string before storing it, allowing for persistent data storage across page reloads.
  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
// might delete innput information
  function getCurrentDate() {
    return "2026-04-15";
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "Not returned";
    }
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }
// The getOpenBorrowing function checks the borrowings in the state to find an active borrowing entry for a specific book ID. It returns the borrowing entry if it exists and has not been returned (i.e., returnDate is null), or undefined if there is no active borrowing for that book.
  function getOpenBorrowing(state, bookId) {
    return state.borrowings.find((entry) => entry.bookId === bookId && !entry.returnDate);
  }

  function getBookStatus(state, bookId) {
    const borrowing = getOpenBorrowing(state, bookId);
    if (!borrowing) {
      return "available";
    }
    return borrowing.dueDate < getCurrentDate() ? "overdue" : "borrowed";
  }

  function calculateFine(borrowing) {
    const effectiveReturn = borrowing.returnDate || getCurrentDate();
    const daysLate = Math.max(0, Math.ceil((new Date(effectiveReturn) - new Date(borrowing.dueDate)) / DAY_MS));
    return {
      daysLate,
      amount: daysLate * 5
    };
  }
// The getBookById function searches through the books in the state to find a book that matches the provided bookId. It returns the book object if found, or undefined if no matching book is present in the state.
  function getBookById(state, bookId) {
    return state.books.find((book) => Number(book.id) === Number(bookId));
  }

  function borrowBook(bookId) {
    const state = loadState();
    if (getBookStatus(state, bookId) !== "available") {
      return false;
    }
// The borrowBook function first loads the current state and checks if the specified book is available for borrowing. If the book is not available, it returns false. If the book is available, it calculates the next borrowing ID by finding the maximum existing borrowing ID and adding one. It then creates a new borrowing entry with the current date as the borrow date and a due date set 14 days in the future. This new entry is added to the state's borrowings array, and the updated state is saved back to localStorage before returning true to indicate a successful borrowing action.
    const nextId = Math.max(0, ...state.borrowings.map((item) => item.id)) + 1;
    const borrowDate = getCurrentDate();
    const due = new Date(`${borrowDate}T00:00:00`);
    due.setDate(due.getDate() + 14);

    state.borrowings.push({
      id: nextId,
      userId: 1,
      bookId,
      borrowDate,
      dueDate: due.toISOString().slice(0, 10),
      returnDate: null
    });

    saveState(state);
    return true;
  }
// The returnBook function allows a user to return a borrowed book by updating the corresponding borrowing entry in the state. It first loads the current state and finds the borrowing entry that matches the provided borrowingId. If no such entry exists or if the book has already been returned (i.e., returnDate is not null), the function simply returns without making any changes. If the borrowing entry is valid and active, it sets the returnDate to the current date, saves the updated state back to localStorage, and effectively marks the book as returned.
  function returnBook(borrowingId) {
    const state = loadState();
    const borrowing = state.borrowings.find((item) => Number(item.id) === Number(borrowingId));
    if (!borrowing || borrowing.returnDate) {
      return;
    }
    borrowing.returnDate = getCurrentDate();
    saveState(state);
  }
//  The deleteBook function attempts to remove a book from the catalog based on the provided bookId. It first loads the current state and checks if there is an active borrowing for the specified book using the getOpenBorrowing function. If there is an active borrowing, it returns false, indicating that the book cannot be deleted while it is currently borrowed. If there are no active borrowings for the book, it filters out the book from the state's books array, saves the updated state back to localStorage, and returns true to indicate that the book was successfully deleted from the catalog.
  function deleteBook(bookId) {
    const state = loadState();
    if (getOpenBorrowing(state, bookId)) {
      return false;
    }
    state.books = state.books.filter((book) => Number(book.id) !== Number(bookId));
    saveState(state);
    return true;
  }
// The upsertBook is responsible for adding a new book to the catalog or updating an existing book's information based on the provided bookData object. It first loads the current state and checks if the bookData contains an id property. If it does, it attempts to find a matching book in the state by comparing the IDs. If a match is found, it updates the existing book's properties with the new data from bookData while ensuring that the ID remains consistent. If no match is found (i.e., it's a new book), it calculates the next available ID by finding the maximum existing book ID and adding one, then adds a new book object to the state's books array with default values for featured and year if they are not provided. Finally, it saves the updated state back to localStorage.
  function upsertBook(bookData) {
    const state = loadState();
    if (bookData.id) {
      const match = state.books.find((book) => Number(book.id) === Number(bookData.id));
      if (match) {
        Object.assign(match, bookData, { id: Number(bookData.id) });
      }
    } else {
      const nextId = Math.max(0, ...state.books.map((item) => item.id)) + 1;
      state.books.push({ ...bookData, id: nextId, featured: false, year: 2026 });
    }
    saveState(state);
  }
//
  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
// The createStatusMarkup function generates HTML markup for displaying the status of a book (e.g., available, borrowed, overdue)
  function createStatusMarkup(status) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="status-pill status-${status}">${label}</span>`;
  }
// The attachBorrowListeners function adds click event listeners to all elements within the specified scope that have a data-borrow attribute. When a borrow button is clicked, it attempts to borrow the corresponding book using the borrowBook function. If the borrowing is successful, it displays an alert confirming the action and reloads the page to reflect the updated state. If the book is unavailable for borrowing, it shows an alert indicating that the book cannot be borrowed at the moment.
  function attachBorrowListeners(scope) {
    scope.querySelectorAll("[data-borrow]").forEach((button) => {
      button.addEventListener("click", () => {
        const success = borrowBook(Number(button.dataset.borrow));
        if (success) {
          window.alert("Book borrowed successfully. The account page has been updated.");
          window.location.reload();
        } else {
          window.alert("This book is currently unavailable.");
        }
      });
    });
  }
// The attachReturnListeners function adds click event listeners to all elements within the specified scope that have a data-return attribute. When a return button is clicked, it calls the returnBook function with the corresponding borrowing ID to mark the book as returned, and then reloads the page to update the account information and reflect the change in book status.
  function attachReturnListeners(scope) {
    scope.querySelectorAll("[data-return]").forEach((button) => {
      button.addEventListener("click", () => {
        returnBook(Number(button.dataset.return));
        window.location.reload();
      });
    });
  }
// The renderBookCard function generates the HTML markup for displaying a single book card, including its cover, title, author, and status.
  function renderBookCard(state, book) {
    const status = getBookStatus(state, book.id);
    return `
      <article class="book-card">
        <div class="book-cover">
          <img
            src="${book.cover || "images/books/placeholder-book.svg"}"
            alt="${book.title} book cover"
            onerror="this.onerror=null;this.src='images/books/placeholder-book.svg';"
          >
        </div>
        <p class="eyebrow">${book.category}</p>
        <h3>${book.title}</h3>
        <div class="book-meta">
          <span>${book.author}</span>
          <span>${status}</span>
        </div>
        <footer>
          ${createStatusMarkup(status)}
          <a class="secondary-btn" href="book-details.html?id=${book.id}">View Book</a>
        </footer>
      </article>
    `;
  }
// The renderHomePage function is responsible for rendering the content of the home page, including the category grid and featured books section. It loads the current state, generates the HTML markup for each category and featured book, and attaches event listeners to the category buttons for navigation and to the borrow buttons for borrowing books.
  function renderHomePage() {
    const state = loadState();
    const categoryGrid = document.getElementById("categoryGrid");
    const featuredBooks = document.getElementById("featuredBooks");

    if (categoryGrid) {
      categoryGrid.innerHTML = categoryMeta.map((category) => `
        <article class="category-card">
          <div class="category-card-top">
            <div>
              <p class="eyebrow">${category.name}</p>
              <h3>${category.name}</h3>
              <p>${category.summary}</p>
            </div>
            <span class="category-icon" aria-hidden="true">
              <i class="${category.icon}"></i>
            </span>
          </div>
          <button type="button" class="secondary-btn" data-category-link="${category.name}">View Books</button>
        </article>
      `).join("");
// This part of the renderHomePage function adds click event listeners to each category button in the category grid. When a button is clicked, it constructs a new URL for the search page with a query parameter for the selected category, and then navigates the browser to that URL, allowing users to view books filtered by the chosen category.
      categoryGrid.querySelectorAll("[data-category-link]").forEach((button) => {
        button.addEventListener("click", () => {
          const url = new URL(pageMap.search, window.location.href);
          url.searchParams.set("category", button.dataset.categoryLink);
          window.location.href = url.toString();
        });
      });
    }
// This part of the renderHomePage function checks if the featuredBooks element exists and, if it does, generates the HTML markup for each featured book by filtering the books in the state for those marked as featured and using the renderBookCard function to create the markup for each book. It then sets the innerHTML of the featuredBooks element to this generated markup and attaches borrow listeners to enable borrowing functionality for the featured books.
    if (featuredBooks) {
      featuredBooks.innerHTML = state.books
        .filter((book) => book.featured)
        .map((book) => renderBookCard(state, book))
        .join("");
      attachBorrowListeners(featuredBooks);
    }
  }
// The renderSearchPage function is responsible for rendering the search page, including the search form, category filter, and search results. It loads the current state, populates the category select dropdown, and sets up event listeners for the search form submission to filter and display books based on the search criteria entered by the user.
  function renderSearchPage() {
    const state = loadState();
    const form = document.getElementById("searchForm");
    const categorySelect = document.getElementById("categorySelect");
    const results = document.getElementById("searchResults");
    const summary = document.getElementById("searchSummary");
    const queryCategory = getQueryParam("category") || "";

    if (!form || !categorySelect || !results || !summary) {
      return;
    }
// Populate the category select dropdown with available categories
    categoryMeta.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      categorySelect.appendChild(option);
    });
    categorySelect.value = queryCategory;
// The updateResults function is responsible for filtering the books based on the search keyword and selected category, updating the search summary with the number of results found, and rendering the filtered books in the search results section. It also attaches borrow listeners to the rendered book cards to enable borrowing functionality directly from the search results.
    const updateResults = () => {
      const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
      const category = categorySelect.value;
      const filtered = state.books.filter((book) => {
        const matchesKeyword = !keyword ||
          book.title.toLowerCase().includes(keyword) ||
          book.author.toLowerCase().includes(keyword);
        const matchesCategory = !category || book.category === category;
        return matchesKeyword && matchesCategory;
      });

      summary.textContent = `${filtered.length} book(s) found${category ? ` in ${category}` : ""}.`;
      results.innerHTML = filtered.map((book) => renderBookCard(state, book)).join("");
      attachBorrowListeners(results);
    };
// Set up event listener for the search form submission
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateResults();
    });

    updateResults();
  }
// The renderDetailsPage function is responsible for rendering the details page for a specific book. It loads the current state, retrieves the book ID from the query parameters, and finds the corresponding book in the state. If the book is found, it generates the HTML markup to display the book's details, including its title, author, description, and status. It also attaches event listeners to the borrow button if the book is available for borrowing.
  function renderDetailsPage() {
    const state = loadState();
    const container = document.getElementById("bookDetails");
    if (!container) {
      return;
    }

    const id = Number(getQueryParam("id")) || state.books[0].id;
    const book = getBookById(state, id);
    if (!book) {
      container.innerHTML = "<p>Book not found.</p>";
      return;
    }
// This generates the HTML markup for the book details page, including the book's category, title,... and a list of details such as ISBN and publication year. It also includes a status indicator and buttons for borrowing the book or returning to the search page. The borrow button is conditionally rendered based on the availability of the book, and event listeners are attached to enable borrowing functionality.
    const status = getBookStatus(state, book.id);
    container.innerHTML = `
      <div class="details-layout">
        <article class="book-visual">
          <p class="eyebrow">${book.category}</p>
          <h2>${book.title}</h2>
          <p>${book.author}</p>
        </article>
        <article>
          <p class="eyebrow">Catalog details</p>
          <h2>${book.title}</h2>
          <p>${book.description}</p>
          <ul class="detail-list">
            <li>Author: ${book.author}</li>
            <li>Category: ${book.category}</li>
            <li>ISBN: ${book.isbn}</li>
            <li>Publication Year: ${book.year}</li>
            <li>Status: ${status}</li>
          </ul>
          <footer>
            ${createStatusMarkup(status)}
            <a class="secondary-btn" href="${pageMap.search}">Back to Search</a>
            ${status === "available"
              ? `<button type="button" class="primary-btn" data-borrow="${book.id}">Borrow Book</button>`
              : `<button type="button" class="ghost-btn" disabled>Currently Unavailable</button>`}
          </footer>
        </article>
      </div>
    `;

    attachBorrowListeners(container);
  }
// The renderAccountPage function is responsible for rendering the user's account page, which includes sections for current borrowings, borrowing history, and fines. It loads the current state, retrieves the user's borrowing records, and generates the HTML markup to display active borrowings, historical records, and any fines associated with overdue books. It also attaches event listeners to enable returning books directly from the account page.
  function renderAccountPage() {
    const state = loadState();
    const currentBorrowings = document.getElementById("currentBorrowings");
    const historyTable = document.getElementById("historyTable");
    const fineTable = document.getElementById("fineTable");
    const stats = document.getElementById("accountStats");
    if (!currentBorrowings || !historyTable || !fineTable || !stats) {
      return;
    }
// This part of the renderAccountPage function filters the borrowings in the state to find those that belong to the current user (userId: 1) and sorts them by borrow date in descending order. It then separates active borrowings (those without a return date) from historical records and calculates any fines for overdue books. The account statistics are updated to show the number of active borrowings, total records, fine entries, and outstanding fine value. The current borrowings, borrowing history, and fines are rendered in their respective sections of the account page.
    const borrowings = state.borrowings
      .filter((item) => item.userId === 1)
      .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));

    const active = borrowings.filter((item) => !item.returnDate);
    const fines = borrowings
      .map((item) => ({ item, fine: calculateFine(item) }))
      .filter(({ fine }) => fine.daysLate > 0);

    stats.innerHTML = `
      <article class="account-stat"><strong>${active.length}</strong><span class="muted-label">Active Borrowings</span></article>
      <article class="account-stat"><strong>${borrowings.length}</strong><span class="muted-label">Total Records</span></article>
      <article class="account-stat"><strong>${fines.length}</strong><span class="muted-label">Fine Entries</span></article>
      <article class="account-stat"><strong>${fines.reduce((sum, entry) => sum + entry.fine.amount, 0)} SAR</strong><span class="muted-label">Outstanding Value</span></article>
    `;
//  is populated with active borrowings, displaying the book's category, title, borrow date, due date, and status. If there are no active borrowings, a message is shown indicating that there are no currently borrowed books. The borrowing history table is filled with all borrowing records, showing the book title, borrow date, due date, return date, and status. The fines table lists any overdue borrowings along with the number of days late and the fine amount. Event listeners are attached to the return buttons to allow users to return books directly from their account page.
    currentBorrowings.innerHTML = active.length
      ? active.map((entry) => {
          const book = getBookById(state, entry.bookId);
          const status = getBookStatus(state, entry.bookId);
          return `
            <article class="borrow-card">
              <p class="eyebrow">${book.category}</p>
              <h3>${book.title}</h3>
              <p>Borrowed on ${formatDate(entry.borrowDate)} and due on ${formatDate(entry.dueDate)}.</p>
              <footer>
                ${createStatusMarkup(status)}
                <button type="button" class="primary-btn" data-return="${entry.id}">Return Book</button>
              </footer>
            </article>
          `;
        }).join("")
      : "<p>No active borrowed books at the moment.</p>";
//  filled with all borrowing records, showing the book title, borrow date, due date, return date, and status. The fines table lists any overdue borrowings along with the number of days late and the fine amount. Event listeners are attached to the return buttons to allow users to return books directly from their account page.
    historyTable.innerHTML = borrowings.map((entry) => {
      const book = getBookById(state, entry.bookId);
      const status = entry.returnDate ? "returned" : getBookStatus(state, entry.bookId);
      return `
        <tr>
          <td>${book.title}</td>
          <td>${formatDate(entry.borrowDate)}</td>
          <td>${formatDate(entry.dueDate)}</td>
          <td>${formatDate(entry.returnDate)}</td>
          <td>${createStatusMarkup(status)}</td>
        </tr>
      `;
    }).join("");
// The fines table lists any overdue borrowings along with the number of days late and the fine amount. Event listeners are attached to the return buttons to allow users to return books directly from their account page.
    fineTable.innerHTML = fines.length
      ? fines.map(({ item, fine }) => {
          const book = getBookById(state, item.bookId);
          const paidStatus = item.returnDate ? "paid" : "unpaid";
          return `
            <tr>
              <td>${book.title}</td>
              <td>${fine.daysLate}</td>
              <td>${fine.amount} SAR</td>
              <td>${createStatusMarkup(paidStatus)}</td>
            </tr>
          `;
        }).join("")
      : '<tr><td colspan="4">No fines recorded.</td></tr>';

    attachReturnListeners(currentBorrowings);
  }
//  This function sets an error message for a form field and updates its visual state.
  function setFormError(field, message) {
    const wrapper = field.closest(".field");
    const errorText = wrapper ? wrapper.querySelector(".error-text") : null;
    if (!wrapper || !errorText) {
      return;
    }
    wrapper.classList.toggle("invalid", Boolean(message));
    errorText.textContent = message || "";
  }
// The clearFormErrors function removes any error messages and visual error indicators from all form fields within the specified form element, resetting the form's error state to allow for fresh validation.
  function clearFormErrors(form) {
    form.querySelectorAll(".field").forEach((field) => field.classList.remove("invalid"));
    form.querySelectorAll(".error-text").forEach((item) => {
      item.textContent = "";
    });
  }
// The validateRequired function 
  function validateRequired(field, label) {
    if (!field.value.trim()) {
      setFormError(field, `${label} is required.`);
      return false;
    }
    setFormError(field, "");
    return true;
  }
// The validateRequired function
  function validateEmail(field) {
    if (!validateRequired(field, "Email")) {
      return false;
    }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    setFormError(field, valid ? "" : "Enter a valid email address.");
    return valid;
  }
//  responsible for rendering the login page and handling the login form submission. It validates the user or admin input.
  function renderLoginPage() {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");
    if (!form || !message) {
      return;
    }
//  adds a submit event listener to the login form. 
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFormErrors(form);

      const email = form.elements.email;
      const password = form.elements.password;
      const role = form.elements.role;

      const valid = [
        validateEmail(email),
        validateRequired(password, "Password"),
        validateRequired(role, "Role")
      ].every(Boolean);

      if (!valid) {
        message.textContent = "Please correct the highlighted fields.";
        return;
      }
//  In this demo, any email/password combination is accepted for both user and admin roles. The message is updated to indicate a successful login, and after a short delay, the user is redirected to the appropriate page based on their selected role (admin panel for admins and account page for regular users).
      message.textContent = role.value === "admin"
        ? "Login successful. Redirecting to the admin panel..."
        : "Login successful. Redirecting to your account...";

      window.setTimeout(() => {
        window.location.href = role.value === "admin" ? pageMap.admin : pageMap.account;
      }, 900);
    });
  }
//  is responsible for rendering the registration page and handling the registration form submission. It validates the user input for creating a new account, including checking for required fields, validating the email format, and ensuring that the password and confirm password fields match. If the validation passes, it displays a success message and redirects the user to the login page after a short delay.
  function renderRegisterPage() {
    const form = document.getElementById("registerForm");
    const message = document.getElementById("registerMessage");
    if (!form || !message) {
      return;
    }
// adds a submit event listener to the registration form.
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFormErrors(form);

      const valid = [
        validateRequired(form.elements.fullName, "Full name"),
        validateEmail(form.elements.email),
        validateRequired(form.elements.password, "Password"),
        validateRequired(form.elements.confirmPassword, "Confirm password")
      ].every(Boolean);

      if (form.elements.password.value !== form.elements.confirmPassword.value) {
        setFormError(form.elements.confirmPassword, "Passwords do not match.");
        message.textContent = "Please correct the highlighted fields.";
        return;
      }

      if (!valid) {
        message.textContent = "Please correct the highlighted fields.";
        return;
      }

      message.textContent = "Account created successfully. Redirecting to login...";
      window.setTimeout(() => {
        window.location.href = pageMap.login;
      }, 900);
    });
  }
//  responsible for rendering the contact page and handling the contact form submission. 
  function renderContactPage() {
    const form = document.getElementById("contactForm");
    const message = document.getElementById("contactMessage");
    if (!form || !message) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFormErrors(form);

      const valid = [
        validateRequired(form.elements.name, "Name"),
        validateEmail(form.elements.email),
        validateRequired(form.elements.message, "Message")
      ].every(Boolean);

      if (!valid) {
        message.textContent = "Please complete all fields before sending.";
        return;
      }

      message.textContent = "Your message has been recorded in this frontend demo.";
      form.reset();
    });
  }
// 
  function fillAdminForm(book) {
    const form = document.getElementById("adminBookForm");
    if (!form || !book) {
      return;
    }
    form.elements.bookId.value = book.id;
    form.elements.title.value = book.title;
    form.elements.author.value = book.author;
    form.elements.category.value = book.category;
    form.elements.isbn.value = book.isbn;
    form.elements.description.value = book.description;
  }
//
  function renderAdminPage() {
    const table = document.getElementById("adminBookTable");
    const overdueCards = document.getElementById("overdueCards");
    const form = document.getElementById("adminBookForm");
    const message = document.getElementById("adminMessage");
    const resetButton = document.getElementById("adminResetButton");

    if (!table || !overdueCards || !form || !message || !resetButton) {
      return;
    }
//  responsible for rendering the admin page, including the book management table and the overdue items section. 
    const draw = () => {
      const currentState = loadState();
      table.innerHTML = currentState.books.map((book) => {
        const status = getBookStatus(currentState, book.id);
        return `
          <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${createStatusMarkup(status)}</td>
            <td>
              <button type="button" class="ghost-btn" data-edit-book="${book.id}">Edit</button>
              <button type="button" class="ghost-btn" data-delete-book="${book.id}">Delete</button>
            </td>
          </tr>
        `;
      }).join("");

      const overdueEntries = currentState.borrowings
        .filter((entry) => !entry.returnDate && entry.dueDate < getCurrentDate());

      overdueCards.innerHTML = overdueEntries.length
        ? overdueEntries.map((entry) => {
            const book = getBookById(currentState, entry.bookId);
            const fine = calculateFine(entry);
            return `
              <article class="overdue-card">
                <p class="eyebrow">Overdue item</p>
                <h3>${book.title}</h3>
                <p>Borrower: Demo Student</p>
                <p>Due date: ${formatDate(entry.dueDate)}</p>
                <p>Estimated fine: ${fine.amount} SAR</p>
              </article>
            `;
          }).join("")
        : "<p>No overdue items right now.</p>";
// This part of the renderAdminPage function adds click event listeners to the edit and delete buttons in the book management table. 
      table.querySelectorAll("[data-edit-book]").forEach((button) => {
        button.addEventListener("click", () => {
          const book = getBookById(loadState(), Number(button.dataset.editBook));
          fillAdminForm(book);
          message.textContent = `Editing "${book.title}".`;
        });
      });

      table.querySelectorAll("[data-delete-book]").forEach((button) => {
        button.addEventListener("click", () => {
          const success = deleteBook(Number(button.dataset.deleteBook));
          message.textContent = success
            ? "Book deleted from the catalog."
            : "Cannot delete a book while it is actively borrowed.";
          draw();
        });
      });
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFormErrors(form);
// add valid for book
      const valid = [
        validateRequired(form.elements.title, "Title"),
        validateRequired(form.elements.author, "Author"),
        validateRequired(form.elements.category, "Category"),
        validateRequired(form.elements.isbn, "ISBN"),
        validateRequired(form.elements.description, "Description")
      ].every(Boolean);

      if (!valid) {
        message.textContent = "Please correct the highlighted fields.";
        return;
      }

      upsertBook({
        id: form.elements.bookId.value ? Number(form.elements.bookId.value) : null,
        title: form.elements.title.value.trim(),
        author: form.elements.author.value.trim(),
        category: form.elements.category.value.trim(),
        isbn: form.elements.isbn.value.trim(),
        description: form.elements.description.value.trim()
      });

      message.textContent = form.elements.bookId.value ? "Book updated successfully." : "Book added successfully.";
      form.reset();
      draw();
    });

    resetButton.addEventListener("click", () => {
      form.reset();
      message.textContent = "Form cleared.";
    });

    draw();
  }
// The init function determines which page is currently being viewed by checking the data-page attribute on the body element.
  function init() {
    const page = document.body.dataset.page;
    const handlers = {
      home: renderHomePage,
      search: renderSearchPage,
      details: renderDetailsPage,
      account: renderAccountPage,
      login: renderLoginPage,
      register: renderRegisterPage,
      contact: renderContactPage,
      admin: renderAdminPage
    };

    if (handlers[page]) {
      handlers[page]();
    }
  }

  init();
})();
