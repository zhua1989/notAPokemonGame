// Setup Pokemon Constructor and creat two instances
var Pokemon = function(name, health, lvl, moves){
  this.name = name;
  this.health = health;
  this.lvl = lvl;
  this.effect = null;
  this.moves = moves;
};

//create pokemon moves 
var charmanderMoves = [{name:"Ember", type:"Attack", power: 20, accuracy:.80},
  {name:"Scratch", type:"Attack", power: 15, accuracy:.90},
  {name:"Growl", type:"Defense", power: .20, accuracy:1.0},
  {name:"Tail Whip", type:"Defense", power: .65, accuracy:.65},
]

//create pokemon object from constructor 
var charmander = new Pokemon ("Charmander", 100, 12, charmanderMoves)

//create other pokemon moves
var pikachuMoves = [{name:"Thundershock", type:"Attack", power: 10, accuracy:.80},
  {name:"Bolt", type:"Attack", power: 20, accuracy:.85},
  {name:"Tail Whip", type:"Defense", power: .20, accuracy:1.0},
  {name:"Growl", type:"Defense", power: .55, accuracy:.55},
]

// create other pokemon object from constructors
var pikachu = new Pokemon("Pikachu", 100, 11, pikachuMoves)


//Declare variables for state Machine/ and empty variables to reference the pokemons you will use
var currentState;
var cpuPokemon;
var userPokemon;


//Define computer turn mechanics
var cpuTurn = {
  play: function(){
    //get random number and use that to pick a random move for Computer
    var randomMove = Math.floor(Math.random() * 4);
    var currentCpuMove = cpuPokemon.moves[randomMove];
    console.log(currentCpuMove)
    //Delcare function to set up Cpu Move
    var setupCpuMove = function(){
      $("#chat-box").text("What will " + cpuPokemon.name + "do?");
      // $("#chat-box").text(cpuPokemon.name + " has decided to play " + currentCpuMove.name);
      prepareToAttack();
    }

    //declare function to for move preparation/animation
    var prepareToAttack = function(){
      //use jQuery animate pokemon image
      $("#pikachu-img").animate({ top: "-= 25" }, 300, function(){
        $("#pikachu-img").animate({
          top: "+= 25"
        }, 300)
      })
      //call get Accuracy function
      getAccuracy();
    }

    //declare function to see if cpu move is successful or not
    var getAccuracy = function(){
      //function to determine if cpu move is successful or not
      var setAccuracy = Math.random();
      if (setAccuracy <= currentCpuMove.accuracy){
        $("#chat-box").text(cpuPokemon.name + " used " + currentCpuMove.name + " was successful!")
        getMoveType();
      } else {
        $("#chat-box").text(cpuPokemon.name + " has missed with " + currentCpuMove.name)
        //If cpu move fails switch to player turn
        //Check if game should be over if not run gameLoop function
        currentState = playerTurn;
        setTimeout(gameLoop, 1500);
      }
    }

    //Determine if move is an attack move or defense move 
    var getMoveType = function(){
      animateMove();
      if(currentCpuMove.type === "Attack") {
        setTimeout(attackingMove, 2000)
      } else {
        setTimeout(defensiveMove, 2000)
      }
    }

    var animateMove = function(){
      $("#attackImg").addClass("cpuAttackImg");
      $("#attackImg").removeClass("hide");
      $("#attackImg").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100)
    }

    var attackingMove = function(){
      $("#attackImg").addClass("hide");
      $("#attackImg").addClass("cpuAttackImg");
      if (!cpuPokemon.effect){
        userPokemon.health -= currentCpuMove.power
      } else {
        userPokemon.health -= currentCpuMove.power - (currentCpuMove.power * cpuPokemon.effect)
        cpuPokemon.effect = null;
      }

      console.log("health of cpu after user attack" + userPokemon.health)
      $("#user-health-bar").css("width", userPokemon.health + "%")
      currentState = playerTurn
      gameLoop(); 
    }

    var defensiveMove = function(){
      $("#attackImg").addClass("hide");
      $("#attackImg").removeClass("cpuAttackImg");
      userPokemon.effect = currentCpuMove.power;
      currentState = playerTurn
      gameLoop();
    }
    //call first funciton for game mechanic that will call following functions
    setupCpuMove();

  }

};









//Define user game mechanics
var playerTurn = {
  play: function(){

    //Declare empty variable for current UserMove
    var currentUserMove;

    var setUpPlayerField = function(){
      var moveButtons = ["#move1-text", "#move2-text", "#move3-text", "#move4-text"];

      $("#user-buttons").removeClass("hide")
      $("#chat-box").text("What will " + userPokemon.name + " do?");

      for (var i = 0; i < moveButtons.length; i++){
        $(moveButtons[i]).text(userPokemon.moves[i].name)
      };
    };


    var prepareToAttack = function(){
      $("#user-buttons").addClass("hide")

      //use jQuery animate pokemon image
      $("#charmander-img").animate({ top: "-= 25" }, 300, function(){
        $("#charmander-img").animate({
          top: "+= 25"
        }, 300)
      })
      //call get Accuracy function
      getAccuracy();
    }

    var getAccuracy = function(){
      //function to determine if cpu move is successful or not
      var setAccuracy = Math.random();
      if (setAccuracy <= currentUserMove.accuracy){
        $("#chat-box").text(userPokemon.name + " used " + currentUserMove.name + " was successful!")
        getMoveType();
      } else {
        $("#chat-box").text(userPokemon.name + " has missed with " + currentUserMove.name)
        //If user move fails switch to cpu turn
        //Check if game should be over if not run gameLoop function
        currentState = cpuTurn;
        setTimeout(gameLoop, 1500);
      }
    }

    //Determine if move is an attack move or defense move 
    var getMoveType = function(){
      animateMove();
      if(currentUserMove.type === "Attack") {
        setTimeout(attackingMove, 2000)
      } else {
        setTimeout(defensiveMove, 2000)
      }
    }

    var animateMove = function(){
      $("#attackImg").addClass("userAttackImg");
      $("#attackImg").removeClass("hide");
      $("#attackImg").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100)
    }

    var attackingMove = function(){
      $("#attackImg").addClass("hide");
      $("#attackImg").addClass("userAttackImg");
      if (!userPokemon.effect){
        cpuPokemon.health -= currentUserMove.power
        console.log(cpuPokemon.health)

      } else {
        console.log(currentUserMove.power)
        cpuPokemon.health -= currentUserMove.power - (currentUserMove.power * userPokemon.effect)
        console.log(cpuPokemon.health)

        userPokemon.effect = null;
      }
      console.log("user health check")
      console.log("health after cpu attack " + userPokemon.health)
      $("#cpu-health-bar").css("width", cpuPokemon.health + "%")
      currentState = cpuTurn
      gameLoop(); 
    }

    var defensiveMove = function(){
      $("#attackImg").addClass("hide");
      $("#attackImg").removeClass("userAttackImg");
      cpuPokemon.effect = currentUserMove.power;
      currentState = cpuTurn
      gameLoop();
    }

    $("#move1-button, #move2-button, #move3-button, #move4-button").unbind().on("click", function(){
      var $move = $(this).attr("value")
      currentUserMove = userPokemon.moves[$move]
      prepareToAttack();
    });

    setUpPlayerField();
  }
};


//Function to check if game is over if not call play method on computer or player
var gameLoop = function(){
  if(cpuPokemon.health <= 0 || userPokemon.health <= 0){
    $("#game-over").removeClass("hide");
  } else {
    currentState.play();
  }
}

var init = function(){
  //Declare which pokemon objects you want to use as players
  cpuPokemon = pikachu;
  userPokemon = charmander;
  //User jQuery to Dynamically display name and levels 
  $("#cpu-name").text(cpuPokemon.name);
  $("#cpu-lvl").text("lvl" + cpuPokemon.lvl);
  $("#user-name").text(userPokemon.name);
  $("#user-lvl").text("lvl " + userPokemon.lvl);
  currentState = playerTurn;
  gameLoop();
}

//Invoke game state d
init();

