cont_angular.controller('selectQuestionsCtrl', ['$scope', '$stateParams', '$http', '$state', '$ionicPopup', '$ionicModal', '$ionicScrollDelegate',
function ($scope, $stateParams, $http, $state, $ionicPopup, $ionicModal, $ionicScrollDelegate) {

  if (selected_dbas.length == 0) {
    selected_questions = [];
    $state.go("dbasselection");
  }

  $scope.dbas = [];
  $scope.data = {"max_questions": max_questions, "numberofquestions": 0}
  $scope.header_data = {test:test_name,asignature:selected_asignare,level:selected_level}
  $scope.getQuesitonsData = function () {
    $scope.data.max_questions = max_questions;
    var url = "data/questions.json";
    if(ionic.Platform.isAndroid()){
      url = "/android_asset/www/data/questions.json";
    }
    $http.get(url).success(function(response){
      console.log(selected_dbas)
      console.log(response)
      for (var o in selected_dbas){
        console.log(o)
        if (response[selected_dbas[o]]){
          $scope.dbas.push(response[selected_dbas[o]])
        }
      }
      console.log($scope.dbas)
      questions_data = $scope.dbas;
    });
    /*console.log(selected_dbas)
    $http.post("quiz/get-questions", {"dba_list": selected_dbas}).then(function (r) {
    $scope.dbas = r.data;
    questions_data = r.data;
  });*/
};

$scope.$on('$ionicView.enter', function () {
  $scope.getQuesitonsData()
  $scope.data = {"max_questions": max_questions, "numberofquestions": 0}
});

$scope.setCounter = function (e) {
  if (e.target.checked && $scope.data.numberofquestions < $scope.data.max_questions) {
    $scope.data.numberofquestions++;
  } else if (!e.target.checked) {
    $scope.data.numberofquestions--;
  } else {
    e.target.checked = false;
  }
};

$scope.Return = function () {
  $state.go("select_dba");
};


$scope.showTest = function () {
  if ($scope.data.numberofquestions == 0) {
    var alertPopup = $ionicPopup.alert({
      title: 'Seleccione Preguntas',
      template: 'Debe seleccionar preguntas para poder continuar.'
    });

    alertPopup.then(function (res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
    return null;
  }

  var inputs = document.getElementById('question_list').elements;

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      selected_questions.push(inputs[i].name)
    }
  }

  shuffle(selected_questions);
  current_question = 0;

  for (var i in questions_data) {
    for (var j in questions_data[i]["questions"]) {
      var q = questions_data[i]["questions"][j].answers;
      shuffle(q);
      questions_data[i]["questions"][j].answers = q;
    }
  }

  max_questions = $scope.data.max_questions;

  $state.go("show_test");

}

$scope.toggleGroup = function (group) {
  if ($scope.isGroupShown(group))
  $scope.shownGroup = null;
  else
  $scope.shownGroup = group;

  $ionicScrollDelegate.resize();
};

$scope.isGroupShown = function (group) {
  $ionicScrollDelegate.resize();
  return $scope.shownGroup === group;
};

$scope.loadPDFAng = function (file) {
  pdfname = "contents/" + file;
  LoadPDF();
  $ionicScrollDelegate.resize();
}

$scope.showDetail = function ($event, question) {
  if ($scope.popover != null) {
    $scope.popover.remove();
  }

  $scope.questionToDetail = question;

  $scope.getLetter = function (index) {
    return String.fromCharCode(65 + index);
  };

  var template = '<ion-modal-view><ion-header-bar><h4 class="title">Pregunta {{questionToDetail.cod_question}}</h4><div class="buttons"><button class="button button-icon ion-close" ng-click="popover.remove()"></button></div></ion-header-bar><ion-content>'

  template += '<div class="header_question_container">'
  template += '<div class="header_text" align="justify">'
  template += '<h2>{{questionToDetail.header_question}}</h2>'
  template += '</div>'
  template += '</div>'
  switch ($scope.questionToDetail.file) {
    case null:
    break;
    case 'NA':
    break;
    default:
    template += '<div class="card">'
    template += '<div class="item item-text-wrap">'
    var f = $scope.questionToDetail.file

    if (f.match(".pdf$")) {
      template += '<div>'
      template += '<button id="load" class="button button-block load-reading-button" ng-click="loadPDFAng(questionToDetail.file)"><span></span>Cargar lectura</button>'
      template += '<button id="prev" class="button button-balanced" style="display:none">Pagina Anterior</button>'
      template += '<button id="next" class="button button-balanced" style="display:none">Pagina Siguiente</button>'
      template += '<span id="detail" style="display:none">Pagina: <span id="page_num"></span> / <span id="page_count"></span></span>'
      template += '</div>'
      template += '<canvas id="pdf_viewer" class="row" style="height: 800px;display:none"></canvas>'

    } else if (f.match(".jpg$") || f.match(".png$")) {
      template += '<img src="contents/' + $scope.questionToDetail.file + '" class="row">'
    } else if (!f.endsWith('.pdf') && !(f.endsWith('.jpg') || f.endsWith('.png')) && f!='' && f!=null) {
      template += '{{"$$"+questionToDetail.file+"$$"}}'
    }
    template += '</div>'
    template += '</div>'
  }

  template += '<h4>Respuestas:</h4>'
  template += '<div class="question-options">'
  template += '<div ng-repeat="answer in questionToDetail.answers" class="question-option" align="justify">'
  template += '<div class="row row-center">'
  template += '<div id="mathContainer" ng-if="answer.header_answer.match(\'.jpg$\') || answer.header_answer.match(\'.png$\')" >'
  template += '<span class="bullet"></span><img src="contents/{{answer.header_answer}}">'
  template += '</div>'
  template += '<div id="mathContainer" ng-if="!answer.header_answer.match(\'.jpg$\') && !answer.header_answer.match(\'.png$\')" >'
  template += '<span class="bullet"></span>{{answer.header_answer}}'
  template += '</div>'
  template += '</div>'
  template += '</div>'
  template += '</div>'
  template += '<div class="buttons" style="text-align: right;">'
  template += '<button class="button cancel-modal-button" ng-click="popover.remove()"><span></span>Cancelar</button>'
  template += '</div>'
  template += '</ion-content></ion-modal-view>';
  $scope.popover = $ionicModal.fromTemplate(template, {
    scope: $scope,
  });
  $scope.popover.show($event);
  $scope.$on('modal.shown', function () {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  });

  //alert("llego")
};

}]);
