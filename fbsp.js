Comments = new Meteor.Collection("comments");

if (Meteor.isClient) {

  Template.comments.comments = function () {
    return Comments.find({});
  };

  Template.form.events({
    'click input#submit' : function () {
      if (typeof console !== 'undefined')
        Comments.insert({   proposition: $('#proposition').val(),
                            status: "student",
                            details: $('#details').val(),
                            public: true,
                            email: $('#email').val()
        });
    return false;
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Comments.find().count() === 0) {
        Comments.insert({   status: "student",
                            details: "There are no comments yet. this is a default.",
                            public: true,
                            email: "eric@example.com"
        });
    }
  });
}
