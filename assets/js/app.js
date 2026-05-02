
(function() {
    var placeholderCover = "images/books/placeholder-book.svg";

    var booksData = [
        { id: 1, title: "Instruction in Functional Assessment", author: "Robert C. Martin", category: "Educational", year: 2008, description: "Instruction in Functional Assessment introduces learners to functional assessment (FA).", featured: true, cover: "images/books/book1.png" },
        { id: 2, title: "The body keeps the score", author: "Bessel van der Kolk", category: "Psychology", year: 2022, description: "Explores how trauma reshapes both body and brain.", featured: true, cover: "images/books/book2.png" },
        { id: 3, title: "Come Closer", author: "Sara Gran", category: "Horror", year: 2003, description: "A woman's life unravels into violent impulses.", featured: true, cover: "images/books/book3.png" },
        { id: 4, title: "Mrs England", author: "Stacey Halls", category: "Adventure", year: 2013, description: "A nurse uncovers dark secrets in an isolated Yorkshire home.", featured: false, cover: "images/books/book4.png" },
        { id: 5, title: "Ikigai", author: "Héctor García", category: "Psychology", year: 2017, description: "Finding purpose in everyday life.", featured: false, cover: "images/books/book5.png" },
        { id: 6, title: "Ibn Saud", author: "Professor Barbara Bray", category: "Historical", year: 2015, description: "The rise of a fearless warrior and leader.", featured: true, cover: "images/books/book6.png" }
    ];

    var categoryMeta = [
        { name: "Educational", summary: "Learn new skills and concepts.", icon: "ri-school-line" },
        { name: "Psychology", summary: "Mind, behavior, and growth.", icon: "ri-brain-line" },
        { name: "Horror", summary: "Scary and thrilling stories.", icon: "ri-ghost-line" },
        { name: "Adventure", summary: "Exciting journeys and discoveries.", icon: "ri-treasure-map-line" },
        { name: "Historical", summary: "Past events and historical stories.", icon: "ri-ancient-gate-line" }
    ];
 
    var pageMap = {
        home: "index.html",
        search: "search.html",
        details: "book-details.html",
        account: "account.html",
        login: "login.html",
        register: "register.html",
        contact: "contact.html",
        admin: "admin/manage-books.html"
    };

    function getQueryParam(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function renderHomePage() {
        var categoryGrid = document.getElementById("categoryGrid");
        if (categoryGrid) {
            var catHtml = "";
            for (var i = 0; i < categoryMeta.length; i++) {
                var cat = categoryMeta[i];
                catHtml += '<article class="category-card">' +
                    '<div class="category-card-top">' +
                    '<div><p class="eyebrow">' + cat.name + '</p><h3>' + cat.name + '</h3><p>' + cat.summary + '</p></div>' +
                    '<span class="category-icon"><i class="' + cat.icon + '"></i></span>' +
                    '</div>' +
                    '<button type="button" class="secondary-btn" data-category="' + cat.name + '">View Books</button>' +
                    '</article>';
            }
            categoryGrid.innerHTML = catHtml;

            var catButtons = document.querySelectorAll("[data-category]");
            for (var j = 0; j < catButtons.length; j++) {
                catButtons[j].addEventListener("click", function(e) {
                    var catName = e.currentTarget.getAttribute("data-category");
                    window.location.href = pageMap.search + "?category=" + encodeURIComponent(catName);
                });
            }
        }

        var featuredDiv = document.getElementById("featuredBooks");
        if (featuredDiv) {
            var featuredHtml = "";
            for (var k = 0; k < booksData.length; k++) {
                if (booksData[k].featured) {
                    var book = booksData[k];
                    featuredHtml += '<article class="book-card">' +
                        '<div class="book-cover"><img src="' + (book.cover || placeholderCover) + '" alt="' + book.title + '" onerror="this.src=\'' + placeholderCover + '\'"></div>' +
                        '<p class="eyebrow">' + book.category + '</p><h3>' + book.title + '</h3>' +
                        '<div class="book-meta"><span>' + book.author + '</span><span>' + book.year + '</span></div>' +
                        '<footer>' +
                        '<span class="status-pill status-available">available</span>' +
                        '<a class="secondary-btn" href="' + pageMap.details + '?id=' + book.id + '">View Book</a>' +
                        '</footer>' +
                        '</article>';
                }
            }
            featuredDiv.innerHTML = featuredHtml;
        }
    }

    function renderSearchPage() {
        var form = document.getElementById("searchForm");
        var categorySelect = document.getElementById("categorySelect");
        var resultsDiv = document.getElementById("searchResults");
        var summarySpan = document.getElementById("searchSummary");
        if (!form) return;

        var catOptions = '<option value="">All Categories</option>';
        for (var i = 0; i < categoryMeta.length; i++) {
            catOptions += '<option value="' + categoryMeta[i].name + '">' + categoryMeta[i].name + '</option>';
        }
        categorySelect.innerHTML = catOptions;

        var urlCategory = getQueryParam("category");
        if (urlCategory) categorySelect.value = urlCategory;

        function updateResults() {
            var keywordInput = document.getElementById("searchInput");
            var keyword = keywordInput ? keywordInput.value.toLowerCase() : "";
            var selectedCat = categorySelect.value;

            var filtered = [];
            for (var i = 0; i < booksData.length; i++) {
                var b = booksData[i];
                var matchKeyword = (keyword === "") || b.title.toLowerCase().indexOf(keyword) !== -1 || b.author.toLowerCase().indexOf(keyword) !== -1;
                var matchCat = (selectedCat === "") || b.category === selectedCat;
                if (matchKeyword && matchCat) {
                    filtered.push(b);
                }
            }
            summarySpan.innerText = filtered.length + " book(s) found" + (selectedCat ? " in " + selectedCat : "") + ".";
            var resultHtml = "";
            for (var j = 0; j < filtered.length; j++) {
                var book = filtered[j];
                resultHtml += '<article class="book-card">' +
                    '<div class="book-cover"><img src="' + (book.cover || placeholderCover) + '" alt="' + book.title + '" onerror="this.src=\'' + placeholderCover + '\'"></div>' +
                    '<p class="eyebrow">' + book.category + '</p><h3>' + book.title + '</h3>' +
                    '<div class="book-meta"><span>' + book.author + '</span><span>' + book.year + '</span></div>' +
                    '<footer>' +
                    '<span class="status-pill status-available">available</span>' +
                    '<a class="secondary-btn" href="' + pageMap.details + '?id=' + book.id + '">View Book</a>' +
                    '</footer>' +
                    '</article>';
            }
            resultsDiv.innerHTML = resultHtml;
        }

        form.addEventListener("submit", function(e) {
            e.preventDefault();
            updateResults();
        });
        updateResults();
    }

    function renderDetailsPage() {
        var container = document.getElementById("bookDetails");
        if (!container) return;
        var idParam = getQueryParam("id");
        var bookId = idParam ? parseInt(idParam) : booksData[0].id;
        var book = null;
        for (var i = 0; i < booksData.length; i++) {
            if (booksData[i].id === bookId) {
                book = booksData[i];
                break;
            }
        }
        if (!book) {
            container.innerHTML = "<p>Book not found.</p>";
            return;
        }

        container.innerHTML = '<div class="details-layout">' +
            '<article class="book-visual"><img src="' + (book.cover || placeholderCover) + '" alt="' + book.title + '" onerror="this.src=\'' + placeholderCover + '\'"></article>' +
            '<article>' +
            '<p class="eyebrow">Catalog details</p><h2>' + book.title + '</h2><p>' + book.description + '</p>' +
            '<ul class="detail-list">' +
            '<li>Author: ' + book.author + '</li>' +
            '<li>Category: ' + book.category + '</li>' +
            '<li>ISBN: ' + (book.isbn || "N/A") + '</li>' +
            '<li>Year: ' + book.year + '</li>' +
            '</ul>' +
            '<footer>' +
            '<span class="status-pill status-available">available</span>' +
            '<a class="secondary-btn" href="' + pageMap.search + '">Back to Search</a>' +
            '<button class="primary-btn" id="demoBorrowBtn">Borrow Book</button>' +
            '</footer>' +
            '</article>' +
            '</div>';

        var borrowBtn = document.getElementById("demoBorrowBtn");
        if (borrowBtn) {
            borrowBtn.addEventListener("click", function() {
                alert("Book borrowed successfully.");
            });
        }
    }

    // Account page - Library activity section removed
    function renderAccountPage() {
        var currentDiv = document.getElementById("currentBorrowings");
        if (currentDiv) {
            currentDiv.innerHTML = "<p>You have no books borrowed at the moment.</p>";
        }
        var historyDiv = document.getElementById("historyTable");
        if (historyDiv) {
            historyDiv.innerHTML = '<tr><td colspan="5">No borrowing history available.</td></tr>';
        }
        var fineDiv = document.getElementById("fineTable");
        if (fineDiv) {
            fineDiv.innerHTML = '<tr><td colspan="4">No fines to display.</td></tr>';
        }
    }

    //
    function renderLoginPage() {
        var form = document.getElementById("loginForm");
        var msg = document.getElementById("loginMessage");
        if (!form) return;
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            var email = form.elements.email.value.trim();
            var password = form.elements.password.value.trim();
            var role = form.elements.role.value;
            if (!email || !password || !role) {
                msg.textContent = "Please fill all fields.";
                return;
            }
            msg.textContent = "Login successful. Redirecting...";
            
            //
            setTimeout(function() {
                if (role === "admin") {
                    window.location.href = pageMap.admin;
                } else {
                    window.location.href = pageMap.home;
                }
            }, 1000);
        });
    }

    function renderRegisterPage() {
        var form = document.getElementById("registerForm");
        var msg = document.getElementById("registerMessage");
        if (!form) return;
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            var fullName = form.elements.fullName.value.trim();
            var email = form.elements.email.value.trim();
            var pwd = form.elements.password.value.trim();
            var confirm = form.elements.confirmPassword.value.trim();
            if (!fullName || !email || !pwd || !confirm) {
                msg.textContent = "All fields required.";
                return;
            }
            if (pwd !== confirm) {
                msg.textContent = "Passwords do not match.";
                return;
            }
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                msg.textContent = "Invalid email.";
                return;
            }
            msg.textContent = "Account created successfully. You can now login.";
        });
    }

    function renderContactPage() {
        var form = document.getElementById("contactForm");
        var msg = document.getElementById("contactMessage");
        if (!form) return;
        form.addEventListener("submit", function(e) {
            e.preventDefault();
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

        var rows = "";
        for (var i = 0; i < booksData.length; i++) {
            var b = booksData[i];
            rows += '<tr>' +
                '<td>' + b.title + '</td>' +
                '<td>' + b.author + '</td>' +
                '<td>' + b.category + '</td>' +
                '<td><span class="status-pill status-available">available</span></td>' +
                '<td><button class="edit-btn" data-id="' + b.id + '">Edit</button> <button class="delete-btn" data-id="' + b.id + '">Delete</button></td>' +
                '</tr>';
        }
        table.innerHTML = rows;

        var editBtns = document.querySelectorAll(".edit-btn");
        for (var j = 0; j < editBtns.length; j++) {
            editBtns[j].addEventListener("click", function(e) {
                var id = e.currentTarget.getAttribute("data-id");
                var book = null;
                for (var k = 0; k < booksData.length; k++) {
                    if (booksData[k].id == id) book = booksData[k];
                }
                if (book) {
                    form.elements.title.value = book.title;
                    form.elements.author.value = book.author;
                    form.elements.category.value = book.category;
                    form.elements.isbn.value = book.isbn || "";
                    form.elements.description.value = book.description;
                    msg.innerText = "Editing: " + book.title;
                }
            });
        }

        var delBtns = document.querySelectorAll(".delete-btn");
        for (var d = 0; d < delBtns.length; d++) {
            delBtns[d].addEventListener("click", function(e) {
                alert("Book deleted successfully.");
            });
        }

        if (overdueDiv) {
            overdueDiv.innerHTML = "<p>No overdue items.</p>";
        }

        if (form) {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                msg.innerText = "Book saved successfully.";
                form.reset();
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener("click", function() {
                form.reset();
                msg.innerText = "Form cleared.";
            });
        }
    }

    function init() {
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

    init();
})();

