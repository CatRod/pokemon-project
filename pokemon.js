const engine = require("workshop-engine");

engine.showBanner("Pokemon");

const grass = { name: "Bulbasaur", type: "grass", health: 100 };
const fire = { name: "Charmander", type: "fire", health: 100 };
const water = { name: "Squirtle", type: "water", health: 100 };

const leaders = [
  "Erika, a grass gym leader.\nWeaknesses: fire \nStrengths: water \nBadge: cascade",
  "Misty, a water gym leader.\nWeaknesses: grass \nStrengths: fire \nBadge: volcano",
  "Blaine, a fire gym leader.\nWeaknesses: water \nStrengths: grass \nBadge: hearth",
];

let currentGymLeader = {
  description: "",
  name: "",
  weakness: "",
  strengths: "",
  badge: "",
};

let player1 = {
  name: "Catarina", //aqui quero associar o nome do player quando perguntado no ínicio...
  arrPokemon: [], //vou guardar os pokemon que apanho na SafariZone
  probability: 50, //adicionei isto para dar para calcular a probabilidade final
  wins: 0,
  badge: [],
  health: 0,
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

    let badges = currentGymLeader.description.split(" ");
    currentGymLeader.badge = badges[9];
  }
}
gymLeader();

const theTown = engine.create({
  type: "stage",
  name: "The Town",
});

theTown.addQuestion({
  type: "list",
  message: "What do you wish to do now?",
  options: ["Know my opponent", "Rest"],
  action: function (answer) {
    if (answer === "Know my opponent") {
      console.log(currentGymLeader);
    } else if (answer === "Rest") {
      player1.health = 100;
      console.log(
        "Good! Now your health is " +
          player1.health +
          "\nYou are good to battle again!"
      );
      //Adiciono na mesma aqui o forEach para dar 100 de health aos pokemon individualmente??
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
  options: ["Grasslands", "River", "Volcano", "My Team", "Release Team"],
  action: function (answer) {
    if (answer === "Release Team") {
      console.log("No Pokemon. Let's capture.");
      player1.arrPokemon = []; // Adiciona 1 ao arrPokemon
      console.log(player1.arrPokemon); // validar a contagem de nº de Pokemon
      return;
    } else if (player1.arrPokemon.length >= 4) {
      console.log("You cannot catch more Pokemon. You already have 4.");
      return;
    } else if (answer === "Grasslands") {
      console.log("You caught a " + grass.name);
      player1.arrPokemon.push(grass); // Adiciona 1 ao arrPokemon
      return player1.arrPokemon;
    } else if (answer === "River") {
      console.log("You caught a " + water.name);
      player1.arrPokemon.push(water); // Adiciona 1 ao arrPokemon
      return player1.arrPokemon;
    } else if (answer === "Volcano") {
      console.log("You caught a " + fire.name);
      player1.arrPokemon.push(fire); // Adiciona 1 ao arrPokemon
      return player1.arrPokemon;
    } else if (answer === "My Team") {
      console.log(player1.arrPokemon); // Adicionei aqui uma forma de podermos ver a nossa equipa!!
    }
  },
});

const gymArena = engine.create({
  type: "stage",
  name: "Gym Arena",
});

gymArena.executeBefore(function () {
  if (player1.arrPokemon.length < 1 || player1.health !== 100) {
    console.log(
      "You have to catch at least 1 pokemon to battle your opponent and you need to restore your health!"
    ); //Isto não está a funcionar com o &&, por isso passei a || , porque quando queremos combater outra vez, temos pokemon mas não temos health.. Isto deixa de funcionar.
    return false;
  }
});

gymArena.addQuestion({
  type: "confirm",
  message: "Do you want to battle in the arena?",
  action: function (answer) {
    if (answer === true) {
      console.log("I have " + player1.arrPokemon.length + " Pokemon"); //Vou ver quantos pokemon tenho
      console.log("\nYou are fighting with " + currentGymLeader.name);
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
      );

      if (player1.probability > randomNum) {
        console.log(
          "\nCongrats, YOU WON against " + currentGymLeader.name + " !!"
        );
        player1.wins++;
        player1.badge.push(currentGymLeader.badge);
        console.log("Now you have " + player1.badge + " badge(s)!");
        if (player1.wins === 3) {
          console.log("No more gym leaders, GAME FINISHED !");
          engine.quit();
        }
        gymLeader();
      } else {
        player1.arrPokemon.forEach((pokemon) => {
          if (pokemon.health === 100) {
            pokemon.health = 0;
          }
        });
        player1.health = 0;
        console.log(
          "\nYou have to change your team of pokemon or take a power nap at the town to restore your pokemon's health!!\n"
        );
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
