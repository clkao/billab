angular.module 'billab.proposal' []
.factory BillabService: <[$http]> ++ ($http) ->
  do
    get-proposal: (user, proposal) ->
      $http.get "/data/#{proposal}.json"


.controller ProposalCtrl: <[$scope BillabService]> ++ ($scope, BillabService) ->
  console.log \proposal
  # XXX watch or resolve with ui-state
  $scope <<< $scope.$stateParam{user, proposal}
  data <- BillabService.get-proposal $scope.user, $scope.proposal .success
  $scope.data = data
