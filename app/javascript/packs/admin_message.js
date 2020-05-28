class AdminMessage {
  constructor() {
    this.$markRepliedButton = $('#message-replied-button');
    this.init();
  }

  reset() {
    this.$markRepliedButton.off('click');
  }

  init() {
    this.$markRepliedButton.on('click', e => {
      const $el = $(e.currentTarget);
      const url = $el.data('url');
      const confirmation = window.confirm($el.data('confirm-message'));
      if (!confirmation) return;

      $.ajax({
        method: 'put',
        url: url,
        headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
        success: response => {
          Turbolinks.visit(window.location.href, { action: 'replace' });
        },
        error: err => console.log(err)
      });
    });
  }
}

new AdminMessage();
