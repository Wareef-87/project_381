(function () {
    var inAdminFolder = window.location.pathname.indexOf("/admin/") !== -1;
    var rootPrefix = inAdminFolder ? "../" : "";
    var apiPrefix = rootPrefix;
    var placeholderCover = rootPrefix + "images/books/book1.png";
    var session = { loggedIn: false, user: null };
    var fallbackBooks = [
        {
            id: 1,
            title: "Instruction in Functional Assessment",
            author: "Robert C. Martin",
            category: "Educational",
            published_year: "2008",
            available_copies: 3,
            featured: 1,
            description: "Instruction in Functional Assessment introduces learners to functional assessment.",
            isbn: "9780132350884",
            cover_path: "images/books/book1.png"
        },
        {
            id: 2,
            title: "The body keeps the score",
            author: "Bessel van der Kolk",
            category: "Psychology",
            published_year: "2022",
            available_copies: 2,
            featured: 1,
            description: "Explores how trauma reshapes both body and brain.",
            isbn: "9780143127741",
            cover_path: "images/books/book2.png"
        },
        {
            id: 3,
            title: "Come Closer",
            author: "Sara Gran",
            category: "Horror",
            published_year: "2003",
            available_copies: 4,
            featured: 1,
            description: "A woman's life unravels into violent impulses.",
            isbn: "9780425210312",
            cover_path: "images/books/book3.png"
        },
        {
            id: 4,
            title: "Mrs England",
            author: "Stacey Halls",
            category: "Adventure",
            published_year: "2013",
            available_copies: 1,
            featured: 0,
            description: "A nurse uncovers dark secrets in an isolated Yorkshire home.",
            isbn: "9781838772884",
            cover_path: "images/books/book4.png"
        },
        {
            id: 5,
            title: "Ikigai",
            author: "Hector Garcia",
            category: "Psychology",
            published_year: "2017",
            available_copies: 2,
            featured: 0,
            description: "Finding purpose in everyday life.",
            isbn: "9780143130727",
            cover_path: "images/books/book5.png"
        },
        {
            id: 6,
            title: "Ibn Saud",
            author: "Professor Barbara Bray",
            category: "Historical",
            published_year: "2015",
            available_copies: 5,
            featured: 1,
            description: "The rise of a fearless warrior and leader.",
            isbn: "9780863569098",
            cover_path: "images/books/book6.png"
        }
    ];

    var pageMap = {
        home: rootPrefix + "index.php",
        search: rootPrefix + "search.php",
        details: rootPrefix + "book-details.php",
        account: rootPrefix + "account.php",
        login: rootPrefix + "login.php",
        register: rootPrefix + "register.php",
        contact: rootPrefix + "contact.php",
        admin: rootPrefix + "admin/manage-books.php"
    };

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function coverPath(path) {
        if (!path) return placeholderCover;
        if (path.indexOf("http") === 0 || path.indexOf("../") === 0) return path;
        return rootPrefix + path;
    }

    function bookCover(book, index) {
        if (book.cover_path) return coverPath(book.cover_path);
        var number = (parseInt(book.id || index + 1, 10) - 1) % 6 + 1;
        return rootPrefix + "images/books/book" + number + ".png";
    }

    function statusPill(book) {
        var available = parseInt(book.available_copies, 10) > 0;
        var className = available ? "status-available" : "status-unavailable";
        return '<span class="status-pill ' + className + '">' + (available ? "available" : "not available") + '</span>';
    }

    function request(url, options) {
        return fetch(apiPrefix + url, options || {}).then(function (response) {
            return response.json().catch(function () {
                return { success: false, message: "Server response error." };
            });
        }).catch(function () {
            return { success: false, message: "Server connection error." };
        });
    }

    function postForm(url, formData) {
        return request(url, {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        });
    }

    function loadSession() {
        return request("session.php", { credentials: "same-origin" }).then(function (data) {
            session.loggedIn = !!data.loggedIn;
            session.user = data.user || null;
            updateNavigation();
        });
    }

    function updateNavigation() {
        var links = document.querySelectorAll("[data-auth-link]");
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var type = link.getAttribute("data-auth-link");
            var show = true;

            if (type === "login") show = !session.loggedIn;
            if (type === "logout") show = session.loggedIn;
            if (type === "account") show = session.loggedIn && session.user && session.user.role !== "admin";
            if (type === "admin") show = session.loggedIn && session.user && session.user.role === "admin";

            link.style.display = show ? "" : "none";

            if (type === "logout") {
                link.onclick = function (event) {
                    event.preventDefault();
                    postForm("logout.php", new FormData()).then(function () {
                        window.location.href = pageMap.login;
                    });
                };
            }
        }
    }

    function loadBooks(params) {
        var query = new URLSearchParams(params || {});
        return request("books.php" + (query.toString() ? "?" + query.toString() : ""), {
            credentials: "same-origin"
        }).then(function (data) {
            var books = data.success ? data.books : [];
            if (!books || books.length === 0) {
                books = filterFallbackBooks(params || {});
            }
            return books;
        });
    }

    function filterFallbackBooks(params) {
        var keyword = String(params.keyword || "").toLowerCase();
        var category = String(params.category || "");
        var id = parseInt(params.id || 0, 10);
        var featured = params.featured === undefined || params.featured === null ? null : parseInt(params.featured, 10);

        return fallbackBooks.filter(function (book) {
            if (id > 0 && parseInt(book.id, 10) !== id) return false;
            if (category && book.category !== category) return false;
            if (featured !== null && parseInt(book.featured, 10) !== featured) return false;
            if (keyword && (book.title + " " + book.author).toLowerCase().indexOf(keyword) === -1) return false;
            return true;
        });
    }

    function bookCard(book, index) {
        var cover = bookCover(book, index || 0);
        return '<article class="book-card">' +
            '<div class="book-cover"><img src="' + cover + '" alt="' + escapeHtml(book.title) + '" onerror="this.src=\'' + placeholderCover + '\'"></div>' +
            '<p class="eyebrow">' + escapeHtml(book.category) + '</p>' +
            '<h3>' + escapeHtml(book.title) + '</h3>' +
            '<div class="book-meta"><span>' + escapeHtml(book.author) + '</span><span>' + escapeHtml(book.published_year) + '</span></div>' +
            '<footer>' +
            statusPill(book) +
            '<a class="secondary-btn" href="' + pageMap.details + '?id=' + book.id + '">View Book</a>' +
            '</footer>' +
            '</article>';
    }

    function uniqueCategories(books) {
        var map = {};
        var categories = [];
        for (var i = 0; i < books.length; i++) {
            if (!map[books[i].category]) {
                map[books[i].category] = true;
                categories.push(books[i].category);
            }
        }
        return categories.sort();
    }

    function renderHomePage() {
        loadBooks().then(function (books) {
            var categoryGrid = document.getElementById("categoryGrid");
            var featuredDiv = document.getElementById("featuredBooks");
            var categories = uniqueCategories(books);

            if (categoryGrid) {
                categoryGrid.innerHTML = categories.map(function (category) {
                    return '<article class="category-card">' +
                        '<div class="category-card-top">' +
                        '<div><p class="eyebrow">' + escapeHtml(category) + '</p><h3>' + escapeHtml(category) + '</h3><p>Browse books in this category.</p></div>' +
                        '<span class="category-icon"><i class="ri-book-2-line"></i></span>' +
                        '</div>' +
                        '<button type="button" class="secondary-btn" data-category="' + escapeHtml(category) + '">View Books</button>' +
                        '</article>';
                }).join("");

                categoryGrid.addEventListener("click", function (event) {
                    var button = event.target.closest("[data-category]");
                    if (button) {
                        window.location.href = pageMap.search + "?category=" + encodeURIComponent(button.getAttribute("data-category"));
                    }
                });
            }

            if (featuredDiv) {
                var featured = books.filter(function (book) {
                    return parseInt(book.featured, 10) === 1;
                });
                featuredDiv.innerHTML = featured.map(bookCard).join("") || books.slice(0, 6).map(bookCard).join("") || "<p>No featured books found.</p>";
            }
        });
    }

    function renderSearchPage() {
        var form = document.getElementById("searchForm");
        var categorySelect = document.getElementById("categorySelect");
        var resultsDiv = document.getElementById("searchResults");
        var summarySpan = document.getElementById("searchSummary");
        if (!form) return;

        loadBooks().then(function (books) {
            var categories = uniqueCategories(books);
            categorySelect.innerHTML = '<option value="">All Categories</option>' + categories.map(function (category) {
                return '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>';
            }).join("");

            var urlCategory = getQueryParam("category");
            if (urlCategory) categorySelect.value = urlCategory;
            updateResults();
        });

        function updateResults() {
            var keyword = document.getElementById("searchInput").value.trim();
            var category = categorySelect.value;
            loadBooks({ keyword: keyword, category: category }).then(function (books) {
                summarySpan.textContent = books.length + " book(s) found" + (category ? " in " + category : "") + ".";
                resultsDiv.innerHTML = books.map(bookCard).join("") || "<p>No books match your search.</p>";
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            updateResults();
        });

        categorySelect.addEventListener("change", updateResults);
    }

    function renderDetailsPage() {
        var container = document.getElementById("bookDetails");
        if (!container) return;

        loadBooks({ id: getQueryParam("id") || 1 }).then(function (books) {
            var book = books[0];
            if (!book) {
                container.innerHTML = "<p>Book not found.</p>";
                return;
            }

            container.innerHTML = '<div class="details-layout">' +
                '<article class="book-visual"><img src="' + bookCover(book, 0) + '" alt="' + escapeHtml(book.title) + '" onerror="this.src=\'' + placeholderCover + '\'"></article>' +
                '<article>' +
                '<p class="eyebrow">Catalog details</p><h2>' + escapeHtml(book.title) + '</h2><p>' + escapeHtml(book.description) + '</p>' +
                '<ul class="detail-list">' +
                '<li>Author: ' + escapeHtml(book.author) + '</li>' +
                '<li>Category: ' + escapeHtml(book.category) + '</li>' +
                '<li>ISBN: ' + escapeHtml(book.isbn) + '</li>' +
                '<li>Year: ' + escapeHtml(book.published_year) + '</li>' +
                '<li>Available Copies: ' + escapeHtml(book.available_copies) + '</li>' +
                '</ul>' +
                '<footer>' +
                statusPill(book) +
                '<a class="secondary-btn" href="' + pageMap.search + '">Back to Search</a>' +
                (session.user && session.user.role === "admin" ? "" : '<button class="primary-btn" id="borrowBtn"' + (parseInt(book.available_copies, 10) < 1 ? " disabled" : "") + '>Borrow Book</button>') +
                '</footer>' +
                '<p id="borrowMessage" class="status-message"></p>' +
                '</article>' +
                '</div>';

            var borrowButton = document.getElementById("borrowBtn");
            if (!borrowButton) return;

            borrowButton.addEventListener("click", function () {
                if (!session.loggedIn) {
                    window.location.href = pageMap.login;
                    return;
                }

                var data = new FormData();
                data.append("book_id", book.id);
                postForm("borrow.php", data).then(function (result) {
                    document.getElementById("borrowMessage").textContent = result.message || "";
                    if (result.success) renderDetailsPage();
                });
            });
        });
    }

    function renderAccountPage() {
        var currentDiv = document.getElementById("currentBorrowings");
        var historyDiv = document.getElementById("historyTable");
        var fineDiv = document.getElementById("fineTable");
        if (!currentDiv) return;

        if (!session.loggedIn) {
            window.location.href = pageMap.login;
            return;
        }

        request("account.php?api=1", { credentials: "same-origin" }).then(function (data) {
            var current = data.current || [];
            var history = data.history || [];
            var fines = data.fines || [];

            currentDiv.innerHTML = current.map(function (item) {
                return '<article class="info-card">' +
                    '<h3>' + escapeHtml(item.title) + '</h3>' +
                    '<p>Author: ' + escapeHtml(item.author) + '</p>' +
                    '<p>Due Date: ' + escapeHtml(item.due_date) + '</p>' +
                    '<button class="secondary-btn return-btn" data-id="' + item.borrowing_id + '">Return Book</button>' +
                    '</article>';
            }).join("") || "<p>You have no books borrowed at the moment.</p>";

            historyDiv.innerHTML = history.map(function (item) {
                return '<tr><td>' + escapeHtml(item.title) + '</td><td>' + escapeHtml(item.borrow_date) + '</td><td>' + escapeHtml(item.due_date) + '</td><td>' + escapeHtml(item.return_date || "-") + '</td><td>' + escapeHtml(item.status) + '</td></tr>';
            }).join("") || '<tr><td colspan="5">No borrowing history available.</td></tr>';

            fineDiv.innerHTML = fines.map(function (item) {
                return '<tr><td>' + escapeHtml(item.title) + '</td><td>' + escapeHtml(item.days_late) + '</td><td>' + escapeHtml(item.amount) + ' SAR</td><td>' + escapeHtml(item.status) + '</td></tr>';
            }).join("") || '<tr><td colspan="4">No fines to display.</td></tr>';

            currentDiv.addEventListener("click", function (event) {
                var button = event.target.closest(".return-btn");
                if (!button) return;

                var formData = new FormData();
                formData.append("borrowing_id", button.getAttribute("data-id"));
                postForm("return.php", formData).then(function () {
                    renderAccountPage();
                });
            }, { once: true });
        });
    }

    function renderLoginPage() {
        var form = document.getElementById("loginForm");
        var msg = document.getElementById("loginMessage");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            clearFormErrors(form);
            var email = form.elements.email.value.trim();
            var password = form.elements.password.value.trim();
            var role = form.elements.role.value;

            if (!email || !password || !role) {
                showFieldError(form.elements.email, email ? "" : "Email is required.");
                showFieldError(form.elements.password, password ? "" : "Password is required.");
                showFieldError(form.elements.role, role ? "" : "Role is required.");
                msg.textContent = "";
                return;
            }

            postForm("login.php", new FormData(form)).then(function (result) {
                msg.textContent = result.message || "";
                if (result.success) {
                    window.location.href = pageMap.home;
                }
            });
        });
    }

    function renderRegisterPage() {
        var form = document.getElementById("registerForm");
        var msg = document.getElementById("registerMessage");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            clearFormErrors(form);
            var fullName = form.elements.fullName.value.trim();
            var email = form.elements.email.value.trim();
            var pwd = form.elements.password.value.trim();
            var confirm = form.elements.confirmPassword.value.trim();
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!fullName || !email || !pwd || !confirm) {
                showFieldError(form.elements.fullName, fullName ? "" : "Full name is required.");
                showFieldError(form.elements.email, email ? "" : "Email is required.");
                showFieldError(form.elements.password, pwd ? "" : "Password is required.");
                showFieldError(form.elements.confirmPassword, confirm ? "" : "Please confirm your password.");
                msg.textContent = "";
                return;
            }

            if (!emailPattern.test(email)) {
                showFieldError(form.elements.email, "Enter a valid email address.");
                msg.textContent = "";
                return;
            }

            if (pwd.length < 6) {
                showFieldError(form.elements.password, "Password must be at least 6 characters.");
                msg.textContent = "";
                return;
            }

            if (pwd !== confirm) {
                showFieldError(form.elements.confirmPassword, "Passwords do not match.");
                msg.textContent = "";
                return;
            }

            postForm("register.php", new FormData(form)).then(function (result) {
                msg.textContent = result.message || "";
                if (result.success) {
                    form.reset();
                    window.location.href = pageMap.login;
                }
            });
        });
    }

    function showFieldError(input, message) {
        var field = input ? input.closest(".field") : null;
        var error = field ? field.querySelector(".error-text") : null;
        if (!field || !error) return;

        field.classList.toggle("invalid", !!message);
        error.textContent = message || "";
    }

    function clearFormErrors(form) {
        var errors = form.querySelectorAll(".error-text");
        var fields = form.querySelectorAll(".field");
        for (var i = 0; i < errors.length; i++) errors[i].textContent = "";
        for (var j = 0; j < fields.length; j++) fields[j].classList.remove("invalid");
    }

    function renderContactPage() {
        var form = document.getElementById("contactForm");
        var msg = document.getElementById("contactMessage");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var name = form.elements.name ? form.elements.name.value.trim() : "";
            var email = form.elements.email ? form.elements.email.value.trim() : "";
            var message = form.elements.message ? form.elements.message.value.trim() : "";

            if (!name || !email || !message) {
                msg.textContent = "Please complete all fields.";
                return;
            }

            msg.textContent = "Message sent. We will get back to you soon.";
            form.reset();
        });
    }

    function renderAdminPage() {
        var table = document.getElementById("adminBookTable");
        var overdueDiv = document.getElementById("overdueCards");
        var form = document.getElementById("adminBookForm");
        var msg = document.getElementById("adminMessage");
        var resetBtn = document.getElementById("adminResetButton");
        if (!table) return;

        if (!session.loggedIn || !session.user || session.user.role !== "admin") {
            window.location.href = pageMap.login;
            return;
        }

        function loadAdminBooks() {
            loadBooks().then(function (books) {
                table.innerHTML = books.map(function (book) {
                    return '<tr>' +
                        '<td>' + escapeHtml(book.title) + '</td>' +
                        '<td>' + escapeHtml(book.author) + '</td>' +
                        '<td>' + escapeHtml(book.category) + '</td>' +
                        '<td>' + statusPill(book) + '</td>' +
                        '<td><button class="edit-btn" data-id="' + book.id + '">Edit</button> <button class="delete-btn" data-id="' + book.id + '">Delete</button></td>' +
                        '</tr>';
                }).join("");

                table.onclick = function (event) {
                    var editButton = event.target.closest(".edit-btn");
                    var deleteButton = event.target.closest(".delete-btn");

                    if (editButton) {
                        var book = books.find(function (item) {
                            return String(item.id) === String(editButton.getAttribute("data-id"));
                        });

                        if (book) {
                            form.elements.bookId.value = book.id;
                            form.elements.title.value = book.title;
                            form.elements.author.value = book.author;
                            form.elements.category.value = book.category;
                            form.elements.isbn.value = book.isbn;
                            form.elements.description.value = book.description;
                            msg.textContent = "Editing: " + book.title;
                        }
                    }

                    if (deleteButton && confirm("Delete this book?")) {
                        var data = new FormData();
                        data.append("bookId", deleteButton.getAttribute("data-id"));
                        postForm("book_delete.php", data).then(function (result) {
                            msg.textContent = result.message || "";
                            loadAdminBooks();
                        });
                    }
                };
            });
        }

        function loadOverdue() {
            request("overdue.php", { credentials: "same-origin" }).then(function (data) {
                var overdue = data.overdue || [];
                overdueDiv.innerHTML = overdue.map(function (item) {
                    return '<article class="info-card"><h3>' + escapeHtml(item.title) + '</h3><p>Borrower: ' + escapeHtml(item.full_name) + '</p><p>Due Date: ' + escapeHtml(item.due_date) + '</p><p>Days Late: ' + escapeHtml(item.days_late) + '</p></article>';
                }).join("") || "<p>No overdue items.</p>";
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            postForm("books.php", new FormData(form)).then(function (result) {
                msg.textContent = result.message || "";
                if (result.success) {
                    form.reset();
                    form.elements.bookId.value = "";
                    loadAdminBooks();
                }
            });
        });

        resetBtn.addEventListener("click", function () {
            form.reset();
            form.elements.bookId.value = "";
            msg.textContent = "Form cleared.";
        });

        loadAdminBooks();
        loadOverdue();
    }

    function initPage() {
        var page = document.body.getAttribute("data-page");
        if (page === "home") renderHomePage();
        else if (page === "search") renderSearchPage();
        else if (page === "details") renderDetailsPage();
        else if (page === "account") renderAccountPage();
        else if (page === "login") renderLoginPage();
        else if (page === "register") renderRegisterPage();
        else if (page === "contact") renderContactPage();
        else if (page === "admin") renderAdminPage();
    }

    loadSession().then(initPage);
})();
