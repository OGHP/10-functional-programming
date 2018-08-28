'use strict';
var app = app || {};

/*ASSIGNMENT: wrap script in IIFE with parameter called 'module' & pass in new app object as an argument*/

/*HEATHER COMMENT: Does this mean to wrap all functions into 1 IIFE so they will execute on page load or wrap each function into its own IIFE so it will execute?

NOTE: you need to call module. on ALL instances of Article!*/

(function articleFunction(module) {
  module.Article= function (rawDataObj) {
    // REVIEW: In Lab 8, we explored a lot of new functionality going on here. Let's re-examine the concept of context. Normally, "this" inside of a constructor function refers to the newly instantiated object. However, in the function we're passing to forEach, "this" would normally refer to "undefined" in strict mode. As a result, we had to pass a second argument to forEach to make sure our "this" was still referring to our instantiated object. One of the primary purposes of lexical arrow functions, besides cleaning up syntax to use fewer lines of code, is to also preserve context. That means that when you declare a function using lexical arrows, "this" inside the function will still be the same "this" as it was outside the function. As a result, we no longer have to pass in the optional "this" argument to forEach!

    //HEATHER COMMENT: 'this' comment above & code below make no sense to me!
    Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
  };

  module.Article.all = [];

  module.Article.prototype.toHtml = function() {
    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.published_on))/60/60/24/1000);
    this.publishStatus = this.published_on ? `published ${this.daysAgo} days ago` : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  module.Article.loadAll = articleData => {
    articleData.sort((a,b) => (new Date(b.published_on)) - (new Date(a.published_on)))

    /* OLD forEach():
    articleData.forEach(articleObject => Article.all.push(new Article(articleObject)));
    */

    /*ASSIGNMENT: in loadAll, refactor the forEach using .map()
    set variables equal to thr rest of a function. If var = result of .map() is will become the transformed array. NO NEED TO PUSH ANYTHING*/

    app.Article.all = articleData.map(articleObject => new module.Article(articleObject));
  };

  module.Article.fetchAll = callback => {
    $.get('/articles')
      .then(results => {
        module.Article.loadAll(results);
        callback();
      })
  };

  /*ASSIGNMENT:Chain together a .map() and a .reduce() call to get a rough count of all the words in an article (use optional accumulator argument in reduce() call*/

  // HEATHER COMMENT: Is that already happening for me here? If so, I don't know how to use the accumulator argument here
  module.Article.numWordsAll = () => {
    return app.Article.all.map(article => article.body.split(' ').length).reduce((acc, cur) => acc + cur);
  };

    /*ASSIGNMENT: Chain together a .map() and a .reduce() call to produce an array of unique author names*/

  module.Article.allAuthors = () => {
    return app.Article.all.map(article => article.author).sort().reduce((acc, cur) => {
      const length = acc.length;
      if (length === 0 || acc[length - 1] !== cur) {
        acc.push(cur);
      }
      return acc;
    }, []);
  };

  module.Article.numWordsByAuthor = () => {
    return app.Article.allAuthors().map(author => {
      var object = {};
      object.author = author;
      object.numWords = app.Article.all.filter(article => article.author === author).map(article => article.body.split(' ').length).reduce((acc, cur) => acc + cur);
      return object;
    });
  };

  module.Article.truncateTable = callback => {
    $.ajax({
      url: '/articles',
      method: 'DELETE',
    })
      .then(console.log)
    // REVIEW: Check out this clean syntax for just passing 'assumed' data into a named function! The reason we can do this has to do with the way Promise.prototype.then() works. It's a little outside the scope of 301 material, but feel free to research!
      .then(callback);
  };

  module.Article.prototype.insertRecord = function(callback) {
    // REVIEW: Why can't we use an arrow function here for .insertRecord()?
    // ANSWER: Because of the lack of context for the "this" reference
    $.post('/articles', {author: this.author, author_url: this.author_url, body: this.body, category: this.category, published_on: this.published_on, title: this.title})
      .then(console.log)
      .then(callback);
  };

  module.Article.prototype.deleteRecord = function(callback) {
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'DELETE'
    })
      .then(console.log)
      .then(callback);
  };

  module.Article.prototype.updateRecord = function(callback) {
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'PUT',
      data: {
        author: this.author,
        author_url: this.author_url,
        body: this.body,
        category: this.category,
        published_on: this.published_on,
        title: this.title,
        author_id: this.author_id
      }
    })
      .then(console.log)
      .then(callback);
  };
})(app);

//TODO: ASSIGNMENT: export Article object

/*HEATHER COMMENT: (from MDN) The export statement is used when creating JavaScript modules to export functions, objects, or primitive values from the module so they can be used by other programs with the import statement. How do I implement that here? export Article doesn't work*/
// export { Article };
