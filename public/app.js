$(document).ready(function() {

  // ----- Sign In/Sign Up -------------

  // ignore sign in
  $('#close').on('click', function() {
    $('.sign-in-modal').hide();
    $('#sign-out').html('Sign In')
      .addClass('no-user');
  })

  // show modal sign out/sign in
  $('#sign-out').on('click', function() {
    if($(this).hasClass('no-user')) {
      $('.sign-in-modal').show();
    }
  })

  // sign up
  $('#sign-up').on('click', function() {
    var username = $('#username').val();
    var password = $('#password').val();
    var data = {
      type: 'sign up'
    };

    console.log(username, password);

    if(username != undefined && password != undefined) {
      data.username = username;
      data.password = password;
    }

    console.log(data);

    $.post('/home', data).then(function(response) {
      if(response != true) {
        $('.error-message').html(response);
        setTimeout(function() {
          $('.error-message').html('');
        }, 5000);
      }
    })

  })


})
