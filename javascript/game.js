$(document).ready(function(){
    $(document).on("click","#enterName",function(){
        var uName = $('#userName').val();
        if(gameObject.player1.name === '' && playerNumber === 0){
            gameObject.numberOfPlayers++;
            gameObject.player1.name = uName;
            playerNumber = 1;
            writeToDB();
        }
        else if(gameObject.player2.name === '' && gameObject.player1.name !== ''){
            gameObject.numberOfPlayers++;
            gameObject.player2.name = uName;
            playerNumber = 2;
            writeToDB();
        }
        $('#row-2').html(`<div class="col"><p>Welcome to the game ${uName}!! You are Player ${playerNumber}</p></div>`);
    });

    $(document).on("click","#restartBtn",function(){
        restartGame();
    });

    $(document).on("click","#resetBtn",function(){
        resetGame();
    });

    database.ref().on("value", function(snapshot) {
        var elem1 = $('#player1');
        var elem2 = $('#player2');
        var player1 = snapshot.child("player1").val();
        var player2 = snapshot.child("player2").val();
        console.log(player1,player2);
        var choice1 = player1.choice;
        var choice2 = player2.choice;
        elem1.html(`<h2>${player1.name}</h2>`);
        elem2.html(`<h2>${player2.name}</h2>`);
        if(playerNumber === 1){
            if(choice1 === ''){
                elem1.append(`<p class='r-p-s'>Rock</p>`);
                elem1.append(`<p class='r-p-s'>Paper</p>`);
                elem1.append(`<p class='r-p-s'>Scissor</p>`);
            }
            else if(choice1 !== '' && choice2 === ''){
                elem1.append(`<h3>${choice1}</h3>`);
            }
            else if(choice1 !== '' && choice2 !== ''){
                elem2.append(`<h3>${choice2}</h3>`);
                elem1.append(`<p>wins : ${player1.wins}</p>`);
                elem1.append(`<p>losses : ${player1.losses}</p>`);
                elem1.append(`<p>ties : ${player1.ties}</p>`);
                elem2.append(`<p>wins : ${player2.wins}</p>`);
                elem2.append(`<p>losses : ${player2.losses}</p>`);
                elem2.append(`<p>ties : ${player2.ties}</p>`);
                $('#message-box').html(`<h3>${snapshot.child("message").val()}</h3>`);
            }
        } else if(playerNumber === 2){
            if(choice2 === ''){
                elem2.append(`<p class='r-p-s'>Rock</p>`);
                elem2.append(`<p class='r-p-s'>Paper</p>`);
                elem2.append(`<p class='r-p-s'>Scissor</p>`);
            }
            else if(choice1 === '' && choice2 !== ''){
                elem1.append(`<h3>${choice1}</h3>`);
            }
            else if(choice1 !== '' && choice2 !== ''){
                elem1.append(`<h3>${choice1}</h3>`);
                elem1.append(`<p>wins : ${player1.wins}</p>`);
                elem1.append(`<p>losses : ${player1.losses}</p>`);
                elem1.append(`<p>ties : ${player1.ties}</p>`);
                elem2.append(`<p>wins : ${player2.wins}</p>`);
                elem2.append(`<p>losses : ${player2.losses}</p>`);
                elem2.append(`<p>ties : ${player2.ties}</p>`);
                $('#message-box').html(`<h3>${snapshot.child("message").val()}</h3>`);
            }
        }
        gameObject.numberOfPlayers = snapshot.child("numberOfPlayers").val();
        gameObject.player1 = player1;
        gameObject.player2 = player2;
      // If any errors are experienced, log them to console.
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    $(document).on("click",'.r-p-s',function(event){
        var choice = event.currentTarget.innerText;
        if(playerNumber === 1){
            gameObject.player1.choice = choice;
        }
        else if(playerNumber === 2){
            gameObject.player2.choice = choice;
        }
        writeToDB();
        if(gameObject.player1.choice !== '' && gameObject.player2.choice !== ''){
            winner = decideWinner(gameObject.player1.choice, gameObject.player2.choice);
            if(winner === 'Player1'){
                gameObject.message = gameObject.player1.name + " wins!!!!!!";
                gameObject.player1.wins++;
                gameObject.player2.losses++;
            } else if(winner === 'Player2'){
                gameObject.message = gameObject.player2.name + " wins!!!!!!";
                gameObject.player1.losses++;
                gameObject.player2.wins++;
            } else {
                gameObject.message = "It's a tie!!!!!!";
                gameObject.player1.ties++;
                gameObject.player2.ties++;
            }
            writeToDB();
        }
    });
});

var playerNumber = 0, winner = '';
var config = {
    apiKey: "AIzaSyC1TD5PkYLvYxVKPmtDbes9uoxphQ20UwE",
    authDomain: "test1-27ccb.firebaseapp.com",
    databaseURL: "https://test1-27ccb.firebaseio.com",
    projectId: "test1-27ccb",
    storageBucket: "test1-27ccb.appspot.com",
    messagingSenderId: "168990791769"
};

firebase.initializeApp(config);

var database = firebase.database();

var gameObject = {
    numberOfPlayers : 0,
    message : '',
    player1 : {
        name : '',
        wins : 0,
        losses : 0,
        ties : 0,
        choice : ''
    },
    player2 : {
        name : '',
        wins : 0,
        losses : 0,
        ties : 0,
        choice : ''
    }
}

function writeToDB(){
    database.ref().set(gameObject);
    console.log(gameObject,playerNumber);
}

function restartGame(){
    gameObject = {
        numberOfPlayers : 2,
        message : '',
        player1 : {
            name : gameObject.player1.name,
            wins : gameObject.player1.wins,
            losses : gameObject.player1.losses,
            ties : gameObject.player1.ties,
            choice : ''
        },
        player2 : {
            name : gameObject.player2.name,
            wins : gameObject.player2.wins,
            losses : gameObject.player2.losses,
            ties : gameObject.player2.ties,
            choice : ''
        }
    }
    writeToDB();
    winner = '';
}

function resetGame(){
    gameObject = {
        numberOfPlayers : 0,
        message : '',
        player1 : {
            name : '',
            wins : '',
            losses : '',
            ties : '',
            choice : ''
        },
        player2 : {
            name : '',
            wins : '',
            losses : '',
            ties : '',
            choice : ''
        }
    }
    writeToDB();
    winner = '';
}

function decideWinner(choice1, choice2){
    if(choice1 === 'Rock'){
        if(choice2 === 'Rock'){
            return 'Tie';
        } else if(choice2 === 'Paper'){
            return 'Player2';
        } else if(choice2 === 'Scissor'){
            return 'Player1';
        }
    } else if(choice1 === 'Paper'){
        if(choice2 === 'Rock'){
            return 'Player1';
        } else if(choice2 === 'Paper'){
            return 'Tie';
        } else if(choice2 === 'Scissor'){
            return 'Player2';
        }
    } else if(choice1 === 'Scissor'){
        if(choice2 === 'Rock'){
            return 'Player2';
        } else if(choice2 === 'Paper'){
            return 'Player1';
        } else if(choice2 === 'Scissor'){
            return 'Tie';
        }
    }
}