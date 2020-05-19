// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("turbolinks").start()

require("bootstrap/js/dist/dropdown")
require("bootstrap/js/dist/collapse")

require('lazyload/lazyload');

$(document).on('turbolinks:load', () => {
  $('.lazyload').lazyload();
  $('html, body').animate({ scrollTop: 0 }, 500);
});
