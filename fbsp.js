// create a new separate part in the database called "comments":
Comments = new Meteor.Collection("comments");

if (Meteor.isServer) {
    Meteor.startup(function () {
        if (Comments.find().count() === 0) {
            var comments = [{
                // description of the objects to be put in the database:
                "top": 50,
                    "left": 50,
                    "text": 'This is a an example of a commentary',
                    "author": 'FBSP',
                    "email": 'info@fbsp.net'
            }, {
                "top": 110,
                    "left": 405,
                    "text": 'and research project',
                    "author": 'FBSP',
                    "email": 'info@fbsp.net'
            }, ];
            for (var i = 0; i < comments.length; i++)
            Comments.insert(comments[i]);
        }
    });
}




if (Meteor.isClient) {

    var Router = Backbone.Router.extend({

        routes: {
            '': 'main',
                ':page': 'main',
                'platform/': 'platform_home',
                'platform/:category/': 'platform_category',
                'platform/:themes/:theme': 'platform_theme',
                'platform/:category/:element': 'platform_element',
        },
        main: function (page) {
            page = page ? page : "main";
            this.render(page, {});
        },
        platform_home: function () {
            this.render('platform', {
                "elements": Platform.find({}, {sort: { 
                //sort the elements from the database: descending order
                "focus": -1
                }})
            });
        },
        platform_category: function (category) {
            var elements = Platform.find({
                "category": category
            }, {sort: { 
                //sort the elements from the database: descending order
                "focus": -1
                }});
            this.render('platform_category', {
                "category": category,
                "elements": elements
            });
        },
        platform_element: function (category, elementSlug) {
            Session.set("elementSlug", elementSlug);
            this.render('platform_element', {});
        },
        platform_theme: function (theme) {
            var elements = Platform.find({
                "themes": theme
            }, {sort: { 
                //sort the elements from the database: descending order
                "focus": -1
                }});
            this.render('platform_theme', {
                "theme": theme,
                "elements": elements
            });
        },
        render: function (templateName, context) {
            console.log(templateName, context);

            // BACKGROUND COLOR YELLOW ON PAGES BEGINNING WITH PLATFORM + NO FOOTER)
            if (templateName.indexOf("platform") === 0) {
                $('body').addClass('platform');
                $('footer').remove();
            }
            
            Session.set('currentPage', templateName);
            var frag = Meteor.render(function () {
                var i = Template[templateName] ? Template[templateName](context) : "";
                return i;
            });
            $('div#container').html(frag);
        }

    });


    Template.platform_element.element = function () {
        return  Platform.findOne({
                "slug": Session.get("elementSlug")
            });
    };

    Template.platform_element.relatedElements = function () {
        var element =  Platform.findOne({
                "slug": Session.get("elementSlug")
            });
        if (element) {    
            return Platform.find({
                    "slug": {
                        $ne: element.slug
                    },
                    "themes": {
                        $in: element.themes
                    }
                });
        }
    };

    Template.collective_editing.comments = function () {
        // ici on va chercher dans le base de données:
        return Comments.find();
    };
    //

    /* to open links in new tabs, but not the internal links
     */
    var isExternal = function (href) {
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
        if (href.indexOf("http") === -1 || href.indexOf(document.location.host) !== -1 || href.indexOf("localhost") !== -1 || href.indexOf("127.0.0.1") !== -1) {
            return false;
        }
        return true;
    };

    var app = new Router;
    
    Meteor.startup(function () {
        Backbone.history.start({
            pushState: true
        });
    });

    
    Meteor.startup(function () {
        $('a').smoothScroll();

        $('html').click(function () {
            $(".news-box").hide()
        });

        $('.news-box').click(function (event) {
            event.stopPropagation();
        });


        // une fois que tout la structure de la page est là: action
        $(document).ready(function () {
            //js plugin dotdotdot http://dotdotdot.frebsite.nl/
            $(".ellipsis").dotdotdot({
                //  configuration goes here
            });

            // action: si c'est externe, on attribue à "ça" une target pour le lien qui est un nouvel onglet 
            $("a[href]").each(

            function () {
                if (isExternal($(this).attr('href'))) {
                    $(this).attr('target', '_blank')
                }
            });
            $("#changeimage").click(function () {
                $("#toggle1").toggle();
                $("#toggle2").toggle();
            });

            // add a new comment
            $("#collective-editing").click(function (e) {
                e.preventDefault();
                // only if there are no other comment forms yet
                if ($("form.comment-form").length === 0) {
                    var x = e.pageX - this.offsetLeft;
                    var y = e.pageY - this.offsetTop;
                    var popup = $('<form class="comment-form"><span class="comment">Your comment:<br></span><textarea class="required"></textarea><span class="comment"><br>Name:<br></span><input id="author" type="text" name="author" maxlength="100" class="required"><span class="comment"><br>Email (not public):<br></span><input id="email" type="text" name="email" maxlength="100" class="required email"><a href="#" class="submit"><br>Submit</a><a href="#" class="cancel">/Close</a></form>')
                    popup.css('top', y);
                    popup.css('left', x);

                    popup.find("a.submit").click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (popup.valid()) {
                            Comments.insert({
                                "left": x,
                                "top": y,
                                "text": $("textarea").val(),
                                "author": $("input#author").val(),
                                "email": $("input#email").val()
                            });

                            popup.remove();
                        }
                    });
                    popup.find("a.cancel").click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        popup.remove();
                    });
                    $(this).append(popup)

                    jQuery("#comment-form").validate();
                }

            })
            $(document).ready(function () {
                $('.sp').first().addClass('active');
                $('.sp').hide();
                $('.active').show();
                $('.sp').click(function () {
                    $('.active').removeClass('active').addClass('oldActive');
                    if ($('.oldActive').is(':last-child')) {
                        $('.sp').first().addClass('active');
                    } else {
                        $('.oldActive').next().addClass('active');
                    }
                    $('.oldActive').removeClass('oldActive');
                    $('.sp').fadeOut(50);
                    $('.active').fadeIn(50);
                });
                
                /* < horizontal scrolling > */
                $('.next_nav').click(function () {
                $(this).nextAll(".nav").animate({
                        scrollLeft: '+=400px'
                    });
                });
                $('.prev_nav').click(function () {
                    $(this).nextAll(".nav").animate({
                        scrollLeft: '-=400px'
                    });
                });
                /* DOC READY */
                   
            });



        });
        



    })


}