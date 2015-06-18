angular.module 'ly.spy' []
.directive \repeatDone ->
  restrict: \A
  require: \ng-repeat
  controller: <[$scope]> ++ ($scope) ->
    $scope.$emit "repeat:finish" if $scope.$last
.directive \scrollSpy <[$window]> ++ ($window) ->
  restrict: \A
  #scope: true
  transclude: true
  replace: true
  templateUrl: 'app/partials/spy.html'
  link: ($scope, elem, attrs) ->
    $scope
      ..targets = []
      ..$on 'spy:register' (e, target) ->
        $scope.targets.push target
      ..$on 'repeat:finish' (e) ->
        # wait for awhile
        $scope.$evalAsync ->
          $anchors = elem.find attrs.anchor
          $boxes = elem.find attrs.box
          $anchors.each (i) ->
            $elem = $ this
            $box  = $boxes.eq i
            $scope.targets.push do
              anchor:    $elem.attr \id
              heading:   $elem.text!
              offset:    parseInt $elem.css(\margin-top), 10
              box:       $box
              highlight: off
    var p
    $window.onscroll = (event) ->
      var c
      head = 0
      tail = $scope.targets.length
      for ever
        if head is tail
          c = void
          break
        i = (head + tail) / 2
        i = ~~i
        c = $scope.targets[i]
        top    = c.box.offset!top + c.offset
        bottom = c.box.height! + top
        if top <= scroll-y < bottom
          break
        else if scroll-y < top
          tail = i
        else if scroll-y >= bottom
          head = i + 1
      if p isnt c
        $scope.$apply ->
          p?highlight = off
          c?highlight = on
        # use jquery.scrollIntoView()
        # see:
        # /vendor/scripts/jquery.scrollIntoView.min.js
        # https://github.com/Arwid/jQuery.scrollIntoView
        e = elem.find \.highlight
        # FIXME: check targets.length here is not very DRY
        if e.length and e.isOutOfView! and $scope.targets.length >= 3
          e.scrollIntoView!
      p := c

