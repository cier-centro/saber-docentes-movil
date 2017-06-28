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
            //son, dos no soy imbecil.
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


        $scope.processQuestion = function (q,index, writer){
            var html = ""
            if(!q.file) q.file=""
            html+="<div>"+"<p>"+q.header_question+ "</p>"
            for (var ans in q.answers){

              if (q.answers[ans].is_correct){
                html+="<div>"
                if (q.answers[ans].header_answer.match(".jpg$") || q.answers[ans].header_answer.match(".png$")){
                  var canvas = document.createElement('canvas');
                  var context = canvas.getContext('2d');
                  var img = document.querySelector('#question_'+index+'_answer_'+ans+' img');
                  if(img.complete && img.naturalHeight){
                    canvas.width = 595;
                    var new_height = 595/img.naturalWidth*img.naturalHeight;
                    canvas.height = new_height;
                    context.drawImage(img, 0, 0, 595, new_height);
                  }
                  imgData = canvas.toDataURL("image/png");
                  html+="<img src='"+imgData+"'>"
                }else{
                  var svg = document.querySelector('#question_'+index+'_answer_'+ans+' svg');
                  if(svg!= null){
                    var ser = new XMLSerializer()
                    html+=ser.serializeToString(svg)
                  }else{
                    html+=q.answers[ans].header_answer
                  }
                }
                html+="</div>"
              }
            }
            return html+"</div>"
        }


        $scope.savePDF = function () {
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile($scope.header_data.filename+".html", {create: true}, function(entry) {
              $scope.fileEntry = entry;
              entry.createWriter(function(writer) {
                var i=0
                var end = true;
                writer.onwriteend  = function(evt) {
                  if(i<$scope.questions.length){
                    writer.write($scope.processQuestion($scope.questions[i].question,i,writer));
                    console.log(i)
                    i++
                  }else{
                    if(end){
                      writer.write("</body></html>")
                      end=false
                    }
                  }
                };
                writer.write('<html><head><meta charset="UTF-8"><style>div{border:2px solid rgb(100,100,100);margin:20px;max-width:95%}span{margin-right:2%;border-bottom:2px solid rgb(100,100,100);background-color:rgb(230,230,230);padding:10px;width:100%;display:block}img{margin:10px 10% 10px 10%;max-width:80%}svg{margin:10px 10% 10px 10%}p{border-bottom:3px solid rgb(100, 100, 100);border-top:3px solid rgb(100, 100, 100);background-color:rgba(200, 200, 200, 1);width:100%}div.respuesta{border:none !important;margin:10px 10% 10px 10%}</style></head><body>');
              }, function(error) {
                console.log("no se pudo crear el escritor de archivos");
              });

            }, function(error){
              console.log("no se pudo crear/obtener archivo");
            });
          },
          function(event){
            console.log("no se pudo acceder al fileSystem");
          });

        }

        $scope.goBack=function(){
          $state.go("show_test")
        }

    }])
