$(document).ready(function() {
  var favoriteArticles;
  var noUser = true;

  // ----- Sign In/Sign Up -------------

  // ignore sign in
  $('#close').on('click', function() {
    $('.sign-in-modal').hide();
    $('#sign-out').html('Sign In')
      .addClass('no-user');
    $('section').css('opacity', '1');
    $('.add-comment').hide();
  })

  // show modal sign out/sign in
  $('#sign-out').on('click', function() {
    if($(this).hasClass('no-user')) {
      $('.sign-in-modal').show();
      $('section').css('opacity', '0.3');
    } else {
      $.post('/signout', {}).then(function(response) {
        if(response) {
          $('.sign-in-modal').show();
          $('section').css('opacity', '0.3');
        }
      });
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

    $.post('/home', data).then(function(response) {
      if(response != true) {
        $('.error-message').html(response);
        setTimeout(function() {
          $('.error-message').html('');
        }, 5000);
      } else {
        $('.sign-in-modal').hide();
        $('section').css('opacity', '1');
        noUser = false;
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
        $('.sign-in-modal').hide();
        $('section').css('opacity', '1');
        noUser = false;
        // save favorites articles
        favoriteArticles = response;
        pastFavorites(favoriteArticles);
      }
    })
  })

  // -------- Favorites -------------------

  $('.favorite').on('click', function() {
    $(this).html('favorite');

    var articleId = $(this).attr('data-article-id-f');
    var data = {
      id: articleId,
      type: 'add favorite'
    };

    console.log(data);

    $('[data-article-id='+articleId+']')
      .removeClass('no-favorite');

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
    $('.no-favorite').hide();
    $(this).html('Back').css({
      color: 'white',
      backgroundColor: 'black'
    });
    $('.show-favorites').addClass('show-all');
    $('.show-favorites').removeClass('show-favorites');

    if(noUser) {
      $('.article-container').append('<h4 class="no-user-favorites">Please sign in to save favorites!</h4>');
    }
  })

  $(document).on('click', '.show-all', function() {
    console.log('click');
    $('.no-favorite').show();
    $('.article-large').hide();
    $('section').css('opacity', '1');
    $(this).html('Favorites').css({
      color: 'black',
      backgroundColor: 'white'
    });
    $(this).removeClass('show-all').addClass('show-favorites');
    if(noUser) {
      $('.no-user-favorites').empty();
    }
  })

  // -------- Comments --------------------
  var largeArticleId;
  $(document).on('click', '.article-item', function() {
    $('#all-comments').empty();
    $('.show-all, .show-favorites').html('Back').css({
      color: 'white',
      backgroundColor: 'black'
    });
    $('.show-favorites').addClass('show-all');
    $('.show-favorites').removeClass('show-favorites');

    var data = $(this).data();
    var articleId = data.articleId;
    largeArticleId = data.articleId;
    var link = data.articleLink;
    var img = $('[data-article-id='+articleId+'] div.article-img img').attr('src');
    var title = $('[data-article-id='+articleId+'] div.article-img img').attr('alt');
    var source = $('[data-article-id='+articleId+'] div.article-title p').html();

    $('.article-large').attr('data-article-id', articleId);
    $('.article-large div.article-img img').attr('src', img);
    $('.article-large div.article-img img').attr('alt', title);
    $('.article-large div.article-title a').attr('href', link);
    $('.article-large div.article-title a h4').html(title);
    $('.article-large div.article-title p').html(source);

    $('.article-large').show();
    $('section').css('opacity', '0.3');

    console.log(articleId);
    // get existing comments from database
    $.get('/home/'+articleId).then(function(response) {
      console.log(response);
      response.forEach(function(comment) {
        var date = comment.date.replace(/T.*/, '');
        console.log(date);
        var commentDiv = $('<div class="comment col s12 l6 offset-l3"></div>');
        var row = $('<div class="row"></div>')
        commentDiv.append(row);
        row.append('<h6>'+comment.username+'</h6>');
        row.append('<p>'+comment.body+'</p>');
        row.append('<p class="date">'+date+'</p>');

        $('#all-comments').append(commentDiv);
      })
    })
  })

  $('#submit-comment').on('click', function() {
    var id = $('.article-large').data()
    var articleId = largeArticleId;
    console.log(articleId);
    var data = {
      article: articleId,
      comment: $('#comment').val(),
      type: 'comment'
    }

    console.log(data);

    $.post('/home', data).then(function(response) {
      console.log(response);
      $('#comment').val('');
      $.get('/home/'+articleId).then(function(response) {
        console.log(response);
        response.forEach(function(comment) {
          var date = comment.date.replace(/T.*/, '');
          console.log(date);
          var commentDiv = $('<div class="comment col s12 l6 offset-l3"></div>');
          var row = $('<div class="row"></div>')
          commentDiv.append(row);
          row.append('<h6>'+comment.username+'</h6>');
          row.append('<p>'+comment.body+'</p>');
          row.append('<p class="date">'+date+'</p>');

          $('#all-comments').append(commentDiv);
        })
      })
    })
  })



})
