require("bootstrap/js/dist/tab")

class ContactForm {
  constructor() {
    this.MESSAGE_SENT_TIMEOUT = 3000; // in milliseconds

    // TODO: Permanently remove?
    //this.$aboutSelect = $('#contact-about-select');
    this.$aboutHidden = $('#message_product_id');
    this.$productInput = $('#product');
    this.$form = $('#contact-form');
    this.$contactContent = $('#contact-form-content');
    this.$successContent = $('#contact-form-success');
    this.$productModal = $('#product-message-modal');
    this.$modalOpenBtn = $('#product-message-open-btn');
    this.$modalCloseBtn = this.$productModal.find('.close');

    //this.about = this.$aboutSelect.length ? this.$aboutSelect : this.$aboutHidden;
    this.$inputs = {
      //about: this.about,
      author: $('#message_author'),
      phone: $('#message_phone'),
      email: $('#message_email'),
      title: $('#message_title'),
      body: $('#message_body')
    };

    this.$formContainer = this.getFormContainer();

    this.init();
  }

  reset() {
    //if (this.$aboutSelect.length) this.$aboutSelect.off('change');
    this.$form.off('submit');
  }

  getFormContainer() {
    if (this.$contactContent.length) return this.$contactContent;
    return this.$productModal;
  }

  init() {
    this.reset();

    /*
    this.$aboutSelect.on('change', e => {
      const val = $(e.currentTarget).val();
      $(`#${val}-tab`).tab('show');
    });
    */

    this.$form.on('submit', e => {
      const $this = $(e.currentTarget);
      const url = $this.data('url');
      const data = $this.serialize();

      e.preventDefault();

      if (this.isValid()) {
        this.sendMessage(url, data);
        return false;
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
        this.transitionMessageSent();
      },
      error: err => {
        console.log(err);
      }
    });

    this.transitionLoadingState();
  }

  transitionLoadingState() {
    this.$formContainer.addClass('loading');
  }

  transitionMessageSent() {
    this.$formContainer.removeClass('loading');
    this.$formContainer.addClass('success');

    setTimeout(() => {
      const sentCopy = this.$modalOpenBtn.data('success-message');
      this.$modalOpenBtn.text(sentCopy);
      this.$modalOpenBtn.attr('disabled', 'disabled');
      this.$modalCloseBtn.trigger('click');
    }, this.MESSAGE_SENT_TIMEOUT);
  }
}

new ContactForm();
