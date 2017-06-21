cont_angular.controller('showTestCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicModal', '$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicModal, $ionicScrollDelegate) {
        $scope.header_data = {test:test_name,asignature:selected_asignare,level:selected_level,filename:test_name}
        if (selected_questions.length == 0) {
            $state.go("dbasselection");
        }

        $scope.findQuestion = function (id) {
            for (var k in questions_data) {
                for (var k2 in questions_data[k]["questions"]) {
                    if (questions_data[k]["questions"][k2].id == id) {
                        return questions_data[k]["questions"][k2]
                    }
                }
            }
        }
        var renderCanvas = function(){
          for(var q in user_answers){
            var que=user_answers[q].question
            if(que.type==1){
              $scope.loadPDFAng(que.file, q)
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
            MathJax.Hub.Queue([renderCanvas, MathJax.Hub]);
        })

        $scope.loadPDFAng = function (file,group) {
          console.log("pdf_viewer_"+group)
            document.getElementById("pdf_viewer_"+group).style.display="block"
            //document.getElementById("btn_canvas_"+group).style.display="none"
            loadFirstPagePDF("contents/"+file,"pdf_viewer_"+group);
            $ionicScrollDelegate.resize();
        }

        $scope.showQuestion = function (q) {
            if ($scope.modal != null) {
                $scope.modal.remove();
            }
            $scope.questionToDetail = q;
            var template = '<ion-modal-view><ion-header-bar><h4 class="title">Respuesta de pregunta {{questionToDetail.cod_question}}</h4><div class="buttons"><button class="button button-icon ion-close" ng-click="modal.hide()"></button></div></ion-header-bar><ion-content>'
            template += '<h4><p style="margin-left:0.5em">Encabezado:</p></h4>'
            template += '<div class="card">'
            template += '<div class="item item-text-wrap" align="justify">'
            template += '<h2>{{questionToDetail.question.header_question}}</h2>'
            template += '</div>'
            template += '</div>'
            template += '<div class="card">'
            template += '<div class="item item-text-wrap">{{questionToDetail.file}}'
            if ($scope.questionToDetail.question.type == '2') {
                template += '{{questionToDetail.question.file}}'
            } else if ($scope.questionToDetail.question.type == '1') {
                template += '<div>'
                template += '<button id="load" class="button button-balanced" ng-click="loadPDFAng(questionToDetail.question.file)">Cargar lectura</button>'
                template += '<button id="prev" class="button button-balanced" style="display:none">Pagina Anterior</button>'
                template += '<button id="next" class="button button-balanced" style="display:none">Pagina Siguiente</button>'
                template += '<span id="detail" style="display:none">Pagina: <span id="page_num"></span> / <span id="page_count"></span></span>'
                template += '</div>'
                template += '<canvas id="pdf_viewer" class="row" style="height: 800px;display:none"></canvas>'

            } else if ($scope.questionToDetail.question.type == '3') {
                template += '<img src="contents/' + $scope.questionToDetail.question.file + '" class="row">'
            }
            template += '</div>'
            template += '</div>'
            template += '<h4><p style="margin-left:0.5em">Respuestas:</p></h4>'
            template += '<div class="card">'
            template += '<div><div class="row"><div class="col col-25" align="center"><h4>Seleccionada</h4></div><div class="col col-75" align="center"><h4>Respuesta</h4></div></div>'
            template += '<div class="row" ng-repeat="answer in questionToDetail.question.answers track by $index"  >'
            template += '<div class="col col-25" align="center" ng-class="questionToDetail.selected_index==$index ? \'ion-arrow-right-b\':\'SA\'"></div>'
            template += '<div class="col col-75" align="justify" ng-class="answer.is_correct==true ? \'balanced-bg\':\'SA\'">'
            template += '<div class="col col-75" align="justify" ng-class="questionToDetail.selected_index==$index && answer.is_correct==false ? \'assertive-bg\':\'SA\'">'
            //template += '<div class="col col-75" align="justify" ng-class="{true:\'assertive-bg\', false:\'\'}[questionToDetail.selected_index==$index && answer.is_correct==false]">'
            if ($scope.questionToDetail.question.type == 2) {
                template += '{{answer.header_answer}}'
            } else {
                template += '{{answer.header_answer}}'
            }
            template += '</div>'
            template += '</div>'
            template += '</div>'
            template += '</div>'
            template += '<div class="buttons" style="text-align: right;">'
            template += '<p style="margin-right:1em"><button class="button button-assertive" ng-click="modal.hide()">Volver a Resultados</button></p>'
            template += '</div>'
            template += '</ion-content></ion-modal-view>';
            $scope.modal = $ionicModal.fromTemplate(template, {
                scope: $scope
            });
            $scope.modal.show();
            $scope.$on('modal.shown', function () {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            });
        }

        $scope.resetvariablesAndGoBack = function () {
            selected_dbas = [];
            max_questions = 0;
            user_name = "";
            questions_data = {};
            selected_questions = [];
            current_question = 0;
            user_answers = {};
            $state.go('start')
        }

        $scope.backToQuestion = function () {
          if(selected_option=="manual"){
            selected_questions = [];
            $state.go('selectQuestions')
          }else{
            selected_dbas = [];
            max_questions = 0;
            user_name = "";
            questions_data = {};
            selected_questions = [];
            current_question = 0;
            user_answers = {};
            $state.go('select_test_type')
          }
        }


        $scope.showFileName=function(){
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
              if(!que.file) que.file=""
              body.append("<p>"+que.header_question+ "</p>")
              var imgData = "";
              if (que.file.match(".jpg$") || que.file.match(".png$")){
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var img = document.getElementById('ImgContainer_'+j);
                if(img.complete && img.naturalHeight){
                  canvas.width = img.naturalWidth;
                  canvas.height = img.naturalHeight;
                  context.drawImage(img, 0, 0 );
                }
                imgData = canvas.toDataURL("image/png");
                var tempimg= new Image();
                tempimg.src = imgData
                div.append(tempimg)
              }
              if (que.file.match(".pdf$")){
                var canvas = document.getElementById('pdf_viewer_'+j);
                imgData = canvas.toDataURL("image/png");
                var tempimg= new Image();
                tempimg.src = imgData
                div.append(tempimg)
              }
              if (!que.file.match(".pdf$") && !(que.file.match(".jpg$") || que.file.match(".png$"))){
                var svg = document.querySelector('#mathContainer_'+j+" svg");
                div.append(svg)
              }
              for (var ans in que.answers){
                console.log(que.answers[ans])
                var answer = angular.element("<div>");
                var mark = angular.element("<span>");
                answer.append(mark)
                if (que.answers[ans].header_answer.match(".jpg$") || que.answers[ans].header_answer.match(".png$")){
                  var canvas = document.createElement('canvas');
                  var context = canvas.getContext('2d');
                  var img = document.querySelector('#question_'+j+'_answer_'+ans+' img');
                  if(img.complete && img.naturalHeight){
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    context.drawImage(img, 0, 0 );
                  }
                  imgData = canvas.toDataURL("image/png");
                  var tempimg= new Image();
                  tempimg.src = imgData
                  answer.append(tempimg)
                }else{
                  var svg = document.querySelector('#question_'+j+'_answer_'+ans+' svg');
                  if(svg!= null){
                    answer.append(svg)
                  }else{
                    answer.append(que.answers[ans].header_answer)
                  }
                }
                div.append(answer)

              }

              body.append(div)

            }
            var pdfOutput = htmlTemplate.html();
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
               fileSystem.root.getFile($scope.header_data.filename+".html", {create: true}, function(entry) {
                  var fileEntry = entry;
                  entry.createWriter(function(writer) {
                     writer.onwrite = function(evt) {
                     window.open(entry.nativeURL)
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

        $scope.showFileNameTest=function(){
          $scope.test_popup = $ionicPopup.show({
            template: '<p>Por favor ingrese el nombre del archivo</p><input type="text" ng-model="header_data.filename">',
            title: 'Nombre del archivo .prueba',
            subTitle: '',
            scope: $scope,
            buttons: [
              {
                text: 'Cancelar',
                onTap: function (e) {
                  $scope.test_popup.close();
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

          $scope.test_popup.then(function (res) {
              if (res != null) {
                  $scope.saveQuestionary();
              }
          });

        }


        $scope.saveQuestionary = function () {

          var contents = test_name+"\n";
          var codes=[];
          for(var q in user_answers){
            codes.push(user_answers[q].question.cod_question)
          }
          contents+=codes.join(",");

          var pdfOutput = contents;
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
             fileSystem.root.getFile($scope.header_data.filename+".prueba", {create: true}, function(entry) {
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

        };


        $scope.answerSheet=function(){
          $state.go("show_answer_sheet")
        }
    }])
