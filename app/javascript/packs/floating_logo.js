class FloatingLogo {
  constructor() {
    this.$logo = $('#floating-logo');
    this.lastAbsPos = { x: 0, y: 0 };

    this.reset();
    this.init();
  }

  reset() {
    this.$logo.off('mousedown');
    this.$logo.off('touchstart');
    this.$logo.off('mouseup');
    this.$logo.off('mouseleave');
    this.$logo.off('touchend');
  }

  init() {
    this.setInitPos();

    this.$logo.on('mousedown touchstart', e => this.dragStart(e));

    this.$logo.on('mouseup touchend', e => this.dragEnd(e));
    this.$logo.on('mouseleave', e => this.dragEnd(e));
  }

  setInitPos() {
    this.lastAbsPos.x = this.$logo[0].offsetLeft;
    this.lastAbsPos.y = this.$logo[0].offsetTop;
  }

  dragStart(e) {
    const $el = $(e.currentTarget);

    this.setStartPos(e);
    this.trackMove($el);
  }

  dragEnd(e) {
    const $el = $(e.currentTarget);
    this.untrackMove($el);
  }

  trackMove($el) {
    $el.addClass('moving');
    this.$logo.on('mousemove touchmove', e => this.handleMove(e));
  }

  handleMove(e) {
    e.preventDefault();
    const posChange = this.getRelPosChange(e);
    const absPos = this.getAbsPos(posChange);
    const styleAttr = `top: ${absPos.y}px; left: ${absPos.x}px;`;

    this.lastAbsPos = absPos;
    this.$logo.attr('style', styleAttr);
  }

  getAbsPos(posChange) {
    return {
      x: posChange.x + this.lastAbsPos.x,
      y: posChange.y + this.lastAbsPos.y
    }
  }

  untrackMove($el) {
    $el.removeClass('moving');

    this.$logo.off('mousemove');
    this.$logo.off('touchmove');
  }

  getPageCoordinates(e) {
    return {
        x: e.pageX || e.touches[0].pageX,
        y: e.pageY || e.touches[0].pageY
      };
  };

  setStartPos(e) {
    const page = this.getPageCoordinates(e);
    this.startPos = { x: page.x, y: page.y };
  }

  getRelPosChange(e) {
    const page = this.getPageCoordinates(e);
    const startPos = this.startPos;
    const posChange = {
      x: page.x - startPos.x,
      y: page.y - startPos.y
    };
    this.lastPosChange = posChange;

    this.setStartPos(e);

    return posChange;
  }
}

new FloatingLogo();
