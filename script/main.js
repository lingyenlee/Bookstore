
$(document).ready(function () {
    cachedFetchBooks()
})

//refactor error handing in fetch to another function 
const handleError = (response) => {
    if (!response.ok) {
        throw Error(repsonse.statusText)
    }
    return response.json()
}

// fetch books from api and cache in sessionStorage
const cachedFetchBooks = async (url, options) => {
    let cacheKey = url
    const response = await fetch(url, options)
    //store in cache if the content-type is JSON or something non-binary
    if (response.status === 200) {
        let ct = response.headers.get("Content-Type");
        if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
            // There is a .json() instead of .text() but 
            // we're going to store it in sessionStorage as 
            // string anyway.
            // If we don't clone the response, it will be 
            // consumed by the time it's returned. This 
            // way we're being un-intrusive. 
            response.clone().text().then(content => {
                sessionStorage.setItem(cacheKey, content);
            });
        }
    }
    return response
}

// fetch book
cachedFetchBooks("https://api.myjson.com/bins/zyv02")
    .then(handleError) //call handle Error - get repsonse if there is no error
    .then(json => {
        // console.log(json.books)
        bookList = json.books
        showBooks(bookList) //create showBooks()
    })
    .catch(err => {
        console.log(err)
    })


// debounce so filtering doesn't happen every millisecond
function debounce(fn, threshold) {
    var timeout;
    threshold = threshold || 100;
    return function debounced() {
        clearTimeout(timeout);
        var args = arguments;
        var _this = this;
        function delayed() {
            fn.apply(_this, args);
        }
        timeout = setTimeout(delayed, threshold);
    };
}


//dynamically show book in the grid
const showBooks = (bookList) => {
    let generateBookList;

    for (var i = 0; i < bookList.length; i++) {
        // console.log(bookList[i])
        generateBookList =

            "<div class='flip-box " + bookList[i].language + "' data-filter ='" + bookList[i].language + "'>"
            + "<div class='flip-box-inner'>"
            + "<div class='flip-box-front'>"
            + "<img src=" + bookList[i].cover + "></div>"
            + "<div class='flip-box-back'>"
            + "<h3>" + bookList[i].title
            + "</h3>" + "<p>" + bookList[i].description + "</p>"
            + "<p class='bookLang'> Language:"
            + bookList[i].language + "</p>"
            + "<div class='info-btn'>"
            + "<button href='" + bookList[i].detail + "'data-fancybox = 'gallery' data-caption ='"
            + bookList[i].title + "'data-thumb = '" + bookList[i].detail + "'class='btn btn-primary' type='button'>"
            + "More Info </button></div></div></div ></div>"

        $(".flip-box-wrapper").append(generateBookList)
    }

    $("[data-fancybox='gallery']").fancybox({
        // Options will go here
    });

    //quick search regex
    let qsRegex

    //init isotope for button filter
    var $grid = $(".grid").isotope({
        itemSelector: ".flip-box",
        layoutMode: 'fitRows',
        filter: function () {
            return qsRegex ? $(this).text().match(qsRegex) : true;
        }
    })

    //filter books when click on button
    $("#filters").on("click", "button", function () {
        let buttonFilter = $(this).attr("data-filter")
        // console.log(buttonFilter)
        $grid.isotope({ filter: buttonFilter })
    })

    //swtich to active button when clicked 
    $('.button-group').each(function (i, buttonGp) {
        let $buttonGp = $(buttonGp);
        $buttonGp.on('click', 'button', function () {
            $buttonGp.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });
    //---------------SEARCH BAR--------------------------

    //use value of search field to filter
    var $quicksearch = $('.quicksearch').keyup(debounce(function () {
        qsRegex = new RegExp($quicksearch.val(), 'gi');
        $grid.isotope();
        // if ($grid.data("isotope").filteredItems.length === 0) {
        //     $(".none-text").show()
        // } else {
        //     $(".none-text").hide()
        // }
        // console.log($grid.data("isotope").filteredItems)
        if (!$grid.data('isotope').filteredItems.length) {
            $("#noResultMsg").show();
        } else {
            $("#noResultMsg").hide();
        }
    }));
}

