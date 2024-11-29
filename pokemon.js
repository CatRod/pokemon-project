const engine = require("workshop-engine");

engine.showBanner("Pokemon");

const grass = { name: "Bulbasaur", type: "grass", strong: true };
const fire = { name: "Charmander", type: "fire", strong: true };
const water = { name: "Squirtle", type: "water", strong: true };

const leaders = [
  "Erika, a grass gym leader.\nWeaknesses: fire \nStrengths: water",
  "Misty, a water gym leader.\nWeaknesses: grass \nStrengths: fire",
  "Blaine, a fire gym leader.\nWeaknesses: water \nStrengths: grass",
];

let currentGymLeader = {
  description: "",
  name: "",
  weakness: "",
  strengths: "",
};

let player1 = {
  name: "Catarina", //aqui quero associar o nome do player quando perguntado no ínicio...
  arrPokemon: [], //vou guardar os pokemon que apanho na SafariZone
  probability: 50, //adicionei isto para dar para calcular a probabilidade final
  wins: 0,
};

engine.setMenuPrompt("Where do you want to go first?");

function gymLeader() {
  if (leaders.length > 0) {
    currentGymLeader.description = leaders.shift(); //Estou a passar a info da 1ª posição do array para dentro da description do objet currentGymLeader
    let weakness = currentGymLeader.description.split(" ");
    currentGymLeader.weakness = weakness[5]; //guardei a weakness dentro do object currentGymLeader

    let strengths = currentGymLeader.description.split(" ");
    currentGymLeader.strengths = strengths[7]; //guardei a strengths dentro do object currentGymLeader

    let nameCurrentGymLeader = currentGymLeader.description.split(",");
    currentGymLeader.name = nameCurrentGymLeader[0];
  }
}
gymLeader();

const theTown = engine.create({
  type: "stage",
  name: "The Town",
});

//Agora podemos descansar aqui "rest"
//Choosing to rest fully heals your pokémon

theTown.addQuestion({
  type: "confirm",
  message: "Do you want to know your opponent?",
  action: function (answer) {
    if (answer === true) {
      console.log(currentGymLeader);
    } else {
      engine.quit();
    }
  },
});

const safariZone = engine.create({
  type: "stage",
  name: "Safari Zone",
});

//Podemos trocar pokemon
//If their maximum is reached, when choosing to keep the found pokémon they must choose to replace one on their team
//The game should display their current team before returning to the menu

safariZone.addQuestion({
  type: "list",
  message: "Choose to visit",
  options: ["Grasslands", "River", "Volcano", "Release Team"],
  action: function (answer) {
    if (answer === "Release Team") {
      console.log("No Pokemon. Let's capture.");
      player1.arrPokemon = []; // Adiciona 1 ao arrPokemon
      console.log(player1); // validar a contagem de nº de Pokemon
      return;
    } else if (player1.arrPokemon.length >= 4) {
      console.log("You cannot catch more Pokemon. You already have 4.");
      return;
    } else if (answer === "Grasslands") {
      console.log("You caught a " + grass.name);
      player1.arrPokemon.push(grass); // Adiciona 1 ao arrPokemon
      console.log(player1); // validar a contagem de nº de Pokemon
      return player1.arrPokemon;
    } else if (answer === "River") {
      console.log("You caught a " + water.name);
      player1.arrPokemon.push(water); // Adiciona 1 ao arrPokemon
      console.log(player1); // validar a contagem de nº de Pokemon
      return player1.arrPokemon;
    } else if (answer === "Volcano") {
      console.log("You caught a " + fire.name);
      player1.arrPokemon.push(fire); // Adiciona 1 ao arrPokemon
      console.log(player1); // validar a contagem de nº de Pokemon
      return player1.arrPokemon;
    }
  },
});

const gymArena = engine.create({
  type: "stage",
  name: "Gym Arena",
});

//Losing puts your team health at 0 and you are not allowed to fight until you are fully healed again

gymArena.executeBefore(function () {
  if (player1.arrPokemon.length < 1) {
    console.log(
      "You have to catch at least 1 pokemon to battle your opponent!"
    );
    return false;
  }
});

//Winning gives you a badge

gymArena.addQuestion({
  type: "confirm",
  message: "Do you want to battle in the arena?",
  action: function (answer) {
    if (answer === true) {
      console.log("I have " + player1.arrPokemon.length + " Pokemon"); //Vou ver quantos pokemon tenho
      console.log("\nYou are fighting with " + currentGymLeader.description);
      console.log("\nLet's go!");

      player1.arrPokemon.forEach((pokemon) => {
        if (pokemon.type === currentGymLeader.weakness) {
          player1.probability += 12.5;
        } else if (pokemon.type === currentGymLeader.strengths) {
          player1.probability -= 12.5;
        }
      });
      let randomNum = Math.floor(Math.random() * 101);

      console.log(
        "Your probability to win is " +
          player1.probability +
          " and the random number is " +
          randomNum
      ); //Isto é opcional...

      if (player1.probability > randomNum) {
        console.log(
          "\nCongrats, YOU WON against " + currentGymLeader.name + " !!"
        );
        player1.wins++;

        if (player1.wins === 3) {
          console.log("No more gym leaders, GAME FINISHED !");
          engine.quit();
        }
        gymLeader();
      } else {
        console.log("\nYou have to change your team of pokemon!\n");
      }
      player1.probability = 50; //para dar reset à minha probabilidade (se não vai estar sempre a somar)
    } else {
      engine.quit();
    }
  },
});

//Adicionar a Legendary Cave
//Adicionar pokemon legendary
//Vamos ter vários pokemon e temos de adivinhar o nome do pokemon para o conseguir apanhar (podemos usar o math.random)
//

engine.run();
