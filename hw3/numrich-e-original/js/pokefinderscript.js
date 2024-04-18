window.onload = (e) => {
    //Set local storage preset
    const storedRegion = localStorage.getItem(regionKey);

    //Perform if there is local data
    if (storedRegion){
        let numberList = storedRegion.split(',');
        let checkList = document.querySelectorAll("input[type=checkbox]:checked");
        
        //For each checkbox, see if it's in the local Storage list. If it's not, remove the check
        for(let region = 0; region < checkList.length; region++){
            let isChecked = false;

            for (let gen = 0; gen < numberList.length; gen++){
                if(checkList[region].value == numberList[gen]){
                    isChecked = true;
                }
            }

            if(!isChecked){
                document.querySelector(`input[value='${checkList[region].value}']`).checked = false;
            }
        }
    }

    document.querySelector('.play-button').onclick = playButtonClicked;
    document.querySelector('.play-button').style = "align-items: center";
};

//URL to PokeAPI
const poke_url = "https://pokeapi.co/api/v2/";
let generations;
let pokeList;
let chosen;
let type;
let chosenSprite;
let lastChosen;
let tries;
let storagePrefix = "emn5100pkmn-";
let regionKey = storagePrefix + "region";

//For GetPokemon()
let lastNumber = 0;

//Make the Play button the ony button on screen until it is pressed

function playButtonClicked(){

    //Make room for hint button
    document.querySelector('.play-button').style = "width: 55%";
    document.querySelector('.hint-button').style = "display: block";

    //clear Pokemon Array
    pokeList = new Array();
    lastChosen = chosen;

    tries = 2;

    //Reset
    chosen = null;
    chosenSprite = null;
    type = null;
    lastNumber = 0;

    //Array of generations
    generations = document.querySelectorAll("input[type=checkbox]:checked");

    let checkedList = new Array();

    let searchTerm = "";

    //Gets a list ogf every pokemon generation and gets data from the API for each
    if(generations.length > 0){
        for(let gen = 0; gen < generations.length; gen++){
            searchTerm = poke_url +  "generation/" + generations[gen].value;
            checkedList[gen] = generations[gen].value;
            getPokemonData(searchTerm);
        }

    }

    //Set local storage to the list of checked checkboxes
    localStorage.setItem(regionKey, checkedList);
}

//Sends XHR requests to the API
function getPokemonData(searchTerm){
    let xhr = new XMLHttpRequest();

    xhr.onload = loadData;

    xhr.open("GET", searchTerm);
    xhr.send();
}

//Deals with the Pokemon objects. If there's multiple objets, merge the Pokemon Lists.
function loadData(e){

    let xhr = e.target;

    let obj = null;
    
    //Error response just in case of there being an error
    if(xhr.responseText != "Not Found"){
        obj = JSON.parse(xhr.responseText);
    }

    //If no Pokemon has been chosen yet, merge the Pokemon lists in the objects together and get a POkemon
    if(chosen == null){
        let results = obj.pokemon_species;

        for(let i = 0; i < results.length; i++){
            pokeList[pokeList.length] = results[i];
        }
    
        //Get random Pokemon when list no longer is added to
        getPokemon();
    }

    //This runs if the Pokemon has already been chosen, and makes sure that the sprite information exists and is valid. It then
    //saves the typing and front sprite
    //If any of them are not, the program will pick a new Pokemon
    else {
        if(obj != null &&
           obj.sprites.front_default != null &&
           lastChosen != obj.name)
        {
            chosenSprite = obj.sprites.front_default;
            type = obj.types;
            document.querySelector("#status").innerHTML = "Loaded!";
            lastChosen = obj.name
            start();
        }

        else {
            getPokemon();
        }
    }
}

//Gets a random Pokemon to be displayed
function getPokemon(){
    //There is 3 tries, but the loop accounts for 0-2, which is three numbers
    //This is resets the tries for every new Pokemon
    tries = 2;

    //Gets a random number corresponding to a Pokemon's Pokedex number, then uses getPokemonData() to get it's sprite by sending 
    //another API request
    if(lastNumber == generations.length - 1){
        let rngNumber = Math.floor(Math.random() * pokeList.length);
        chosen = pokeList[rngNumber];

        //Get's the new URL by splitting the URL in the object and only getting the Dex Number
        getPokemonData(poke_url + "pokemon/" + chosen.url.split('/')[6]);
        document.querySelector("#status").innerHTML = "Loading...";
    }

    //This is primarily to make sure that the program doesn't get a random Pokemon too early. If it does, it throws
    //an error. It needs to make sure that all Pokemon that are supposed to be in the list are there. 
    else {
        lastNumber++;
    }
}

//Puts the game in motion
function start(){
    document.querySelector('#game').style = "height: 100%";

    //Get sprite displayed
    document.querySelector("#gamewindow").innerHTML = `<img id="pokemon" src='${chosenSprite}' title=''>`;

    //Make sprite a silhouette
    let image = document.querySelector("#pokemon");
    image.style = "filter: contrast(0%)";

    //Initialize hint button
    getHint();

    //Create answer box
    let answer = document.querySelector("#answer");
    answer.innerHTML = `Answer: <input type="text"id="answerbox"></input>&nbsp<button id="enter">Enter</button>`;

    let enter = document.querySelector("#enter");

    //When enter is clicked, check if the input is correct.
    enter.onclick = (e) => {
        let chosenName = chosen.name.toUpperCase();
        let input = document.querySelector("#answerbox").value.toUpperCase();

        //Some names have -s, so I want to make sure I only use the parts of the names before the -.
        if(chosenName.split("-")[0] == "TAPU" ||
            chosenName.split("-")[0] == "MIME"){
            chosenName = chosenName.replaceAll('-', ' ').trim();
        }

        //I'm at my wits end with these. There is SO MANY names to account for.
        //These are clauses for the Pokemon with special characters in their names, causing the API to put the name in a way that
        //conflicts with the player's answer, and the code to get the answer
        else if(chosenName == "MR-MIME"){
            chosenName = "Mr. Mime".replaceAll('.', ' ').trim().toUpperCase();
        }

        else if(chosenName == "MR-RIME"){
            chosenName = "Mr. Rime".replaceAll('.', ' ').trim().toUpperCase();
        }

        else if(chosenName == "TYPE-NULL"){
            chosenName = "Type: Null".replaceAll('.', ' ').trim().toUpperCase();
        }

        else if(chosenName == "PORYGON-Z" ||
                chosenName == "HO-OH"){
            chosenName = chosenName.trim().toUpperCase();
        }

        else if(chosenName == "FARFETCHD"){
            chosenName = "Farfetch'd".replaceAll('.', ' ').trim().toUpperCase();
        }

        else if(chosenName == "SIRFETCHD"){
            chosenName = "Sirfetch'd".trim().toUpperCase();
        }

        //Pokemon with "-" in the name
        else if(chosenName.split('-')[1] == "O" ||
                chosenName.split('-')[1] == "OH"){
            chosenName = chosenName.toUpperCase();
        }

        //Some Pokemon in the API have different forms that end in things like "-m" or "-f" in the API.
        //No player is going to type these, so I aimed to remove them
        else{
            chosenName = chosenName.split("-")[0];
        }
        
        //This is to ensure the player doesn't accidentally enter without typing and losing a try
        if(input != ""){
            input.replaceAll('.', ' ').trim();
            testAnswer(input, chosenName, image);
        }

        else{
            document.querySelector("#hint").innerHTML = "You get three tries, so just enter a name and see!";
        }
    };
}

//Simply, this will display the Pokemon's type to the player
function getHint(){
    let hint = "";

    //Reset current hint;
    document.querySelector("#hint").innerHTML = "";

    if(type != null){
        if(type.length == 2){
            hint = `The Pokémon's type is dual ${type[0].type.name}/${type[1].type.name}.`;
        }

        else{
            hint = `The Pokémon's type is ${type[0].type.name}.`;
        }
    }

    let hintButton = document.querySelector('.hint-button');

    hintButton.onclick = (e) => {
        document.querySelector("#hint").innerHTML = hint;
    };
}

//This checks if the user's entered name matches with the Pokemon's name
//If it does, move onto the next Pokemon, but not before telling them they were correct
//If it's not correct, say so, and remove a try. If they're out of tries, show the Pokemon and print the name, then move to the next Pokemon
function testAnswer (input, chosenName, image) {
    if(input == chosenName){
        document.querySelector("#answerbox").value = "";   
        image.style = "filter: contrast(100%)";
        document.querySelector("#hint").innerHTML = "Correct!";
        console.clear;

        setTimeout(function(){getPokemon()}, 1500);
    }

    else if (input != chosenName && tries <= 0){
        document.querySelector("#hint").innerHTML = "The Pokémon was " + chosenName
        document.querySelector('#pokemon').style = "filter: contrast(100%)";
        setTimeout(function(){ 
            getPokemon();
        }, 2000)
    }

    else {
        document.querySelector("#hint").innerHTML = "Incorrect";
        tries--;
        setTimeout(function(){
            document.querySelector("#hint").innerHTML = "";
        }, 1500)
    }
}