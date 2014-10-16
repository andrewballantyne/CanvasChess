var demoApp = angular.module('CanvasChessDemoApp', []);

demoApp.controller('demoController', function ($scope) {
	var options = {

	};

	$scope.chessBoard = new CanvasChess('demoBoard', options);
	$scope.fenString = function(newFen) {
		if (angular.isDefined(newFen)) {
			$scope.chessBoard.setFenString(newFen);
		}
		return $scope.chessBoard.getFenString();
	};

	$scope.resetBoard = function() {
		$scope.chessBoard.resetBoard();
	};

	$scope.clearBoard = function() {
		$scope.chessBoard.clearBoard();
	}
});