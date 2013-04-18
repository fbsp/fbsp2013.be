Comments = new Meteor.Collection("comments");

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Comments.find().count() === 0) {
      var comments = [{
                        "top": 50,
                        "left": 50,
                        "text": 'This is a an example of a commentary',
                        "author": 'FBSP',
                        "email": 'info@fbsp2013.be'},
                    {
                        "top": 110,
                        "left": 405,
                        "text": 'and research project',
                        "author": 'FBSP',
                        "email": 'info@fbsp2013.be'},
                    ];
      for (var i = 0; i < comments.length; i++)
        Comments.insert(comments[i]);
    }
  });
}




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



var app = new Router;
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});


Template.collective_editing.comments = function () {
    // ici on va chercher dans le base de données:
    return Comments.find();
  };
  
  
/* to open links in new tabs, but not the internal links
     */
var isExternal = function(href) {
    /*
    "-1" = rien trouvé
    "127.0.0.1" = localhost
    "===" = est
    "!==" = n'est pas (donc "!== -1" = n'a pas rien trouvé ;)
    dans la console: document.location.host [enter] -> trouve quel url c'est
    dans indexOf(document.location.host), document.location.host c'est le host/url du site (ou localhost)
     * isExternal("http://autre-site.com/")
     * true
     * isExternal("/path/")
     * false
     * isExternal("http://spion.me/publications/")
     * false
     * isExternal("http://localhost:8000/publications/")
     * false
     * isExternal("http://127.0.0.1:8000/publications/")
     * false
     */
    if (href.indexOf("http") === -1 || href.indexOf(document.location.host) !== -1 || href.indexOf("localhost") !== -1 || href.indexOf("127.0.0.1") !== -1 ) {
        return false;
    }
    return true;
};
 

Meteor.startup(function () {
    $('a').smoothScroll();

$('html').click(function() {
    $(".news-box").hide()
});

$('.news-box').click(function(event){
   event.stopPropagation();
});


// une fois que tout la structure de la page est là: action
$(document).ready(function() {
    
    // action: si c'est externe, on attribue à "ça" une target pour le lien qui est un nouvel onglet 
    $("a[href]").each(
    function() { 
        if (isExternal($(this).attr('href')) ) { 
            $(this).attr('target', '_blank')
            }
        }
    );
    
    // add a new comment
    $("#collective-editing").click(function(e) {
        e.preventDefault();
        // only if there are no other comment forms yet
        if ($("form.comment-form").length === 0) {
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            var popup = $('<form class="comment-form"><span class="comment">Your comment:<br></span><textarea class="required"></textarea><span class="comment"><br>Name:<br></span><input id="author" type="text" name="author" maxlength="100" class="required"><span class="comment"><br>Email (not public):<br></span><input id="email" type="text" name="email" maxlength="100" class="required email"><a href="#" class="submit"><br>Submit</a><a href="#" class="cancel">/Close</a></form>')
            popup.css('top',y);
            popup.css('left',x);

            popup.find("a.submit").click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (popup.valid()) {
                    Comments.insert(
                                    {   "left": x,
                                        "top": y,
                                        "text": $("textarea").val(),
                                        "author": $("input#author").val(),
                                        "email": $("input#email").val()
                                        }
                                    );
                    
                    popup.remove();
                }
            });
            popup.find("a.cancel").click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                popup.remove();
            });
            $(this).append(popup)
            
           jQuery("#comment-form").validate(
      );
        }
        
    })
    

    
});



})


}