var app = angular.module('templer', ['ui.router','ngResource', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider){
	
	//top level state. 
	$stateProvider.state('app', {
      controller: 'AppController',
      templateUrl: "templates/app.html",
      abstract : true
    })


  //child state of app, top level of template browser "mini-app"
	$stateProvider.state('app.templateBrowser',{
		controller : 'TemplateBrowser',
		templateUrl : 'templates/templateBrowser.html',
		url : '/templates'
	})
	
		$stateProvider.state('app.templateBrowser.new',{
		controller : 'NewTemplate',
		templateUrl : 'templates/templateNew.html',
		url : '/new'
	})
	$stateProvider.state('app.templateBrowser.detail',{
		controller : 'TemplateDetail',
		templateUrl : 'templates/templateDetail.html',
		url : '/:templateId/detail'
	})
	
	$stateProvider.state('app.templateBrowser.edit',{
		controller : 'TemplateEdit',
		templateUrl : 'templates/templateEdit.html',
		url : '/:templateId/edit'
	})
	
	
	$urlRouterProvider.otherwise('/templates')
});

// Restify factory
app.factory('TemplateManager',function($resource){
	return $resource('/items/:id',
	  {id: '@id'}, {
	    get: {method: 'GET', isArray: true },
	    add: {method: 'POST'},
	    delete: {method: 'DELETE'}
	  }
	);
})


//app's root controller. everything inherits down from here
app.controller('AppController', function($scope) {
	
});

// templateDetails.html
app.controller('TemplateDetail', function($scope,$state,TemplateManager) {
	
	$scope.template = TemplateManager.get($state.params.templateId)
	
});

//  templateNew.html
app.controller('NewTemplate', function($scope,TemplateManager) {
	
	$scope.formData = {};

	var item  = {
		summary: $scope.formData.summary,
        details: $scope.formData.details,
        cgroup: $scope.formData.cGroup,
        ogroup: $scope.formData.oGroup,
        classification: $scope.formData.classification,
        notes: $scope.formData.notes,
        reprio: $scope.formData.rPriority,
        inrprio: $scope.formData.iPriority,
        urprio: $scope.formData.uPriority
	};

	$scope.processForm = function () {
		console.log(item);
		TemplateManager.add(item, function(data){
			item._id = data._id;
			$scope.templates.push(item);
	        $scope.formData = {
				summary: null,
		        details: null,
		        cGroup: null,
		        oGroup: null,
		        classification: null,
		        notes: null,
		        rPriority: null,
		        iPriority: null,
		        uPriority: null
			}	
		});
	};

});

// templateEdit.html;
app.controller('TemplateEdit', function($scope,$state,TemplateManager) {
	$scope.template = TemplateManager.get($state.params.templateId)
});


//templateBrowser.html
app.controller('TemplateBrowser', function($scope,TemplateManager) {
  
  $scope.templates = TemplateManager.get();
	
	$scope.selectedTemp;

	$scope.setSelectedTemplate = function (temp) {
		$scope.selectedTemp = temp;
	};

	$scope.isSelected =  function (temp) {
		if ($scope.selectedTemp) {
			return $scope.selectedTemp === temp;
		}
	};

	$scope.itemClicked = function (id) {
		$scope.activeClass = id;
	}

});