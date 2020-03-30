require("bootstrap-select");
$.fn.selectpicker.Constructor.BootstrapVersion = '4.4.1';

class ProductForm {
  constructor() {
    this.$productCategories = $('#product-categories');
    this.$galleryImage = $('#gallery-image');
    this.$galleryImagePreview = $('#gallery-image-preview');
    this.$detailImages = $('#detail-images');
    this.$detailImagesPreview = $('#detail-images-preview');
    this.$detailImage = $('<img/>', { class: 'w-25 mr-2 mb-2' });

    this.init();
  }

  init() {
    this.$productCategories.selectpicker();

    this.$galleryImage.change(event => {
      this.prevGalleryImage(event.currentTarget);
    });

    this.$detailImages.change(event => {
      this.$detailImagesPreview.empty();
      this.prevDetailImages(event.currentTarget);
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
        const $previewImg = this.$detailImage.clone();
        $previewImg.attr('src', e.currentTarget.result);
        $previewImg.appendTo(this.$detailImagesPreview);
      };

      reader.readAsDataURL(file);
    });
  }
}

new ProductForm();
