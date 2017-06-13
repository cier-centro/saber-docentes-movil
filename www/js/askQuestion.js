cont_angular.controller('askTestCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicScrollDelegate',
    function ($scope, $stateParams, $ionicPopup, $state, $ionicScrollDelegate) {
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

        $scope.$on('$ionicView.enter', function () {
            $scope.question = $scope.findQuestion(selected_questions[current_question]);

            if (user_answers[current_question] == null) {
                $scope.data = {"answer": 5};
            } else {
                $scope.data = {"answer": user_answers[current_question]['selected_index']};
            }
            if (selected_questions.length <= current_question + 1) {
                $scope.option = "Terminar Prueba";
            }
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        })

        $scope.current_question = current_question;
        $scope.data = {"answer": 5};
        $scope.option = "Continuar";

        $scope.showConfirm = function () {
            for (var id in user_answers) {
                if (user_answers[id]["selected_index"] > 3) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Reponda todas las preguntas',
                        template: 'Debe Responder todas las preguntas para poder terminar la evaluacion.'
                    });

                    alertPopup.then(function (res) {
                        console.log('Thank you for not eating my delicious ice cream cone');
                    });
                    return null;
                }
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'Terminar la prueba',
                okText: "Si",
                cancelText: "No",
                template: '¿Esta seguro de finalizar la prueba?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $state.go("answersFeedback")
                }
            });
        };

        $scope.saveAndContinue = function () {
            //document.getElementById("mathContainer").innerHTML="{{question.toLoad}}";

            user_answers[current_question] = {"selected_index": $scope.data.answer, "question": $scope.question};
            if (selected_questions.length == current_question + 1) {
                $scope.showConfirm();
            } else {
                $state.go('askaquestion', {}, {reload: true})
                current_question++;
                $scope.current_question = current_question;
                $scope.question = $scope.findQuestion(selected_questions[current_question]);

                if (user_answers[current_question] == null) {
                    $scope.data = {"answer": 5};
                } else {
                    $scope.data = {"answer": user_answers[current_question]['selected_index']};
                }
                if (selected_questions.length <= current_question + 1) {
                    $scope.option = "Terminar Prueba";
                }
            }
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            //MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        }

        $scope.saveAndReturn = function () {

            //document.getElementById("mathContainer").innerHTML="{{question.toLoad}}";
            user_answers[current_question] = {"selected_index": $scope.data.answer, "question": $scope.question};
            if (current_question > 0) {
                $state.go($state.current.name, {}, {reload: true})
                current_question--;
                $scope.current_question = current_question;
                $scope.question = $scope.findQuestion(selected_questions[current_question]);
                $scope.data = {"answer": user_answers[current_question]['selected_index']};
                $scope.option = "Continuar";
            }
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            //MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        }

        $scope.loadPDFAng = function (file) {
            pdfname = "contents/" + file;
            LoadPDF();
            $ionicScrollDelegate.resize();
        }
    }]);
