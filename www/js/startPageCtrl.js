cont_angular.controller('startPageCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicScrollDelegate) {
        $scope.buildTest=function(){
          $state.go("select_test_type")
        }
        $scope.hide=function(a){
          document.getElementById(a).style.display="none";
        }

    }]);
