require("bootstrap/js/dist/carousel")

class Product {
  constructor() {
    this.$carousel = $('#product-carousel');
    this.$carouselIndicators = $('#carousel-indicators');

    this.init();
  }

  init() {
    this.$carousel.carousel({ interval: false });
    this.$carousel.on('slide.bs.carousel', e => {
      const $nextIndicator = this.$carouselIndicators.find(`[data-slide-to="${e.to}"]`);
      const $activeIndicator = this.$carouselIndicators.find('.active');

      $activeIndicator.toggleClass('active');
      $nextIndicator.toggleClass('active');
    });
  }
}

new Product();
