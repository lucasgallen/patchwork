class AdminMessage {
  constructor() {
    this.$markRepliedButton = $('#message-replied-button');
    this.$deleteButton = $('#message-delete-button');

    this.init();
  }

  reset() {
    this.$markRepliedButton.off('click');
    this.$deleteButton.off('click');
  }

  init() {
    this.reset();

    this.$deleteButton.on('click', e => this.updateMessage(e));
    this.$markRepliedButton.on('click', e => this.updateMessage(e));
  }

  updateMessage(e) {
    const $el = $(e.currentTarget);
    const url = $el.data('url');
    const successLocation = $el.data('goto') || window.location.href;
    const confirmation = window.confirm($el.data('confirm-message'));
    if (!confirmation) return;

    $.ajax({
      method: 'put',
      url: url,
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
      success: response => {
        Turbolinks.visit(successLocation, { action: 'replace' });
      },
      error: err => console.log(err)
    });
  }
}

new AdminMessage();
