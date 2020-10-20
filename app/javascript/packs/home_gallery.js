class HomeGallery {
  constructor() {
    this.GALLERY_INTERVAL_MS = 3000;
    this.FADE_INTERVAL_MS = 500;
    this.$jumbotronGallery = $('#jumbotron-gallery');
    this.$jumbotronBackground = $('#jumbotron-background');

    this.imagePaths = this.$jumbotronBackground.data('paths');
    this.absolutePathIndex = 1;

    this.init();
  }

  init() {
    this.startGalleryCycle();
  }

  startGalleryCycle() {
    if (!this.$jumbotronBackground.length) return;

    const firstPathIndex = (this.absolutePathIndex % this.imagePaths.length);

    this.imageFade(this.imagePaths[firstPathIndex]);

    this.$jumbotronBackground[0].onload = e => {
      this.$jumbotronBackground.fadeIn(this.FADE_INTERVAL_MS);
      this.scheduleNextImage();
    };
  }

  imageFade(path) {
    this.$jumbotronBackground.fadeOut(this.FADE_INTERVAL_MS, () => {
      this.$jumbotronBackground.attr('src', path);
      this.absolutePathIndex += 1;
    });
  }

  scheduleNextImage() {
    setTimeout(() => {
      const nextPathIndex = (this.absolutePathIndex % this.imagePaths.length);
      this.imageFade(this.imagePaths[nextPathIndex]);
    }, this.GALLERY_INTERVAL_MS);
  }
}

new HomeGallery();
