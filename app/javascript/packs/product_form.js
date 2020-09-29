require("trix")
require("bootstrap/js/dist/dropdown");
require("bootstrap-select");

import { DirectUpload } from '@rails/activestorage';

$.fn.selectpicker.Constructor.BootstrapVersion = '4.4.1';

const UPLOAD_PROGRESS_HTML = (() => {
  const $container = $('<div>', { class: 'col-md-6 ml-3 mb-2 ' });
  const $progress = $('<div>', { class: 'progress col-8 p-0 ml-4' });
  const $label = $('<span>', { class: 'progress-file-name col-12' });
  const $percent = $('<span>', { class: 'progress-percent' });
  const $bar = $('<div>', {
      'aria-valuenow': 0,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      class: 'progress-bar progress-bar-striped progress-bar-animated flex-row',
      role: 'progressbar',
      text: '%',
    });
  $bar.prepend($percent);
  $progress.append($bar);
  $container.append($label);
  $container.append($progress);

  return $container;
})();

class ProductForm {
  constructor() {
    this.$productCategories = $('#product-categories');
    this.$galleryImage = $('#gallery-image');
    this.$galleryImagePreview = $('#gallery-image-preview');
    this.$detailImages = $('#detail-images');
    this.$detailImagesPreview = $('#detail-images-preview');
    this.$detailImage = $('#preview-image-clone');
    this.$form = $('#product-form');
    this.$fileInputs = $('input[type="file"]');

    this.init();
  }

  init() {
    if ($('body').hasClass('tr')) {
      require("bootstrap-select/dist/js/i18n/defaults-tr_TR.min.js");
    }

    this.$productCategories.selectpicker();

    this.$galleryImage.change(event => {
      this.prevGalleryImage(event.currentTarget);
    });

    this.$detailImages.change(event => {
      this.prevDetailImages(event.currentTarget);
    });

    this.$detailImagesPreview.on('click', '.detail-image-delete-btn', e => {
      this.handleDetailImageDelete(e);
    });

    this.setupDirectUploads();
  }

  handleDetailImageDelete(e) {
    const $el = $(e.currentTarget);
    const $container = $el.parent();
    if ($el.data('attachment-id') === -1) {
      $container.remove();
      return;
    }

    const confirmation = window.confirm($el.data('confirm'));
    if (!confirmation) return;

    this.deleteDetailImage($el, $container);
  }

  deleteDetailImage($el, $container) {
    $container.addClass('loading');

    $.ajax({
      method: 'delete',
      url: `/admin/attachments/${$el.data('attachment-id')}`,
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      success: response => {
        const defaultDelay = 1000; // Just to let the user know something intentionally happened
        setTimeout(() => $container.remove(), defaultDelay);
      },
      error: err => this.handleDetailImageDeleteError($container, err.responseJSON.message)
    });
  }

  handleDetailImageDeleteError($container, errMessage) {
    $container.removeClass('loading')
    $container.addClass('error');
    $container.find('.detail-image-error').text(errMessage);
  }

  setupDirectUploads() {
    this.$form.on('direct-upload:start', 'input[type="file"]', e => {
      const $prog = $(UPLOAD_PROGRESS_HTML).clone();
      $prog.attr('data-file-id', e.detail.id);
      $prog.find('.progress-file-name').text(e.detail.file.name);
      $prog.find('.progress-percent').text('0');
      $('#image-uploads').append($prog);
    });

    this.$form.on('direct-upload:progress', 'input[type="file"]', e => {
      const $progPercent = $(`[data-file-id="${e.detail.id}"] .progress-percent`);
      const intProgress = e.detail.progress | 0;
      $progPercent.text(intProgress);
      $progPercent.parent().attr('style', `width:${intProgress}%;`);
    });
  }

  prevGalleryImage(input) {
    const reader = new FileReader();
    if (!input.files || !input.files[0]) return;

    reader.onload = e => this.$galleryImagePreview.attr('src', e.currentTarget.result);
    reader.readAsDataURL(input.files[0]);
  }

  prevDetailImages(input) {
    let filesArray = [];
    if (!input.files || !input.files[0]) return;

    filesArray = $.grep(input.files, f => f);
    filesArray.forEach(file => {
      const reader = new FileReader();

      reader.onload = e => {
        const $container = this.$detailImage.clone();
        const $previewImg = $container.find('.detail-image');
        $previewImg.attr('src', e.currentTarget.result);
        $container.appendTo(this.$detailImagesPreview);
      };

      reader.readAsDataURL(file);
    });
  }
}

new ProductForm();
