'use strict';

console.log('Ładowanie przyspieszacza loterii.');

function modify() {
  function normalizeNumber(number) {
    return number.replace(/[^0-9A-Za-z]/, '').toUpperCase();
  }

  function removeFromTabIndex($field) {
    $field.prop('tabindex', '-1');
  }

  function joinFields(field) {
    let $container = $(`.${field}`);
    removeFromTabIndex($container.find('input'));
    $container.append(`<input type="text" class="injected" name="${field}_full" id="${field}_full" autocomplete="on">`);
    return $(`\#${field}_full`).keyup(function () {
      let chars = normalizeNumber(this.value).split('').concat(new Array(13).join('x').split('x'));
      chars.forEach((ch, idx) => $(`\#${field}_${idx + 1}`).val(ch));
    });
  }

  function selectCategory() {
    $('#branza option:first').removeProp('selected');
    $('#branza option:last').prop('selected', true);
    $('#branza').change();
  }

  function prefillDate() {
    let date = new Date();
    $('#rok').val(date.getFullYear());
    $('#miesiac').val(date.getMonth() + 1);
    $('#dzien').val(date.getDate());
  }

  function handleCommaInAmount() {
    $('#kwota_zl').keydown(event => {
      if (event.which === 188) {
        $('#kwota_gr').focus();
      }
    });
  }

  function solveCaptcha() {
    let $captcha = $('#captcha-input');
    let result = eval($captcha.parent().text().split(' ')[3]);
    $captcha.val(result);
  }

  function checkPermissions() {
    $('#zgoda_dane_pokaz .checkbox').mouseup();
    $('.sprawdzone .checkbox').mouseup();
  }

  window.addEventListener('load', () => {
    selectCategory();
    prefillDate();
    handleCommaInAmount();
    solveCaptcha();
    checkPermissions();

    let $joinedNrKasyField = joinFields('nr_kasy');
    let $joinedNipField = joinFields('nip');

    removeFromTabIndex($('button.ui-datepicker-trigger'));
    $joinedNrKasyField.focus();

    $joinedNrKasyField.change(function () {
      let nrKasy = normalizeNumber(this.value);
      $joinedNipField.val(localStorage.getItem(nrKasy));
    });

    $('#registration-form').submit(() => {
      let nrKasy = normalizeNumber($joinedNrKasyField.val());
      let nip = normalizeNumber($joinedNipField.val());

      localStorage.setItem(nrKasy, nip);

      $joinedNrKasyField.remove();
      $joinedNipField.remove();
    });

    console.log('Przyspieszacz loterii uruchomiony!');
  });
}

// inject
let script = document.createElement('script');
script.innerHTML = `(${modify})();`;
document.body.appendChild(script);
