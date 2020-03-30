class HomeGallery {
  constructor() {
    this.GALLERY_INTERVAL_MS = 3000;
    this.FADE_INTERVAL_MS = 500;
    this.$jumbotronGallery = $('#jumbotron-gallery');
    this.$jumbotronBackground = $('#jumbotron-background');

    this.init();
  }

  init() {
    this.startGalleryCycle();
  }

  startGalleryCycle() {
    let absolutePathIndex = 1;
    const imagePaths = this.$jumbotronBackground.data('paths');

    setInterval(() => {
      let nextPathIndex = (absolutePathIndex % imagePaths.length);
      this.imageFade(imagePaths[nextPathIndex]);

      absolutePathIndex += 1;
    }, this.GALLERY_INTERVAL_MS);
  }

  imageFade(path) {
    this.$jumbotronBackground.fadeOut(this.FADE_INTERVAL_MS, () => {
      this.$jumbotronBackground.attr('src', path);
      setTimeout(() => {
        this.$jumbotronBackground.fadeIn(this.FADE_INTERVAL_MS);
      }, this.fade_interval_ms / 3);
    });
  }
}

new HomeGallery();
