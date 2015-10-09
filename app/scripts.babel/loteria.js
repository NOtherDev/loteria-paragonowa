'use strict';

console.log('Ładowanie przyspieszacza loterii.');

function modify() {
  function joinFields(field) {
    $(`.${field}`).find('input').prop('tabindex', '-1');
    $(`.${field}`).append(`<input type="text" class="injected" name="${field}_full" id="${field}_full" autocomplete="on">`);
    $(`\#${field}_full`).keyup(function () {
      let chars = this.value.split('').concat(new Array(13).join('x').split('x'));
      chars.forEach((ch, idx) => $(`\#${field}_${idx + 1}`).val(ch));
    });
  }

  setTimeout(() => {
    $('#branza option:first').removeProp('selected');
    $('#branza option:last').prop('selected', true);
    $('#branza').change();

    let date = new Date();
    $('#rok').val(date.getFullYear());
    $('#miesiac').val(date.getMonth() + 1);
    $('#dzien').val(date.getDate());

    $('#kwota_zl').keydown(event => {
      if (event.which === 188) {
        $('#kwota_gr').focus();
      }
    });

    joinFields('nr_kasy');
    joinFields('nip');

    let $captcha = $('#captcha-input');
    let result = eval($captcha.parent().text().split(' ')[3]);
    $captcha.val(result);

    $('#zgoda_dane_pokaz .checkbox').mouseup();
    $('.sprawdzone .checkbox').mouseup();

    $('button.ui-datepicker-trigger').prop('tabindex', '-1');
    $('#nr_kasy_full').focus();

    console.log('Przyspieszacz loterii uruchomiony!');
  }, 1000);
}

// inject
let script = document.createElement('script');
script.innerHTML = `(${modify})();`;
document.body.appendChild(script);
