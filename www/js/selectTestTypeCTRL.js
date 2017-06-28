cont_angular.controller('selectTestTypeCTRL', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup',
    function ($scope, $stateParams, $http, $state, $ionicPopup) {
        $scope.data = {"grade": "0", "id_asignature": "NA", max_questions: "0", option: "manual","test_name":""};
        $scope.dbas = []

        $scope.validateFields = function () {
          var hasError = false;
          if (typeof $scope.data.test_name == "undefined") {
            hasError = true;
          }
          if ($scope.data.id_asignature == "NA") {
            hasError = true;
          }
          if ($scope.data.grade == 0) {
            hasError = true;
          }
          if ($scope.data.max_questions == 0) {
            hasError = true;
          }
          if (hasError) {
            var alertPopup = $ionicPopup.alert({
                title: 'Datos faltantes',
                template: 'Debe llenar todos los campos para continuar'
            });
            return false;
          }
          return true;
        }

        $scope.randomQuestion = function(dba_set){

          var max = dba_set.length-1;
          var min = 0;
          var index =  Math.floor(Math.random()*(max-min+1)+min);
          var second = dba_set[index];
          var max2 = second["questions"].length-1;
          var min2 = 0;
          var index2 =  Math.floor(Math.random()*(max2-min2+1)+min2);
          return [index,index2]
        }

        $scope.executeOption = function(){
          if ($scope.validateFields()) {
            test_name= $scope.data.test_name;
            selected_level= $scope.data.grade;
            selected_asignare = $scope.data.id_asignature
            max_questions= $scope.data.max_questions;
            selected_option = $scope.data.option;
            selected_questions = [];
            selected_dbas=[];
            $scope.dbas = [];
            if($scope.data.option=="manual"){
              $state.go("select_dba");
            } else{
              var url = "data/dbas/"+$scope.data.grade+$scope.data.id_asignature+".json";
    					if(ionic.Platform.isAndroid()){
    						url = "/android_asset/www/data/dbas/"+$scope.data.grade+$scope.data.id_asignature+".json";
    					}

    					$http.get(url).success(function(response){
    						var inputs = response;
                for (var i = 0; i < inputs.length; i++) {
                    selected_dbas.push(inputs[i].id);
                }
                var url = "data/questions.json";
    						if(ionic.Platform.isAndroid()){
    							url = "/android_asset/www/data/questions.json";
    						}
    						$http.get(url).success(function(response){
    							for (var o in selected_dbas){
    								if (response[selected_dbas[o]]){
    									$scope.dbas.push(response[selected_dbas[o]])
    								}
    							}
                  console.log($scope.dbas)
                  var qset=[];
                  var added_q = 0;
                  while(added_q<max_questions){
                    var n_q= $scope.randomQuestion($scope.dbas)
                    var add= true
                    for(var e in qset){
                      if(qset[e][0]==n_q[0] && qset[e][1]==n_q[1]){
                        add=false
                      }
                    }
                    if(add){
                      selected_questions.push($scope.dbas[n_q[0]]["questions"][n_q[1]].id);
                      qset.push(n_q)
                      added_q++;
                    }
                  }
    							shuffle(selected_questions);
    							questions_data = $scope.dbas;
                  $state.go("show_test");
    						});
    					});
            }
          }
        }
    }]);
