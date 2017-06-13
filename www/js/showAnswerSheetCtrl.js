cont_angular.controller('showAnswerSheetCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicModal', '$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicModal, $ionicScrollDelegate) {


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

        $scope.savePDF = function () {

            var doc = new jsPDF();
            //var imgData = 'data:image/jpg;base64,' + Base64.encode('images/pruebas.jpeg');
            //doc.addImage(imgData, 'JPEG', 20, 40, 180, 160);
            doc.setFontSize(15);
            doc.text(90, 20, 'Pruebas Saber');
            doc.text(20, 40, 'Nombre: ' + $scope.name);
            doc.text(20, 50, 'Hoja de Resultados: ');
            doc.setFontSize(11);
            doc.setLineWidth(0);
            doc.setTextColor(0, 0, 255);
            doc.line(40, 66, 160, 66);
            doc.text(40, 70, '');
            doc.text(71, 70, 'A.');
            doc.text(96, 70, 'B.');
            doc.text(121, 70, 'C.');
            doc.text(146, 70, 'D.');
            doc.line(40, 71, 160, 71);
            var i = 0;
            //insertar vector de correctas o no de ansuer
            //var is_correct = [0, 1, 0, 1];
            for (var j in $scope.questions) {
                doc.setTextColor(0, 0, 255);
                doc.text(49, 75 + i * 5, (i + 1) + "");
                doc.setTextColor(255, 0, 0);
                for (var k = 0; k < 4; k++) {

                    if ($scope.questions[j].question.answers[k].is_correct * (k + 1) - ($scope.questions[j].selected_index + 1) == 0) {
                        doc.setFillColor(255, 255, 255);
                        doc.rect(71 + 25 * $scope.questions[j].selected_index, 75 + i * 5, 4, -3, 'F');
                        doc.setDrawColor(0, 255, 0);
                        doc.setLineWidth(0.5);
                        doc.line(71 + 25 * $scope.questions[j].selected_index, 75 + i * 5 - 2, 71 + 25 * $scope.questions[j].selected_index + 2, 75 + i * 5);
                        doc.line(71 + 25 * $scope.questions[j].selected_index + 2, 75 + i * 5, 71 + 25 * $scope.questions[j].selected_index + 5, 75 + i * 5 - 5);
                        doc.setDrawColor(0, 0, 0);
                        doc.setLineWidth(0);
                        break;
                    }
                    else {
                        doc.setTextColor(255, 0, 0);
                        doc.text(71 + 25 * $scope.questions[j].selected_index, 75 + i * 5, 'X');
                    }
                }
                doc.line(40, 76 + i * 5, 160, 76 + i * 5);
                i++
            }
            doc.line(40, 66, 40, 76 + (i - 1) * 5);
            doc.line(60, 66, 60, 76 + (i - 1) * 5);
            doc.line(85, 66, 85, 76 + (i - 1) * 5);
            doc.line(110, 66, 110, 76 + (i - 1) * 5);
            doc.line(135, 66, 135, 76 + (i - 1) * 5);
            doc.line(160, 66, 160, 76 + (i - 1) * 5);
            doc.save('Test.pdf');
        }

        $scope.goBack=function(){
          $state.go("show_test")
        }


        $scope.Print = function () {
          /*$ionicScrollDelegate.scrollTop();
    			const electron= nodeRequire('electron').remote;
    			const fs = nodeRequire('fs');
          const dialog = electron.dialog;
          dialog.showSaveDialog({filters:[{name: 'Resultado prueba tipo saber', extensions: ['pdf']}]}, function (fileNames) {
            if (fileNames === undefined) return;
            let win = electron.BrowserWindow.getFocusedWindow();
      			console.log(win)
            win.webContents.printToPDF({
  		           landscape: false
  		      }, function(err, data) {
              var dist = fileNames;
              console.log(dist)
              fs.writeFile(dist, data, function(err) {
                if(err) alert('genearte pdf error', err)
              })
            })
          });*/

        };
    }])
