(function () {
  const STORAGE_KEY = "yic-library-state";
  const DAY_MS = 24 * 60 * 60 * 1000;

  const seedState = {
    books: [
      {
        id: 1,
        title: "Instruction in Functional Assessment",
        author: "Robert C. Martin",
        category: "Educational",
        isbn: "9780132350884",
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
        isbn: "9780262046305",
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
        isbn: "9781118061145",
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
        isbn: "9780831133276",
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
        isbn: "9781118347232",
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
        isbn: "9781319245009",
        year: 2015,
        description: "Ibn Saud rose from a harsh nomadic desert life to become a fearless warrior and decisive leader.",
        featured: true,
        cover: "images/books/book6.png"
      }
    ],
    users: [
      {
        id: 1,
        name: "Demo Student",
        email: "student@yic.edu.sa",
        role: "student",
        studentId: "YIC2026001"
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

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

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

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

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

  function getBookById(state, bookId) {
    return state.books.find((book) => Number(book.id) === Number(bookId));
  }

  function borrowBook(bookId) {
    const state = loadState();
    if (getBookStatus(state, bookId) !== "available") {
      return false;
    }

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

  function returnBook(borrowingId) {
    const state = loadState();
    const borrowing = state.borrowings.find((item) => Number(item.id) === Number(borrowingId));
    if (!borrowing || borrowing.returnDate) {
      return;
    }
    borrowing.returnDate = getCurrentDate();
    saveState(state);
  }

  function deleteBook(bookId) {
    const state = loadState();
    if (getOpenBorrowing(state, bookId)) {
      return false;
    }
    state.books = state.books.filter((book) => Number(book.id) !== Number(bookId));
    saveState(state);
    return true;
  }

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

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function createStatusMarkup(status) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="status-pill status-${status}">${label}</span>`;
  }

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

  function attachReturnListeners(scope) {
    scope.querySelectorAll("[data-return]").forEach((button) => {
      button.addEventListener("click", () => {
        returnBook(Number(button.dataset.return));
        window.location.reload();
      });
    });
  }

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

      categoryGrid.querySelectorAll("[data-category-link]").forEach((button) => {
        button.addEventListener("click", () => {
          const url = new URL(pageMap.search, window.location.href);
          url.searchParams.set("category", button.dataset.categoryLink);
          window.location.href = url.toString();
        });
      });
    }

    if (featuredBooks) {
      featuredBooks.innerHTML = state.books
        .filter((book) => book.featured)
        .map((book) => renderBookCard(state, book))
        .join("");
      attachBorrowListeners(featuredBooks);
    }
  }

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

    categoryMeta.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      categorySelect.appendChild(option);
    });
    categorySelect.value = queryCategory;

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

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateResults();
    });

    updateResults();
  }

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

  function renderAccountPage() {
    const state = loadState();
    const currentBorrowings = document.getElementById("currentBorrowings");
    const historyTable = document.getElementById("historyTable");
    const fineTable = document.getElementById("fineTable");
    const stats = document.getElementById("accountStats");
    if (!currentBorrowings || !historyTable || !fineTable || !stats) {
      return;
    }

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

  function setFormError(field, message) {
    const wrapper = field.closest(".field");
    const errorText = wrapper ? wrapper.querySelector(".error-text") : null;
    if (!wrapper || !errorText) {
      return;
    }
    wrapper.classList.toggle("invalid", Boolean(message));
    errorText.textContent = message || "";
  }

  function clearFormErrors(form) {
    form.querySelectorAll(".field").forEach((field) => field.classList.remove("invalid"));
    form.querySelectorAll(".error-text").forEach((item) => {
      item.textContent = "";
    });
  }

  function validateRequired(field, label) {
    if (!field.value.trim()) {
      setFormError(field, `${label} is required.`);
      return false;
    }
    setFormError(field, "");
    return true;
  }

  function validateEmail(field) {
    if (!validateRequired(field, "Email")) {
      return false;
    }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    setFormError(field, valid ? "" : "Enter a valid email address.");
    return valid;
  }

  function renderLoginPage() {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");
    if (!form || !message) {
      return;
    }

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

      message.textContent = role.value === "admin"
        ? "Login successful. Redirecting to the admin panel..."
        : "Login successful. Redirecting to your account...";

      window.setTimeout(() => {
        window.location.href = role.value === "admin" ? pageMap.admin : pageMap.account;
      }, 900);
    });
  }

  function renderRegisterPage() {
    const form = document.getElementById("registerForm");
    const message = document.getElementById("registerMessage");
    if (!form || !message) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFormErrors(form);

      const valid = [
        validateRequired(form.elements.fullName, "Full name"),
        validateRequired(form.elements.studentId, "Student ID"),
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

  function renderAdminPage() {
    const table = document.getElementById("adminBookTable");
    const overdueCards = document.getElementById("overdueCards");
    const form = document.getElementById("adminBookForm");
    const message = document.getElementById("adminMessage");
    const resetButton = document.getElementById("adminResetButton");

    if (!table || !overdueCards || !form || !message || !resetButton) {
      return;
    }

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
