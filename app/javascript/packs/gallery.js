require("bootstrap/js/dist/tab")
require('lazyload/lazyload');

class Gallery {
  constructor() {
    this.INF_SCROLL_THRESHOLD_PX = 250;
    this.TIMEOUT_MS = 300;
    this.GALLERY_FILTER_ROUTE_REGEX = /\/gallery\/(.*)(\/{0-9}*)*/;

    this.$window = $(window);
    this.$infScroll = $('#infinite-scroll-container');
    this.$filters = $('#gallery-filters');
    this.$resultsTab = $('#gallery-results-tab');
    this.$filtersTab = $('#gallery-filters-tab');
    this.$fader = $('#gallery-tab-content').find('[data-fader]');
    this.$scrollTopBtn = $('#gallery-scroll-top');

    this.baseURL = this.$infScroll.data('url');
    this.currentPage = 0;
    this.canExScroll = true;
    this.loadingPage = false;
    this.isDesktopGallery = $('#desktop-gallery-detector').is(':visible');

    this.init();
  }

  init() {
    this.reset();

    this.setupInfScroll();

    this.$infScroll.on('gallery:load', () => {
      $('.lazyload').lazyload();
    });

    this.$scrollTopBtn.on('click', () => {
      $('html, body').animate({ scrollTop: 0 }, 500);
    });

    this.$filters.on('click', '.gallery-filter-button', e => {
      const $btn = $(e.currentTarget);
      const filterVal = $btn.data('filter-slug');

      this.visitFilteredGallery(filterVal);
    });

    this.$fader.addClass('show');
  }

  reset() {
    this.$infScroll.off('gallery:load');
    this.$filters.off('click');
    this.$resultsTab.off('shown.bs.tab');
    this.$window.off('scroll');
    this.$infScroll.off('scroll');
    this.$scrollTopBtn.off('click');
  }

  /* Filters */
  resetFilterTab() {
    // Make sure filters tab is hidden
    this.$filtersTab.removeClass('active');
  }

  visitFilteredGallery(filter) {
    const locale = this.$filtersTab.attr('data-locale');
    const localePath = locale && locale.length ? `/${locale}` : '';
    const url = `${localePath}/gallery/${this.createFilterPath(filter)}`;

    Turbolinks.visit(url, { action: 'advance' });
  }

  createFilterPath(filter) {
    const pathMatch = window.location.pathname.match(this.GALLERY_FILTER_ROUTE_REGEX) || [];
    let filterPath = pathMatch.length ? pathMatch[1] : '';

    if (filterPath === filter) {
      filterPath = '';
    } else {
      filterPath = filter;
    }

    return filterPath;
  }

  /*
   * This can be used to handle allowing for simultaneous category filtering
   *
   * param  filter string
   * return path string
  createFilterPath(filter) {
    const pathMatch = window.location.pathname.match(this.GALLERY_FILTER_ROUTE_REGEX) || [];
    let filterPath = pathMatch.length ? pathMatch[1].split('_') : [];

    if (!filterPath.filter(v => v.length).length) {
      filterPath = filter;
    } else if (filterPath.indexOf(filter) === -1) {
      filterPath = filterPath.length ? `${filterPath.join('_')}_${filter}` : filter;
    } else {
      filterPath.splice(filterPath.indexOf(filter), 1);
      filterPath = filterPath.join('_');
    }

    return filterPath;
  }
  */

  /* Infinite Scroll */
  setupInfScroll() {
    if (!this.$infScroll.length) return;
    if (this.$infScroll.data('last-page')) return;

    if (this.nearContainerBottom()) {
      this.loadingPage = true;
      this.paginateGallery();
    }

    if (this.isDesktopGallery) {
      this.$infScroll.on('scroll', e => {
        if (this.loadingPage) return;

        this.throttledInfScroll(e);
      });
    } else {
      this.$window.on('scroll', e => {
        if (this.loadingPage) return;

        this.throttledInfScroll(e);
      });
    }
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
      this.$infScroll.off('scroll');
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
    if (this.isDesktopGallery) return this.desktopNearBottom();

    return this.mobileNearBottom();
  }

  desktopNearBottom() {
    const scrollHeight = this.$infScroll[0].scrollHeight;
    const containerBotPos = this.$infScroll.scrollTop() + this.$infScroll.innerHeight();

    return scrollHeight - containerBotPos < this.INF_SCROLL_THRESHOLD_PX;
  }

  mobileNearBottom() {
    const containerHeight = this.$infScroll.outerHeight();
    const bottomWindowPos = this.$window.scrollTop() + this.$window.innerHeight();

    return containerHeight - bottomWindowPos < this.INF_SCROLL_THRESHOLD_PX;
  }
}

new Gallery();
