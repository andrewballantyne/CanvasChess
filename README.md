# CanvasChess

A chess rendering engine powered by Canvas.

## Contents

1. [Why use CanvasChess?](#why-use-canvaschess)
2. [Dependencies](#dependencies)
3. [Getting started](#getting-started)
4. [Board options](#board-options)

## Why use CanvasChess?

CanvasChess provides a rendered chess board with equal support for mouse and
touch events. The class also provides move validation, loading FEN strings,
game history and much more. For anything else you might need to build a full
Chess application, the main class provides everything you need to interact with
the board.

Some reasons to use CanvasChess:

* Efficient board rendering with canvas instead of DOM elements.
* Perfect scaling, from the largest 4k desktop monitors to tiny mobile devices.
* Mobile friendly, supporting tap to move. Desktop friendly, support drag and
  drop.
* Full programmatic control enables building a full chess application around the
  rendering library.
* Callback registration allows your application to receive data with every
  internal event.

[Back to Top](#top)

## Dependencies

CanvasChess makes use of the following dependencies:

* [Chess.js](https://github.com/jhlywa/chess.js) for all of the chess logic

[Back to Top](#top)

## Getting started

Simply include all of the dependencies and the required script file in your
web page.

    <script src="chess.min.js"></script>
    <script src="canvaschess.min.js"></script>

As well as a single DOM element with an ID to bind against.

    <div id="myChessBoard"></div>

Then initialize the main class.

    <script>
    var myBoard = new CanvasChess('myChessBoard');
    </script>

It's that simple.

[Back to Top](#top)

## Board options

The CanvasChess class can take a set of options on initialization.

    var myOptions = {
        demoMode: false,
        theme: {
            piecesUrl: 'assets/svg/pieces.svg',
            lightSquareColor: '#FFFFFF',
            darkSquareColor: '#000000'    
        }
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
    var myBoard = new CanvasChess('myChessBoard', myOptions);

[Back to Top](#top)