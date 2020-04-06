require("bootstrap/js/dist/tab")

class ContactForm {
  constructor() {
    this.$aboutSelect = $('#contact-about-select');
    this.$productInput = $('#product');
    this.$form = $('#contact-form');
    this.$contactContent = $('#contact-form-content');
    this.$successContent = $('#contact-form-success');

    this.$inputs = {
      about: this.$aboutSelect,
      author: $('#message_author'),
      phone: $('#message_phone'),
      email: $('#message_email'),
      title: $('#message_title'),
      body: $('#message_body')
    };

    this.init();
  }

  reset() {
    this.$aboutSelect.off('change');
  }

  init() {
    this.reset();

    this.$aboutSelect.on('change', e => {
      const val = $(e.currentTarget).val();
      $(`#${val}-tab`).tab('show');
    });

    this.$form.on('submit', e => {
      const $this = $(e.currentTarget);
      const url = $this.data('url');
      const data = $this.serialize();

      e.preventDefault();

      if (this.isValid()) {
        this.sendMessage(url, data);
      }
    });

    this.$form.on('focusin change', '.is-invalid', e => {
      const $this = $(e.currentTarget);
      const validationGroup = $this.data('group');

      if (validationGroup) {
        $(`#contact-form [data-group="${validationGroup}"]`).removeClass('is-invalid');
      } else {
        $this.removeClass('is-invalid');
      }
    });
  }

  isValid() {
    const emailOrPhonePresent = this.$inputs.email.val().length ||
      this.$inputs.phone.val().length;
    let isValid = true;

    if (!emailOrPhonePresent) {
      this.$inputs.email.addClass('is-invalid');
      this.$inputs.phone.addClass('is-invalid');
      isValid = false;
    }

    Object.keys(this.$inputs).forEach(key => {
      if (key === 'email' || key === 'phone') return;

      if (!this.$inputs[key].val()) {
        this.$inputs[key].addClass('is-invalid');
        isValid = false;
      }
    });

    return isValid;
  }

  sendMessage(url, data) {
    $.ajax({
      method: 'post',
      url: url,
      data: data,
      dataType: 'json',
      success: data => {
        this.$contactContent.fadeOut({
          complete: () => this.$successContent.removeClass('fade')
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }
}

$(document).on('turbolinks:load', () => new ContactForm());
