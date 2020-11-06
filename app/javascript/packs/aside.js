class Aside {
  constructor() {
    this.$asideContainer = $('#message-aside').parent();
    this.$asideOpenButton = $('#message-aside-open-button');
    this.$asideCloseButton = $('#message-aside-close-button');

    this.init();
  }

  reset() {
    this.$asideOpenButton.off('click');
    this.$asideCloseButton.off('click');
  }

  init() {
    this.reset();

    this.$asideOpenButton.on('click', e => {
      this.$asideContainer.addClass('open');
    });

    this.$asideCloseButton.on('click', e => {
      this.$asideContainer.removeClass('open');
    });
  }
}

new Aside();
