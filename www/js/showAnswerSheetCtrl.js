cont_angular.controller('showAnswerSheetCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicModal', '$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicModal, $ionicScrollDelegate) {
        $scope.header_data={"filename": test_name+" Respuestas"}

        $scope.findQuestion = function (id) {
            for (var k in questions_data) {
                for (var k2 in questions_data[k]["questions"]) {
                    if (questions_data[k]["questions"][k2].id == id) {
                        return questions_data[k]["questions"][k2]
                    }
                }
            }
        }

        $scope.$on('$ionicView.enter', function () {
            user_answers=[]
            for(var q in selected_questions){
              var que=$scope.findQuestion(selected_questions[q])
              user_answers.push({"question": que})
            }
            $scope.questions = user_answers;
            $scope.infoquestions = questions_data;
            $scope.name = user_name;
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        })

        $scope.showfilename=function(){
          $scope.name_popup = $ionicPopup.show({
            template: '<p>Por favor ingrese el nombre del archivo</p><input type="text" ng-model="header_data.filename">',
            title: 'Nombre del archivo',
            subTitle: '',
            scope: $scope,
            buttons: [
              {
                text: 'Cancelar',
                onTap: function (e) {
                  $scope.name_popup.close();
                  return null;
                }
              },
              {
                text: '<b>Continuar</b>',
                type: 'button-positive',
                onTap: function (e) {
                  if (!$scope.header_data.filename) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.header_data.filename;
                  }
                }
              }
            ]
          });

          $scope.name_popup.then(function (res) {
              if (res != null) {
                  $scope.savePDF();
              }
          });

        }


        $scope.savePDF = function () {
            var htmlTemplate = angular.element('<html>')
            htmlTemplate.html('<head><meta charset="UTF-8"></head>')
            var body = angular.element("<body>")
            htmlTemplate.append(body)

            for (var j in $scope.questions) {
              var que = $scope.questions[j].question
              var div = angular.element("<div>")
              body.append("<p>"+que.header_question+ "</p>")
              var imgData = "";
              for (var ans in que.answers){
                if(que.answers[ans].is_correct){
                  var answer = angular.element("<div>");
                  var mark = angular.element("<span>");
                  answer.append(mark)
                  if (que.type==2){
                    var svg = document.querySelector('#question_'+j+'_answer_'+ans+' svg');
                    answer.append(svg)
                  }else{
                    answer.append(que.answers[ans].header_answer)
                  }
                  div.append(answer)
                  break
                }
              }

              body.append(div)
            }
            var pdfOutput = htmlTemplate.html();
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
               fileSystem.root.getFile($scope.header_data.filename+".html", {create: true}, function(entry) {
                  var fileEntry = entry;
                  entry.createWriter(function(writer) {
                     writer.onwrite = function(evt) {
                     alert(entry.nativeURL)
                  };
                     writer.write( pdfOutput );
                  }, function(error) {
                     console.log(error);
                  });

               }, function(error){
                  console.log(error);
               });
            },
            function(event){
             console.log( evt.target.error.code );
            });

        }

        $scope.goBack=function(){
          $state.go("show_test")
        }

    }])
