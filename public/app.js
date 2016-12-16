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




})
