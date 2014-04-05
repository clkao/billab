var makeLine, notRight, notLeft, lineBasedDiff, charBasedDiffToDiffline, split$ = ''.split;
makeLine = function(){
  return {
    text: '',
    associate: -1
  };
};
notRight = function(target){
  return target !== 'right';
};
notLeft = function(target){
  return target !== 'left';
};
lineBasedDiff = function(text1, text2){
  var dmp, ds, difflines, i$, len$, line;
  dmp = new diff_match_patch;
  dmp.Diff_Timeout = 1;
  dmp.Diff_EditCost = 4;
  ds = dmp.diff_main(text1, text2);
  dmp.diff_cleanupSemantic(ds);
  difflines = charBasedDiffToDiffline(ds);
  for (i$ = 0, len$ = difflines.length; i$ < len$; ++i$) {
    line = difflines[i$];
    if (line.left === '' && line.right !== '') {
      line.state = 'insert';
    } else if (line.left !== '' && line.right === '') {
      line.state = 'delete';
    } else if (line.left !== '' && line.right !== '') {
      line.state = line.left === line.right ? 'equal' : 'replace';
    } else {
      line.state = 'empty';
    }
  }
  return difflines;
};
charBasedDiffToDiffline = function(ds){
  var left_lines, right_lines, i$, len$, ref$, target, text, lines, j$, len1$, i, line, convertToDifflines, max, ref1$, difflines, res$;
  left_lines = [makeLine()];
  right_lines = [makeLine()];
  for (i$ = 0, len$ = ds.length; i$ < len$; ++i$) {
    ref$ = ds[i$], target = ref$[0], text = ref$[1];
    target = (fn$());
    lines = split$.call(text, '\n');
    for (j$ = 0, len1$ = lines.length; j$ < len1$; ++j$) {
      i = j$;
      line = lines[j$];
      if (line !== '') {
        if (target !== 'both') {
          line = "<em>" + line + "</em>";
        }
        if (target === 'both') {
          if (left_lines[left_lines.length - 1].associate < 0) {
            left_lines[left_lines.length - 1].associate = right_lines.length - 1;
          }
          if (right_lines[right_lines.length - 1].associate < 0) {
            right_lines[right_lines.length - 1].associate = left_lines.length - 1;
          }
        }
      }
      if (notRight(target)) {
        left_lines[left_lines.length - 1].text += line;
        if (i !== lines.length - 1) {
          left_lines.push(makeLine());
        }
      }
      if (notLeft(target)) {
        right_lines[right_lines.length - 1].text += line;
        if (i !== lines.length - 1) {
          right_lines.push(makeLine());
        }
      }
    }
  }
  convertToDifflines = function(lines, side, difflines){
    var last, i$, len$, i, ref$, text, associate, results$ = [];
    last = 0;
    for (i$ = 0, len$ = lines.length; i$ < len$; ++i$) {
      i = i$;
      ref$ = lines[i$], text = ref$.text, associate = ref$.associate;
      while (last < associate) {
        difflines[last][side] = '';
        last++;
      }
      difflines[last] == null && (difflines[last] = {});
      difflines[last][side] = text;
      results$.push(last++);
    }
    return results$;
  };
  max = (ref$ = left_lines.length) > (ref1$ = right_lines.length) ? ref$ : ref1$;
  res$ = [];
  for (i$ = 1; i$ <= max; ++i$) {
    i = i$;
    res$.push({});
  }
  difflines = res$;
  convertToDifflines(right_lines, 'right', difflines);
  convertToDifflines(left_lines, 'left', difflines);
  return difflines;
  function fn$(){
    switch (target) {
    case 0:
      return 'both';
    case 1:
      return 'right';
    case -1:
      return 'left';
    }
  }
};
if (typeof module != 'undefined' && module !== null) {
  module.exports = {
    charBasedDiffToDiffline: charBasedDiffToDiffline
  };
}
var replace$ = ''.replace;
function trim(str){
  return replace$.call(str, /^s+/mg, '').replace(/^\s+|\s+$/g, '');
}
angular.module('ly.diff', []).directive('lyDiff', ['$parse', '$sce'].concat(function($parse, $sce){
  return {
    restrict: 'A',
    scope: {
      options: '=lyDiff'
    },
    transclude: true,
    templateUrl: 'app/diff/diff.html',
    controller: ['$transclude', '$element', '$attrs', '$scope'].concat(function($transclude, $element, $attrs, $scope){
      var ref$;
      $scope.$watchCollection(['left', 'right'], function(){
        var ref$;
        if (!($scope.left || $scope.right)) {
          return;
        }
        $scope.leftItem = $scope.heading;
        $scope.leftItemAnchor = $scope.anchor;
        $scope.rightItem = (ref$ = $scope.headingRight) != null
          ? ref$
          : $scope.leftItem;
        $scope.rightItemAnchor = (ref$ = $scope.anchorRight) != null
          ? ref$
          : $scope.leftItemAnchor;
        $scope.baseless = !$scope.left;
        return $scope.difflines = lineBasedDiff($scope.left, $scope.right).map(function(it){
          var ref$;
          it.left = $sce.trustAsHtml(it.left || '無');
          it.right = $sce.trustAsHtml(it.right);
          it.leftdesc = it.state === 'equal' ? '相同' : '現行';
          it.leftstate = it.state === 'equal' ? '' : 'red';
          it.rightstate = (ref$ = it.state) === 'replace' || ref$ === 'empty' || ref$ === 'insert' || ref$ === 'delete' ? 'green' : '';
          it.rightdesc = (function(){
            var ref$;
            switch (ref$ = [it.state], false) {
            case 'replace' !== ref$[0]:
              return '修正';
            case 'delete' !== ref$[0]:
              return '刪除';
            case 'insert' !== ref$[0]:
              return '新增';
            default:
              return '相同';
            }
          }());
          return it;
        });
      });
      if ($scope.options.parse) {
        $transclude(function(clone){
          var comment;
          comment = clone.closest('.comment').text();
          return $scope.comment = $sce.trustAsHtml(comment), $scope.heading = clone.closest('.heading').text(), $scope.anchor = clone.closest('.anchor').text(), $scope.left = trim(clone.closest('.left').text()), $scope.right = trim(clone.closest('.right').text()), $scope;
        });
      } else {
        ($scope.left = (ref$ = $scope.options).left, $scope.right = ref$.right, $scope.heading = ref$.heading, $scope.headingRight = ref$.headingRight, $scope.anchor = ref$.anchor, $scope.anchorRight = ref$.anchorRight, $scope).comment = $sce.trustAsHtml($scope.options.comment);
      }
      if ($scope.heading.match(/^(\d*?)(-(\d*?))?$/)) {
        $scope.heading = '§' + $scope.heading;
      }
      if ((ref$ = $scope.headingRight) != null && ref$.match(/^(\d*?)(-(\d*?))?$/)) {
        return $scope.headingRight = '§' + $scope.headingRight;
      }
    })
  };
}));
angular.module("ly.diff").run(["$templateCache", function($templateCache) {$templateCache.put("app/diff/diff.html","<div ng-class=\"{one: baseless, two: !baseless, colored: !baseless}\" class=\"ui column stackable grid\"><div ng-repeat=\"diffline in difflines track by $index\" ng-if=\"diffline.left || diffline.right\" class=\"row\"><div ng-hide=\"baseless\" class=\"column left {{diffline.state}}\"><div class=\"ui segment article-text\"><div ng-if=\"$index == 0\" class=\"ui ribbon label\"><a id=\"original-{{leftItemAnchor}}\" ng-href=\"#original-{{leftItemAnchor}}\">{{leftItem}}</a></div><div ng-class=\"diffline.leftstate\" class=\"ui right corner label\">{{diffline.leftdesc}}</div><div href=\"\" target=\"blank\" ng-bind-html=\"diffline.left\" class=\"diff text\"></div></div></div><div class=\"column right {{diffline.state}}\"><div ng-class=\"{\'mobile-hide\': !diffline.right}\" class=\"ui segment article-text\"><div ng-if=\"$index == 0\" class=\"ui ribbon label\"><a id=\"proposed-{{rightItemAnchor}}\" ng-href=\"#proposed-{{rightItemAnchor}}\">{{rightItem}}</a></div><div ng-class=\"diffline.rightstate\" class=\"ui right corner label\">{{diffline.rightdesc}}</div><div href=\"\" target=\"blank\" ng-bind-html=\"diffline.right\" class=\"diff text\"></div></div></div></div><div ng-bind-html=\"comment\" ng-show=\"comment\" class=\"ui pointing label diff-comment\"></div></div>");}]);