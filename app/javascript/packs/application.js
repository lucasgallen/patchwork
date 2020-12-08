// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("turbolinks").start()

require("bootstrap/js/dist/dropdown")
require("bootstrap/js/dist/collapse")

require('lazyload/lazyload');

(function() {
  let autoplayIds = [];
  let didScroll = false;

  $(document).on('turbolinks:before-render', () => {
    $(document).on('scroll', () => {
      didScroll = true;
      $(document).off('scroll');
    });
  });

  $(document).on('turbolinks:load', () => {
    $('.lazyload').lazyload();

    if (!didScroll) {
      $('html, body').animate({ scrollTop: 0 }, 500);
    }
  });

  /*
 *    The following is to prevent autoplay elements from autoplaying
 *    from the cache after a new page is requested. Requires autoplay
 *    elements to have `id`s.
 *
 *    source: https://github.com/turbolinks/turbolinks/issues/177#issuecomment-412264060
 */

  $(document).on('turbolinks:before-cache', () => {
    const autoplayElements = document.querySelectorAll('[autoplay]')

    autoplayElements.forEach(element => {
      if (!element.id) throw 'autoplay elements need an ID attribute'

      autoplayIds.push(element.id)
      element.removeAttribute('autoplay')
    });
  });

  $(document).on('turbolinks:before-render', event => {
    autoplayIds = autoplayIds.reduce((ids, id) => {
      const autoplay = event.originalEvent.data.newBody.querySelector('#' + id);

      if (autoplay) {
        autoplay.setAttribute('autoplay', true);
      } else {
        ids.push(id);
      }

      return ids;
    }, [])
  });
})();
