// var app = new Vue({
//     el: "#app",
//     data: {
//         url: "https://api.myjson.com/bins/zyv02",
//         books: [],
//         searchBook: ""

//     },

//     methods: {
//         fetchData: function (url) {
//             fetch(url, {
//                 method: "GET"
//             })
//                 .then(response => response.json())
//                 .then(myBooks => {
//                     this.books = myBooks.books;
//                 })
//         }
//     },

//     created: function () {
//         this.fetchData(this.url);
//     },

//     computed: {
//         filteredBooks: function () {
//             return this.books.filter(book => {
//                 return book.title.toLowerCase().includes(this.searchBook.toLowerCase());
//             })
//         }
//     }
// })