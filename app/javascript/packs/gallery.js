class Gallery {
  constructor() {
    this.$infScroll = $('#infinite-scroll-container');
    this.currentPage = 0;

    this.init();
  }

  init() {
    // hookup scroll event to detect bottom of page
    // is at bottom of infScroll?
      // yes
        // -> paginateGallery
        // -> this.$infScroll.data('current-page', this.currentPage)
  }

  galleryPages() {
    return $('.gallery-page');
  }

  paginateGallery() {
    // load next page
    // this.currentPage += 1
    // append results
    // is last page?
      // -> append end of results markup
      // -> disconnect infinite scroll detection
  }

  nearContainerBottom() {
    // magic here
    // return true or false
  }
}

new Gallery();
