var demoApp = angular.module('CanvasChessDemoApp', ['luegg.directives']);
demoApp.controller('demoController', function ($scope) {
  
  $scope.fenString = function(newFen) {
    if (angular.isDefined(newFen)) {
      $scope.chessBoard.setFenString(newFen);
    }
    return $scope.chessBoard.getFenString();
  };

  $scope.gameStarted = function() {
    $scope.history = [];
  };

  $scope.playerMoved = function(event) {
    if (false === $scope.chessBoard.isGameOver() &&
        ($scope.chessBoard.history().length % 2) === 1) {
      setTimeout(function() {
        $scope.chessBoard.randomMove();
      }, '1000');
    }
    $scope.updateMoves();
  };

  $scope.updateMoves = function() {
    var moves = [];
    var history = $scope.chessBoard.history();
    for (var i = 0; i < history.length; i++) {
      if (i === history.length - 1) {
        moves.push({white: history[i], black:''});
        break;
      }
      moves.push({white: history[i], black: history[i+1]});
      i++;
    }
    $scope.$apply(function() {
      $scope.history = angular.copy(moves);
    });
  };

  var options = {
    demoMode: false,
    theme: {
      piecesUrl: 'assets/sprites/pieces/Chess_Pieces_Sprite.svg',
      lightSquareColor: '#ccf',
      darkSquareColor: '#55f',
      availableMovesColor: 'rgba(51, 255, 51, .4)'
    },
    position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    canPlay: 'white',
    events : {
      onGameStart:  $scope.gameStarted,
      onPlayerMove: $scope.playerMoved
    }
  };
  $scope.chessBoard = new CanvasChess('demoBoard', options);
});