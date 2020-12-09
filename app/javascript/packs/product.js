require("bootstrap/js/dist/modal")
require("bootstrap/js/dist/carousel")

class Product {
  constructor() {
    this.$carousel = $('#product-carousel');
    this.$carouselIndicators = $('#carousel-indicators');

    this.$zoomWindow = $('#zoom-window');
    this.ZOOM_GLASS_ID = 'zoom-glass';
    this.ZOOM_GLASS_HEIGHT = '100';
    this.ZOOM_GLASS_WIDTH = '100';

    this.carouselOffset = this.$carousel.offset();
    this.imageSize = {};

    this.init();
  }

  init() {
    this.$carousel.carousel({ interval: false });
    this.initZoom();
    this.$carousel.on('slide.bs.carousel', e => this.handleSlide(e));
    this.$carousel.on('slid.bs.carousel', e => this.handleSlideEnd(e));

    this.$carousel.on('mousemove', e => this.handleHover(e));
    this.$carousel.hover(() => this.hoverIn(), () => this.hoverOut());
  }

  handleSlide(e) {
    const $nextIndicator = this.$carouselIndicators.find(`[data-slide-to="${e.to}"]`);
    const $activeIndicator = this.$carouselIndicators.find('.active');

    $activeIndicator.toggleClass('active');
    $nextIndicator.toggleClass('active');
  }

  handleSlideEnd(e) {
    this.initZoom();
  }

  initZoom() {
    this.resetZoom();
    const $image = $(this.$carousel.find('.carousel-item.active .product-carousel-image')[0]);
    const zoomGlass = this.createZoomGlass($image);

    zoomGlass.insertAfter($image);
  }

  resetZoom() {
    $(`#${this.ZOOM_GLASS_ID}`).remove();
  }

  createZoomGlass($image) {
    this.imageSize = {
      width: $image.width(),
      height: $image.height(),
    };
    const source = $image.attr('data-zoom-copy');
    const container = $('<div>', {
      class: this.ZOOM_GLASS_ID,
      id: this.ZOOM_GLASS_ID,
      style: `
        --height: ${this.ZOOM_GLASS_HEIGHT}px;
        --width: ${this.ZOOM_GLASS_WIDTH}px;
      `,
    });
    const glassImage = $('<img>', {
      height: this.imageSize.height,
      src: source,
      width: this.imageSize.width,
    });

    container.append(glassImage);

    return container;
  }

  handleHover(e) {
    let position = {
      left: e.pageX - this.carouselOffset.left - (this.ZOOM_GLASS_WIDTH / 2),
      top: e.pageY - this.carouselOffset.top - (this.ZOOM_GLASS_HEIGHT / 2),
    };

    position = this.limitPosition(position);

    this.updateZoomGlass(position);
  }

  limitPosition({ left, top }) {
    const leftMax = this.imageSize.width - this.ZOOM_GLASS_WIDTH;
    const topMax = this.imageSize.height - this.ZOOM_GLASS_HEIGHT;
    let absLeft = left;
    let absTop = top;

    if (left < 0) absLeft = 0;
    if (left > leftMax) absLeft = leftMax;

    if (top < 0) absTop = 0;
    if (top > topMax) absTop = topMax;

    return { left: absLeft, top: absTop };
  }

  hoverIn() {
    $(this.$carousel.find('.carousel-item.active')[0])
      .addClass('zooming');
  }

  hoverOut() {
    $(this.$carousel.find('.carousel-item.active')[0])
      .removeClass('zooming');
  }

  updateZoomGlass({ left, top }) {
    const $glass = $(`#${this.ZOOM_GLASS_ID}`);

    $glass.attr('style', `
      --height: ${this.ZOOM_GLASS_HEIGHT}px;
      --width: ${this.ZOOM_GLASS_WIDTH}px;

      --left: ${left}px;
      --top: ${top}px;
    `);
  }
}

new Product();
