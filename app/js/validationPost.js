app.controller('ValidationPost', ['$scope', '$resource', '$location', 'Session', function($scope, $resource, $location, Session) {
  var MyAssociations = $resource('http://127.0.0.1:9000/association/:id/myassociations?token=:token');
  var Association = $resource('http://127.0.0.1:9000/association/:id?token=:token');
  var Post = $resource('http://127.0.0.1:9000/post/:id?token=:token');

  if(Session.getToken() == null || Session.getAssociation() == null){
    $location.path('/login')
  }

  $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
  };

  $scope.myPosts = []

  MyAssociations.query({id:Session.getAssociation(), token:Session.getToken()}, function(assosId) {
    for (assoId of assosId){
      Association.get({id:assoId, token:Session.getToken()}, function(association){
        var posts = (association.posts != null ? association.posts : [])
        for (postId of posts){
          Post.get({id:postId, token:Session.getToken()}, function(post){
            post.nbLikes = (post.likes != null ? post.likes.length : 0)
            post.nbComments = (post.comments != null ? post.comments.length : 0)
            post.associationName = association.name
            $scope.myPosts.push(post)
          });
        }
      });
    }
  }, function(error) {
      $location.path('/login')
  });

  $scope.onclick = function(post) {
      $location.path('/myPosts/' + post.ID)
   };

}]);
