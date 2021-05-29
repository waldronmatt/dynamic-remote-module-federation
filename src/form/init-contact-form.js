// code from https://parsleyjs.org/doc/examples/simple.html
import './form-style.scss';
import 'parsleyjs';
import 'jquery-mask-plugin';
import renderTemplate from './template';
import formHTML from './form-html.tpl.html?raw';
import jQueryTest from '../jquery-test/jquery-test';

const printForm = () => {
  const body = document.querySelector('main');
  const form = document.createElement('div');
  body.appendChild(form);
  form.setAttribute('id', 'form-root');
  const html = renderTemplate(formHTML);
  $('#form-root').append(html);
};

const setupLogic = () => {
  $('#demo-form')
    .parsley()
    .on('field:validated', function () {
      var ok = $('.parsley-error').length === 0;
      $('.bs-callout-info').toggleClass('hidden', !ok);
      $('.bs-callout-warning').toggleClass('hidden', ok);
    })
    .on('form:submit', function () {
      return false; // Don't submit form for this demo
    });

  // setup masking
  $('[data-jquery-mask-phone]').mask('(000) 000-0000', {
    placeholder: '__/__/____',
  });
};

const initContactForm = () => {
  jQueryTest();
  printForm();
  setupLogic();
};

export default initContactForm();
