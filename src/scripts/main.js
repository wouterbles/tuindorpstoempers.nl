// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function() {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

$(document).ready(function() {
  var menuToggle = $('#js-nav-mobile').unbind();
  $('#js-nav').removeClass("show");

  menuToggle.on('click', function(e) {
    e.preventDefault();
    $('#js-nav').slideToggle(function() {
      $('#js-nav-wrapper').toggleClass('nav-open', $(this).is(':visible'));
      if ($('#js-nav').is(':hidden')) {
        $('#js-nav').removeAttr('style');
      }
    });
  });
});

$('#js-table').stacktable();

(function($) {
  var $pswp = $('.pswp')[0];
  var image = [];

  $('.picture').each(function() {
    var $pic = $(this),
      getItems = function() {
        var items = [];
        $pic.find('a').each(function() {
          var $href = $(this).attr('href'),
            $size = $(this).data('size').split('x'),
            $width = $size[0],
            $height = $size[1];

          var item = {
            src: $href,
            w: $width,
            h: $height
          }

          items.push(item);
        });
        return items;
      }

    var items = getItems();

    $.each(items, function(index, value) {
      image[index] = new Image();
      image[index].src = value['src'];
    });

    $pic.on('click', 'figure', function(event) {
      event.preventDefault();

      var $index = $(this).index();
      var options = {
        index: $index,
        bgOpacity: 0.7,
        showHideOpacity: true
      }

      var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
      lightBox.init();
    });
  });
})(jQuery);

/*
--------------------------------
Ajax Contact Form
--------------------------------
+ https://github.com/pinceladasdaweb/Ajax-Contact-Form
+ A Simple Ajax Contact Form developed in PHP with HTML5 Form validation.
+ Has a fallback in jQuery for browsers that do not support HTML5 form validation.
+ version 1.0.1
+ Copyright 2014 Pedro Rogerio
+ Licensed under the MIT license
+ https://github.com/pinceladasdaweb/Ajax-Contact-Form
*/

(function($, window, document, undefined) {
  'use strict';

  var $form = $('#js-contact');

  $form.submit(function(e) {
    // remove the error class
    $('.form-group').removeClass('has-error');
    $('.help-block').remove();

    // get the form data
    var formData = {
      'name': $('#name').val(),
      'email': $('#email').val(),
      'message': $('#message').val()
    };

    // process the form
    $.ajax({
      type: 'POST',
      url: '/theme/tuindorpstoempers2/process.php',
      data: formData,
      dataType: 'json',
      encode: true
    }).done(function(data) {
      // handle errors
      if (!data.success) {
        if (data.errors.name) {
          $('#js-name').addClass('has-error');
          $('#js-name').append('<span class="help-block">' + data.errors.name + '</span>');
        }

        if (data.errors.email) {
          $('#js-email').addClass('has-error');
          $('#js-email').append('<span class="help-block">' + data.errors.email + '</span>');
        }

        if (data.errors.message) {
          $('#js-message').addClass('has-error');
          $('#js-message').append('<span class="help-block">' + data.errors.message + '</span>');
        }
      } else {
        // display success message
        $form[0].reset()
        $("#submit").html('<div class="alert alert-success">' + data.message + '</div>');
        $("#submit").addClass('succes');
      }
    }).fail(function(data) {
      // for debug
      console.log(data)
    });

    e.preventDefault();
  });
}(jQuery, window, document));
