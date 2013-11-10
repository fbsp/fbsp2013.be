// create a new separate part in the database called "platform":
Platform = new Meteor.Collection("platform");

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Platform.find().count() === 0) {
      var elements = [{
          // description of the objects to be put in the database:
                        "title": 'Title not slugged',
                        "slug": 'slugged-title',
                        "content": 'This is a an example of content',
                        "author": 'FBSP',
                        "date": '04/07/13',
                        "category": 'projects',
                        "themes": ['handwriting', 'book-object'] },
                    {
                        "title": 'Another title',
                        "slug": 'slugged-another-title',
                        "content": 'Another example of content',
                        "author": 'Loraine',
                        "date": '04/07/13',
                        "category": 'tools',
                        "themes": 'book-object'},
                    ];
      for (var i = 0; i < elements.length; i++){
        Platform.insert(elements[i]);
      }
    }
  });
}


