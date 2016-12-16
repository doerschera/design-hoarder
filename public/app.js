$(document).ready(function() {
  var favoriteArticles;

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

    if(username != undefined && password != undefined) {
      data.username = username;
      data.password = password;
    } else {
      return false;
    }

    console.log(data);

    $.post('/home', data).then(function(response) {
      if(response != true) {
        $('.error-message').html(response);
        setTimeout(function() {
          $('.error-message').html('');
        }, 5000);
      } else {
        $('.sign-in-modal').hide();
      }
    })
  })

  // sign in
  $('#sign-in').on('click', function() {
    var username = $('#username').val();
    var password = $('#password').val();
    var data = {
      type: 'sign in'
    };

    $('#sign-out').html('Sign Out')
      .removeClass('no-user');

    if(username != undefined && password != undefined) {
      data.username = username;
      data.password = password;
    } else {
      return false;
    }

    $.post('/home', data).then(function(response) {
      if(typeof response != 'object') {
        $('.error-message').html(response);
        setTimeout(function() {
          $('.error-message').html('');
        }, 5000);
      } else {
        console.log(response);
        $('.sign-in-modal').hide();
        // save favorites articles
        favoriteArticles = response;
        pastFavorites(favoriteArticles);
      }
    })
  })

  // -------- Favorites -------------------

  $('.favorite').on('click', function() {
    $(this).html('favorite');

    var articleId = $(this).attr('data-article-id');
    var data = {
      id: articleId,
      type: 'add favorite'
    };

    favoriteArticles.push(articleId);

    $.post('/home', data).then(function(response) {
      console.log(response);
    })
  })

  // mark already favorites articles
  function pastFavorites(articles) {
    articles.forEach(function(id) {
      $('[data-article-id-f='+id+']').html('favorite');
      $('[data-article-id='+id+']')
        .removeClass('no-favorite');

    })
  }

  $(document).on('click', '.show-favorites', function() {
    console.log('click 1');
    $('.no-favorite').hide();
    $(this).html('Back').css({
      color: 'white',
      backgroundColor: 'black'
    });
    $('.show-favorites').addClass('show-all');
    $('.show-favorites').removeClass('show-favorites');
  })

  $(document).on('click', '.show-all', function() {
    console.log('click');
    $('.no-favorite').show();
    $(this).html('Favorites').css({
      color: 'black',
      backgroundColor: 'white'
    });
    $(this).removeClass('show-all').addClass('show-favorites');
  })


})
