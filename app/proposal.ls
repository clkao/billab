angular.module 'billab.proposal' []
.factory BillabService: <[$http]> ++ ($http) ->
  do
    get-proposal: (user, proposal) ->
      $http.get '/data/cross-strait-agreement-act.json'


.controller ProposalCtrl: <[$scope BillabService]> ++ ($scope, BillabService) ->
  console.log \proposal
  # XXX watch
  $scope <<< $scope.$stateParam{user, proposal}
  data <- BillabService.get-proposal $scope.user, $scope.proposal .success
  $scope.data = data
