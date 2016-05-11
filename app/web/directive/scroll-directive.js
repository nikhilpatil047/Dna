app.directive("scrollToTopWhen", function ($timeout) {
return {
	restrict: 'A',

  	link: function(scope, element, attrs) {
    	scope.$on(attrs.scrollToTopWhen, function () {
      		$timeout(function () {
        	angular.element(element)[0].scrollTop = 0;
      	});
    });
  }
  }
});

app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element(document.querySelector('.activityPanel')).bind("scroll", function() {
        	console.log("this.pageYOffset : " + this.scrollTop + " : " + this.scrollHeight);
            if (this.scrollTop == 0) {
                // scope.isFirstElement = true;
                scope.renderUpdates();
                console.log('Scrolled below header.');
            } else {
                // scope.isFirstElement = false;
                console.log('Header is in view.');
            }
            scope.$apply();
        });
    };
});

