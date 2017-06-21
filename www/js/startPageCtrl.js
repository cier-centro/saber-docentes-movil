cont_angular.controller('startPageCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicScrollDelegate) {
        $scope.buildTest=function(){
          var permissions = cordova.plugins.permissions;
          permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function( status ){
            if ( !status.hasPermission ) {
              permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status){
                $state.go("select_test_type")
              }, null);
            }else{
              $state.go("select_test_type")
            }
          },null);
        }
        $scope.hide=function(a){
          document.getElementById(a).style.display="none";
        }

    }]);
