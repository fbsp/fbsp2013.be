if (Meteor.is_client) {

var Router = Backbone.Router.extend({
  
  routes: { '': 'main',
  ':page': 'main',
  },
  main: function(page) {
    page = page ? page : "main";
    Session.set('currentPage', page);
    var frag = Meteor.render(function () {
                            var i = Template[page] ? Template[page]() : "";
                            return i; });
    $('div#container').html(frag)
  },

});

/*Template.fbsp.renderPage = function() {
    var page = Session.get('currentPage');
    var frag = Meteor.render(function () {
                            var i = Template[page] ? Template[page]() : "";
                            return i; });
    return frag
    }*/

var app = new Router;
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

}