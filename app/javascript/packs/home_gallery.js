class HomeGallery {
  constructor() {
    this.GALLERY_INTERVAL_MS = 3000;
    this.FADE_INTERVAL_MS = 500;
    this.$jumbotronGallery = $('#jumbotron-gallery');
    this.$jumbotronBackground = $('#jumbotron-background');
    this.$vid = $('#homepage-video video');

    this.imagePaths = this.$jumbotronBackground.data('paths');
    this.absolutePathIndex = 1;
    this.VID_THROTTLE_MS = 30;
    this.canCheckVid = true;
    this.canPause = false;

    this.init();
  }

  init() {
    const buffer = 10;
    this.reset();

    this.startGalleryCycle();

    $(window).on('scroll', () => {
      if (!this.canCheckVid) return;

      if ($(window).scrollTop() > this.$vid.outerHeight() + buffer) {
        this.tryPause();
      } else {
        this.tryPlay();
      }

      this.canCheckVid = false;
      setTimeout(() => {
        this.canCheckVid = true;
      }, this.VID_THROTTLE_MS);
    });
  }

  tryPause() {
    if (!this.canPause) return;

    this.canPause = false;
    this.$vid[0].pause();
    this.$vid.addClass('hide');
  }

  tryPlay() {
    const playPromise = this.$vid[0].play();

    if (playPromise === undefined) return;

    playPromise.then(() => {
      this.$vid.removeClass('hide');
      this.canPause = true;
    });
  }

  reset() {
    $(window).off('scroll');
  }

  startGalleryCycle() {
    if (!this.$jumbotronBackground.length) return;

    const firstPathIndex = (this.absolutePathIndex % this.imagePaths.length);

    this.imageFade(this.imagePaths[firstPathIndex]);

    this.$jumbotronBackground[0].onload = e => {
      this.$jumbotronBackground.fadeIn(this.FADE_INTERVAL_MS);
      if (this.imagePaths > 1) this.scheduleNextImage();
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
