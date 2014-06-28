/*jslint browser: true, devel: true */ /*globals _, angular, jsyaml */

var app = angular.module('app', ['misc-js/angular-plugins']);

function dedent(string) {
  var EOL = '\n';
  var lines = string.split(EOL);
  var lines_indentation = lines.map(function(line) {
    // find the index of the first non-whitespace
    return line.search(/\S/);
  }).filter(function(indentation) {
    // ignore whitespace-only lines
    return indentation > -1;
  });
  var indentation = Math.min.apply(null, lines_indentation);
  return lines.map(function(line) { return line.slice(indentation); }).join(EOL);
}

app.directive('yaml', function($window) {
  // the most specific link inside each nav that matches
  return {
    template:
      '<table><tr><th>YAML</th><th>JSON</th></tr>' +
        '<td><textarea enhance ng-model="yaml"></textarea></td>' +
        '<td><code ng-bind="json"></code></td>' +
      '</tr></table>',
    replace: true,
    restrict: 'E',
    transclude: true,
    scope: {},
    link: function(scope, element, attrs, ctrl, transclude) {
      transclude(function(clone) {
        var raw = clone.text();
        scope.yaml = dedent(raw).trimLeft();
      });

      scope.$watch('yaml', function() {
        try {
          var doc = jsyaml.load(scope.yaml);
          // console.log('yaml %s -> %s', scope.yaml, doc);
          scope.json = JSON.stringify(doc, null, '  ');
        }
        catch (exc) {
          // console.log('exc', exc)
          scope.json = exc.message;
        }
      });
    }
  };
});
