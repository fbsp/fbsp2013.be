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
    return Comments.find();
  };
  

Meteor.startup(function () {
    $('a').smoothScroll();

$('html').click(function() {
    $("#news").hide()
});

$('#news').click(function(event){
   event.stopPropagation();
});


$(document).ready(function() {
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