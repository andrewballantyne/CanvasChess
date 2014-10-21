var demoApp = angular.module('CanvasChessDemoApp', []);

demoApp.controller('demoController', function ($scope) {
	var options = {
    demoMode: false,
    theme: {
      piecesUrl: 'assets/sprites/pieces/Chess_Pieces_Sprite.svg',
      lightSquareColor: '#ccf',
      darkSquareColor: '#55f',
      availableMovesColor: 'rgba(51, 255, 51, .4)'
    },
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    toPlay: 'white',
    events : {
      onGameStart: function(event) {
        console.log('I can beat Carlsen this time.');
      },
      onPlayerMove: function(event) {
        console.log(event.playerColor + " moved to " + event.move);
      },
      onGameEnd: function(event) {
        console.log('At least I lasted ' + event.game.history.moves.length + ' moves');
      }
    }
	};

	$scope.chessBoard = new CanvasChess('demoBoard', options);
	$scope.fenString = function(newFen) {
		if (angular.isDefined(newFen)) {
			$scope.chessBoard.setFenString(newFen);
		}
		return $scope.chessBoard.getFenString();
	};
});