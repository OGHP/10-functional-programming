'use strict';
var app = app || {};
/*ASSIGNMENT: wrap script in IIFE with parameter called 'module' & pass in new app object as an argument*/
/*HEATHER COMMENT: Does this mean to wrap all functions into 1 IIFE so they will execute on page load or wrap each function into its own IIFE so it will execute?*/

(function articleViewFunction(module) {
  module.articleView = {};
  module.articleView.populateFilters = () => {
    $('article').each(function() {
      if (!$(this).hasClass('template')) {
        var val = $(this).find('address a').text();
        var optionTag = `<option value="${val}">${val}</option>`;
        if ($(`#author-filter option[value="${val}"]`).length === 0) {
          $('#author-filter').append(optionTag);
        }

        val = $(this).attr('data-category');
        optionTag = `<option value="${val}">${val}</option>`;
        if ($(`#category-filter option[value="${val}"]`).length === 0) {
          $('#category-filter').append(optionTag);
        }
      }
    });
  };

  module.articleView.handleAuthorFilter = () => {
    $('#author-filter').on('change', function() {
      if ($(this).val()) {
        $('article').hide();
        $(`article[data-author="${$(this).val()}"]`).fadeIn();
      } else {
        $('article').fadeIn();
        $('article.template').hide();
      }
      $('#category-filter').val('');
    });
  };

  module.articleView.handleCategoryFilter = () => {
    $('#category-filter').on('change', function() {
      if ($(this).val()) {
        $('article').hide();
        $(`article[data-category="${$(this).val()}"]`).fadeIn();
      } else {
        $('article').fadeIn();
        $('article.template').hide();
      }
      $('#author-filter').val('');
    });
  };

  module.articleView.handleMainNav = () => {
    $('nav').on('click', '.tab', function(e) {
      e.preventDefault();
      $('.tab-content').hide();
      $(`#${$(this).data('content')}`).fadeIn();
    });

    $('nav .tab:first').click();
  };

  module.articleView.setTeasers = () => {
    $('.article-body *:nth-of-type(n+2)').hide();
    $('article').on('click', 'a.read-on', function(e) {
      e.preventDefault();
      if ($(this).text() === 'Read on →') {
        $(this).parent().find('*').fadeIn();
        $(this).html('Show Less &larr;');
      } else {
        $('body').animate({
          scrollTop: ($(this).parent().offset().top)
        },200);
        $(this).html('Read on &rarr;');
        $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
      }
    });
  };

  module.articleView.initNewArticlePage = () => {
    $('.tab-content').show();
    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
    $('#new-form').on('submit', articleView.submit);
  };

  module.articleView.create = () => {
    var article;
    $('#articles').empty();

    article = new module.Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      author_url: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      published_on: new Date().toISOString()
    });

    $('#articles').append(article.toHtml());
    $('pre code').each((i, block) => hljs.highlightBlock(block));
  };

  module.articleView.submit = event => {
    event.preventDefault();
    let article = new module.Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      author_url: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      published_on: new Date().toISOString()
    });

    article.insertRecord();

    // REVIEW: The following line of code redirects the user back to the home page after submitting the form.
    window.location = '../';
  }

  module.articleView.initIndexPage = () => {
    app.Article.all.forEach(a => $('#articles').append(a.toHtml()));

    articleView.populateFilters();
    articleView.handleCategoryFilter();
    articleView.handleAuthorFilter();
    articleView.handleMainNav();
    articleView.setTeasers();
    $('pre code').each((i, block) => hljs.highlightBlock(block));
  };

  module.articleView.initAdminPage = () => {
    /*ASSIGNMENT: call handlebars .compile() when initializing. Assign results to same variable name that's used when author stats are appended to the DOM.*/
    var template = Handlebars.compile($('#author-template').text());

    // REVIEW: We use .forEach() here because we are relying on the side-effects of the callback function: appending to the DOM. The callback is not required to return anything.
    app.Article.numWordsByAuthor().forEach(stat => $('.author-stats').append(template(stat)));

    // REVIEW: Simply write the correct values to the page:
    $('#blog-stats .articles').text(app.Article.all.length);
    $('#blog-stats .words').text(app.Article.numWordsAll());
  };
})(app);

//TODO: ASSIGNMENT: export articleView object

// HEATHER COMMENT: (from MDN) The export statement is used when creating JavaScript modules to export functions, objects, or primitive values from the module so they can be used by other programs with the import statement. How??
// export { articleView };


