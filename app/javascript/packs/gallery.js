require('lazyload/lazyload');

class Gallery {
  constructor() {
    this.INF_SCROLL_THRESHOLD_PX = 250;
    this.TIMEOUT_MS = 300;

    this.$window = $(window);
    this.$infScroll = $('#infinite-scroll-container');
    this.baseURL = this.$infScroll.data('url');

    this.currentPage = 0;
    this.canExScroll = true;
    this.loadingPage = false;

    this.init();
  }

  init() {
    this.setupInfScroll();

    this.$infScroll.on('gallery:load', () => {
      $('.lazyload').lazyload();
    });
  }

  setupInfScroll() {
    if (this.$infScroll.data('last-page')) return;

    if (this.nearContainerBottom()) {
      this.loadingPage = true;
      this.paginateGallery();
    }

    this.$window.on('scroll', e => {
      if (this.loadingPage) return;

      this.throttledInfScroll(e);
    });
  }

  galleryPages() {
    return $('.gallery-page');
  }

  paginateGallery() {
    const pageURL = `${this.baseURL}/${this.currentPage + 1}`;

    $.ajax({
      method: 'get',
      url: pageURL,
      dataType: 'json'
    }).done(data => {
      this.addGalleryPage(data);
      this.currentPage += 1;
      this.loadingPage = false;
    }).fail(err => {
      // TODO: setup error handling
      console.log(err);
    });
  }

  addGalleryPage(data) {
    this.$infScroll.append(data.html);
    this.$infScroll.trigger('gallery:load');

    if (data.last) {
      this.$window.off('scroll');
    }
  }

  throttledInfScroll(e) {
    if (!this.canExScroll) return;

    this.canExScroll = false;
    if (this.nearContainerBottom()) {
      this.loadingPage = true;
      this.paginateGallery();
    }

    setTimeout(() => {
      this.canExScroll = true;
    }, this.TIMEOUT_MS);
  }

  nearContainerBottom() {
    const containerHeight = this.$infScroll.outerHeight();
    const bottomWindowPos = this.$window.scrollTop() + this.$window.innerHeight();

    return containerHeight - bottomWindowPos < this.INF_SCROLL_THRESHOLD_PX;
  }
}

new Gallery();
