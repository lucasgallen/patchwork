require("bootstrap/js/dist/tab")
require('lazyload/lazyload');
require("bootstrap-select");
$.fn.selectpicker.Constructor.BootstrapVersion = '4.4.1';

class Gallery {
  constructor() {
    this.INF_SCROLL_THRESHOLD_PX = 250;
    this.TIMEOUT_MS = 300;
    this.BS_SELECT_ID = 'bs-select-1'; // No options to manually set this
    this.BS_SELECT_BTN_CLASS = 'gallery-category-filters';

    this.$window = $(window);
    this.$infScroll = $('#infinite-scroll-container');
    this.$filterSelect = $('#gallery-category-filters');
    this.$activeFilters = $('#gallery-active-filters');
    this.$clearFiltersBtn = $('#clear-filters-button');
    this.$closeIcon = $('.close-icon').first();
    this.$resultsBtn = $('#gallery-results-button');
    this.$resultsTab = $('#gallery-results-tab');
    this.$filtersTab = $('#gallery-filters-tab');
    this.baseURL = this.$infScroll.data('url');

    this.currentPage = 0;
    this.canExScroll = true;
    this.loadingPage = false;

    this.init();
  }

  init() {
    this.reset();

    this.setupInfScroll();

    this.$infScroll.on('gallery:load', () => {
      $('.lazyload').lazyload();
    });

    this.setupFilters();
  }

  reset() {
    this.$infScroll.off('gallery:load');
    this.$filterSelect.off('loaded.bs.select');
    this.$resultsBtn.off('click');
    this.$resultsTab.off('shown.bs.tab');
    this.$filterSelect.off('changed.bs.select');
    this.$activeFilters.off('click');
    this.$clearFiltersBtn.off('click');
    this.$window.off('scroll');
  }

  resetFilterTab() {
    // Make sure filters tab is hidden
    this.$filtersTab.removeClass('active');
  }

  setupFilters() {
    this.handleFilterSelect();
    this.handleRemoveFilterClick();
    this.handleFilterClear();
    this.handleGetResults();

    this.initFromParams();
  }

  initFromParams() {
    const filters = this.$resultsBtn.data('filters');
    if (!filters) return;

    this.$filterSelect.on('loaded.bs.select', () => {
      $(`.${this.BS_SELECT_BTN_CLASS}`).trigger('click');

      filters.split('_').forEach(filter => {
        let index = this.$filterSelect.find(`[value="${filter}"]`).index();
        $(`#${this.BS_SELECT_ID}-${index}`).trigger('click');
      });
    });
  }

  handleGetResults() {
    this.$resultsBtn.on('click', e => {
      e.preventDefault();

      this.$resultsTab.tab('show');
    });

    this.$resultsTab.on('shown.bs.tab', () => {
      Turbolinks.visit(this.$resultsBtn.attr('href'));
    });
  }

  handleFilterSelect() {
    const $activeFilter = $('<li/>', { class: 'list-group-item active-filter' });

    this.$filterSelect.on('changed.bs.select', (e, clickedIndex, isSelected, prevVal) => {
      const $selectedItem = $(`#${this.BS_SELECT_ID}-${clickedIndex}`);

      this.setResultsButton($(e.currentTarget).val());

      if (isSelected) {
        this.addActiveFilter($activeFilter.clone(), clickedIndex, $selectedItem);
      } else {
        this.removeActiveFilter(clickedIndex);
      }

      this.$clearFiltersBtn.attr('data-disabled', !$('.active-filter').length);
    });
  }

  handleRemoveFilterClick() {
    this.$activeFilters.on('click', '.active-filter', e => {
      const $activeFilter = $(e.currentTarget);
      const selectpickerID = $activeFilter.data('selectpicker-id');
      $(`#${selectpickerID}`).trigger('click');
    });
  }

  handleFilterClear() {
    this.$clearFiltersBtn.on('click', e => {
      const $btn = $(e.currentTarget);
      if ($btn.data('disabled')) return;

      this.removeAllActiveFilters();
    });
  }

  setResultsButton(selectpickerValues) {
    const galleryPath = this.$resultsBtn.data('path');
    this.$resultsBtn.attr('href', `${galleryPath}/${selectpickerValues.join('_')}`);
  }

  addActiveFilter($filterClone, clickedIndex, $selectedItem) {
    let $closeIcon = this.$closeIcon.clone();
    $closeIcon.removeClass('d-none');

    $filterClone.attr('data-index', clickedIndex);
    $filterClone.attr('data-selectpicker-id', $selectedItem.attr('id'));
    $filterClone.text($selectedItem.text());
    $filterClone.append($closeIcon);
    this.$activeFilters.append($filterClone);
  }

  removeActiveFilter(index) {
    this.$activeFilters.find(`[data-index="${index}"]`).remove();
  }

  removeAllActiveFilters() {
    $('.active-filter').each((_, filter) => {
      $(filter).trigger('click');
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

$(document).on('turbolinks:load', () => new Gallery());
