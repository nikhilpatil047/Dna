app.directive('noDigits', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/\d/g, '');
        //console.log(transformedInput);
        if (transformedInput !== text) {
          ngModelCtrl.$setViewValue(transformedInput);
          ngModelCtrl.$render();
        }
        return transformedInput;
        }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
});