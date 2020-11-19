const inputMap = document.querySelector('input[type="file"]');
inputMap.addEventListener('change',function(e){
    console.log(inputMap.files);
    const reader = new FileReader();
    reader.onload = function () {
        console.log(JSON.parse(reader.result));
        let newLevel = JSON.parse(reader.result);
        let uploadDecision = prompt("do you want to continue to play on the level or you want to play on the uploaded one old/new");
        if(uploadDecision.toLowerCase() == "new"){
            mainCharacter = new Player(prompt("enter your name astronaut"),4);
            upgrades = [
                {name:"light",cost:[{name:"tape",amount:3},{name:"plastic",amount:2}]},
                {name:"CO2",cost:[{name:"plastic",amount:2},{name:"tape",amount:1},{name:"wire",amount:2}]},
                {name:"radio",cost:[{name:"metal",amount:3},{name:"magnet",amount:1},{name:"wire",amount:2}]}
            ];
            prebuiltLevel = newLevel;
            //printPlaceRepAppend();

        }
    }
    reader.readAsText(inputMap.files[0]);
},false)



function filter(array, test) {
    let passed = [];
    for (let element of array) {
      if (test(element)) {
        passed.push(element);
      }
    }
    return passed;
}

class Place {
    constructor(id,type,waterIce,dialog,directions,salvagedItems=[]){
        this.id = id;
        this.type = type;  
        this.waterIce = waterIce;
        this.dialog = dialog;
        this.directions = directions;
        this.salvagedItems = salvagedItems;
    }
}

class Level {
    constructor(places){
        this.places = places;
    }
}


class Player {

    constructor(name,positionID){
        this.achievements = [];
        this.name = name;
        this.health = 100;
        this.oxygen = 250;
        this.heating = 250;
        this.minutesAlive = 0;
        this.items = [];
        this.upgradesActive = [];
        this.positionID = positionID;
        this.handbook = [
            "Suit lighting system upgrade (increased chance of finding water ice). Items required: 3x tape, 2x plastic", 
            "Improved CO2 filtering system(increases your suit's oxygen consumption efficiency 2x). Items required: 2x plastic, 1x tape, 2x wire",
            "Build a radio set to communicate with Houston. Items required: 3x metal, 2x wire 1x magnet"
        ]
    }

    getUpgrade(upgradeName,requiredForUpgrade){
        for(let itemReq of requiredForUpgrade){
            for(let itemHad of this.items){
                //console.log("itemReq before: ",itemReq);
               // console.log("itemHad before: ",itemHad);
                if(itemReq.name == itemHad.name){
                    console.log("matched names");
                    //console.log("itemReq in: ",itemReq);
                    //console.log("itemHad in: ",itemHad);
                    if(itemHad.amount - itemReq.amount >= 0){
                        console.log(this.items[this.items.findIndex(thing=>thing.name==itemHad.name)]);
                        console.log(requiredForUpgrade[requiredForUpgrade.findIndex(thing=>thing.name == itemReq.name)]);
                        this.items[this.items.findIndex(thing=>thing.name==itemHad.name)].amount-=itemReq.amount; 
                        requiredForUpgrade[requiredForUpgrade.findIndex(thing=>thing.name == itemReq.name)].amount = 0; 
                    }else{
                        console.log(this.items[this.items.findIndex(thing=>thing.name==itemHad.name)]);
                        console.log(requiredForUpgrade[requiredForUpgrade.findIndex(thing=>thing.name == itemReq.name)]);
                        requiredForUpgrade[requiredForUpgrade.findIndex(thing=>thing.name == itemReq.name)].amount -= itemHad.amount;
                        this.items[this.items.findIndex(thing=>thing.name==itemHad.name)].amount=0;
                        console.log(this.items[this.items.findIndex(thing=>thing.name==itemHad.name)]);
                        console.log(requiredForUpgrade[requiredForUpgrade.findIndex(thing=>thing.name == itemReq.name)]);
                    }
                    //console.log("itemReq after: ",itemReq);
                    //console.log("itemHad after: ",itemHad);
                }
            }
        }

        //console.log("this.items middle: ",this.items);
        //console.log("requiredForUpgrade middle: ",requiredForUpgrade);

        for(let i = 0; i<this.items.length;i++){
            //console.log("checkItem this.items: ",checkItem);
            if(this.items[i].amount == 0){
               //console.log("deleting : ",this.items[this.items.findIndex(thing=>thing.name==checkItem.name)]);
                this.items.splice(i,1);
                i--;
            }
        }

        for(let i = 0; i<requiredForUpgrade.length;i++){
            if(requiredForUpgrade[i].amount == 0){
                console.log("deleting : ", requiredForUpgrade[i]);
                requiredForUpgrade.splice(i,1);
                i--;
            }
        }
  
        console.log("this.items after: ",this.items);
        console.log("missingItems after: ",requiredForUpgrade);

        if(requiredForUpgrade.length==0){
            alert("well this should help to survive");
            this.upgradesActive.push(upgradeName);
        }else{
            let missingItemsString = [];
            for(let item of requiredForUpgrade){
                missingItemsString.push(`${item.name} ${item.amount}x, `)
            }
            alert("items are missing to active this upgrade: " + missingItemsString.toString());
        }
    }

    placeRep(level){

        let positionPlace = filter(level.places, item => item.id == this.positionID)[0];

        return(`i am at the <strong class="position">${positionPlace.type}</strong> and i see <strong class="north"> ${positionPlace.directions.north ? positionPlace.directions.north.dir : "nothing"}</strong> to the <strong class="north">NORTH</strong>, <strong class="east">${positionPlace.directions.east ? positionPlace.directions.east.dir : "nothing"}</strong> to the <strong class="east">EAST</strong>, <strong class="south">${positionPlace.directions.south ? positionPlace.directions.south.dir : "nothing"}</strong> to the <strong class="south">SOUTH</strong>, <strong class="west">${positionPlace.directions.west ? positionPlace.directions.west.dir : "nothing"}</strong> to the <strong class="west">WEST</strong>`);
    }

    statusRep(){
        return(`my health is ${mainCharacter.health}% , oxygen left: ${mainCharacter.oxygen} minutes, heating left: ${mainCharacter.heating}minutes, `);
    }

    itemRep(){
        let summedUpItems = [];

        for(let item of mainCharacter.items){
            summedUpItems.push(`${item.name} ${item.amount}x, `)
        }

        console.log(summedUpItems)

        return(mainCharacter.items.length > 0 ? summedUpItems.toString(): "no items");
    }

    givePositionObject(level){

        let positionPlace = filter(level.places, item => item.id == this.positionID)[0];
        return positionPlace;

    }

    move(positionID){
        this.positionID = positionID;
    }

    updateStatus(health,oxygen,heating){  
            this.health = health;
            this.oxygen = oxygen;
            this.heating = heating; 

    }

    addItems(itemsToAdd){
        for(let item of itemsToAdd){
            let element = filter(this.items, element => element.name == item.name);
            console.log("element: ",element,"item: ",item);
            if(element.length>0){
                console.log(`added ${item.amount} to ${this.items[this.items.findIndex(item=>item.name==item.name)].name}`);
                this.items[this.items.findIndex(thing=>thing.name==item.name)].amount+=item.amount;
            }else{
                this.items.push(item);
            }
        }
    }


    
}


let placeTypes = ["small boulder","big boulder","lava tube","scaterred rocks","small crater","big crater","spacecraft","rover","lander"];

let dialogTypes = [
    ["well this small rock doesn't have any water ice ","found some water near this small rock ","wow, found a chunk of water ice near this small boulder "]
    ,["boulder is big, but there is no sign of water ice here ","found some bits and pieces of water ice near this big boulder ","lucky me! found good amount of water ice on this big boulder "]
    ,["this tube looks really scary and dark, i dont see any indication of water ice inside, but i might be wrong ","its really dark in here, found some water ice near the beginning of the tube ","found a good chunk of water ice laying around near the start of this tube "]
    ,["there is no water ice here ","found some water ice around scaterred rocks ","wow! there is a large deposit of water ice around these scaterred rocks here "]
    ,["looks like this small crater is fresh, but i dont see any water ice here ","found little water ice sheet near the edge of the small crater ","i found considerable amount of water ice in the middle of this small crater "]
    ,["wow this crater is huge, i can only imagine the size of the meteor, no indication of water ice tho ","after walking around this crater i scooped up some water ice , something is better than nothing ","i found nice amount of water ice inside this huge crater "]
    ,["this old spacecraft is absolutely useless ","salvaged some good parts from this spacecraft "," salvaged some really good parts "]
    ,["rover is already salvaged "," i salvaged some parts from the rover ", "well rover is not working but i managed to find some good parts that i can use "]
    ,["i made it! i am the luckiest person on this planet, i mean moon... "]
];

let upgrades = [
    {name:"light",cost:[{name:"tape",amount:3},{name:"plastic",amount:2}]},
    {name:"CO2",cost:[{name:"plastic",amount:2},{name:"tape",amount:1},{name:"wire",amount:2}]},
    {name:"radio",cost:[{name:"metal",amount:3},{name:"magnet",amount:1},{name:"wire",amount:2}]}
];


let achievements = ["smart decision","engineer","survivalist","backpacking","close call","adios amigos","Houston, we've had a problem","scary stuff"];

//smart decision - radio aquired
//engineer - constructed better CO2 or lightning system
//survivalist - logged more than 100 minutes of survival time
//i love batteries - collected all possible batteries in the map
//close call - finish the game with less than 50 minutes remaining of oxygen or battery time
//adios amigos - finish the game with more than 100 minutes of oxygen or battery time remaining
//Houston, we've had a problem - make contact with the Houston
//scary stuff - discover a lava tube




let playersData = [];

/*let directionsForRM = [

{north: {dir:prebuiltLevel.places[5].type ,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
east: {dir:prebuiltLevel.places[8].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:8},
south: 0,
west: {dir:prebuiltLevel.places[0].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:0}},

{north: 0,
east: 0,
south: 0,
west: 0},

{north: 0,
 east: 0,
 south: 0,
 west: {dir:prebuiltLevel.places[11].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:11}},


{north: {dir:prebuiltLevel.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1},
                east: {dir:prebuiltLevel.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4},
                south: 0,
                west: 0},



{north: {dir:prebuiltLevel.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2},
                east: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
                south: {dir:prebuiltLevel.places[0].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:0},
                west: 0},




{north: {dir:placeTypes[places[3].type],cost:Math.round(Math.random() * (45 - 5) + 5),dirID:3},
                east: {dir:prebuiltLevel.places[6].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6},
                south: {dir:prebuiltLevel.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1},
                west: 0
},

               
{north: 0,
                east: {dir:prebuiltLevel.places[7].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7},
                south: {dir:prebuiltLevel.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2},
                west: 0},



{north: {dir:placeTypes[places[6].type],cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6},
                east: {dir:prebuiltLevel.places[9].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
                south: {dir:prebuiltLevel.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4},
                west: {dir:prebuiltLevel.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1}},


{north: {dir:placeTypes[places[7].type],cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7},
                east: {dir:prebuiltLevel.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
                south: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
                west: {dir:prebuiltLevel.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2}},



{north: {dir:placeTypes[places[9].type],cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
                east: 0,
                south: 0,
                west: {dir:prebuiltLevel.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4}},




                {north: {dir:prebuiltLevel.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
                east: 0,
                south: {dir:prebuiltLevel.places[8].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:8},
                west: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5}},




{north: {dir:prebuiltLevel.places[11].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:11},
                east: 0,
                south: {dir:prebuiltLevel.places[9].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
                west: {dir:prebuiltLevel.places[6].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6}},



{north: 0,
                east: {dir:prebuiltLevel.places[12].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:12},
                south: {dir:prebuiltLevel.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
                west: {dir:prebuiltLevel.places[7].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7}}

]*/








////////////////////////////////////////////////////////////////////////////////////////////////////


function restoreTheLevel(){
    console.log("level restored");
        upgrades = [
            {name:"light",cost:[{name:"tape",amount:3},{name:"plastic",amount:2}]},
            {name:"CO2",cost:[{name:"plastic",amount:2},{name:"tape",amount:1},{name:"wire",amount:2}]},
            {name:"radio",cost:[{name:"metal",amount:3},{name:"magnet",amount:1},{name:"wire",amount:2}]}
        ];

        prebuiltLevel = {places:[]};
        prebuiltLevel.places = createRandomPlaces(prompt("difficulty: 1.easy 2.medium 3.hard"));
        completeLevel();

    
    
   /* upgrades = [
        {name:"light",cost:[{name:"tape",amount:3},{name:"plastic",amount:2}]},
        {name:"CO2",cost:[{name:"plastic",amount:2},{name:"tape",amount:1},{name:"wire",amount:2}]},
        {name:"radio",cost:[{name:"metal",amount:3},{name:"magnet",amount:1},{name:"wire",amount:2}]}
    ];
    prebuiltLevel = {
        places: [new Place(0,"scaterred rocks",1800,dialogTypes[placeTypes.indexOf("scaterred rocks")],{
            north: {dir:"big boulder",cost:23,dirID:1},
            east: {dir:"rover",cost:4,dirID:4},
            south: 0,
            west: 0
            
        }),new Place(1,"big boulder",5000,dialogTypes[placeTypes.indexOf("big boulder")],{
            north: {dir:"lava tube",cost:50,dirID:2},
            east: {dir:"scaterred rocks",cost:13,dirID:5},
            south: {dir:"scaterred rocks",cost:5,dirID:0},
            west: 0}
        ),new Place(2,"lava tube",250,dialogTypes[placeTypes.indexOf("lava tube")],{
            north: {dir:"small boulder",cost:8,dirID:3},
            east: {dir:"big crater",cost:10,dirID:6},
            south: {dir:"big boulder",cost:4,dirID:1},
            west: 0}
        ),new Place(3,"small boulder",450,dialogTypes[placeTypes.indexOf("small boulder")],{
            north: 0,
            east: {dir:"lander",cost:10,dirID:7},
            south: {dir:"lava tube",cost:4,dirID:2},
            west: 0}
        ),new Place(4,"rover",0,dialogTypes[placeTypes.indexOf("rover")],{
            north: {dir:"scaterred rocks",cost:9,dirID:5},
            east: {dir:"scaterred rocks",cost:13,dirID:8},
            south: 0,
            west: {dir:"scaterred rocks",cost:10,dirID:0}},
            [{name:"metal",amount:3},{name:"wire",amount:2},{name:"magnet",amount:1},{name:"battery",amount:3}]
        ),new Place(5,"scaterred rocks",890,dialogTypes[placeTypes.indexOf("scaterred rocks")],{
            north: {dir:"big crater",cost:4,dirID:6},
            east: {dir:"small boulder",cost:1,dirID:9},
            south: {dir:"rover",cost:9,dirID:4},
            west: {dir:"big boulder",cost:20,dirID:1}}
        ),new Place(6,"big crater",5000,dialogTypes[placeTypes.indexOf("big crater")],{
            north: {dir:"lander",cost:23,dirID:7},
            east: {dir:"small crater",cost:3,dirID:10},
            south: {dir:"scaterred rocks",cost:4,dirID:5},
            west: {dir:"lava tube",cost:1,dirID:2}}
        ),new Place(7,"lander",1200,dialogTypes[placeTypes.indexOf("lander")],{
            north: 0,
            east: 0,
            south: 0,
            west: 0}
        ),new Place(8,"scaterred rocks",0,dialogTypes[placeTypes.indexOf("scaterred rocks")],{
            north: {dir:"small boulder",cost:2,dirID:9},
            east: 0,
            south: 0,
            west: {dir:"rover",cost:23,dirID:4}}
        ),new Place(9,"small boulder",78,dialogTypes[placeTypes.indexOf("small boulder")],{
            north: {dir:"small crater",cost:5,dirID:10},
            east: 0,
            south: {dir:"scaterred rocks",cost:23,dirID:8},
            west: {dir:"scaterred rocks",cost:10,dirID:5}}
        ),new Place(10,"small crater",789,dialogTypes[placeTypes.indexOf("small crater")],{
            north: {dir:"big boulder",cost:9,dirID:11},
            east: 0,
            south: {dir:"small boulder",cost:23,dirID:9},
            west: {dir:"big crater",cost:3,dirID:6}}
        ),new Place(11,"big boulder",68,dialogTypes[placeTypes.indexOf("big boulder")],{
            north: 0,
            east: {dir:"spacecraft",cost:100,dirID:12},
            south: {dir:"small crater",cost:23,dirID:10},
            west: {dir:"lander",cost:1,dirID:7}}
        ),new Place(12,"spacecraft",68,dialogTypes[placeTypes.indexOf("spacecraft")],{
            north: 0,
            east: 0,
            south: 0,
            west: {dir:"big boulder",cost:15,dirID:11}},
            [{name:"battery",amount:5},{name:"plastic",amount:5},{name:"tape",amount:4},{name:"wire",amount:2}]
        )]*/
        
}



function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function checkForDeath(){

    if(mainCharacter.heating < 0 || mainCharacter.oxygen < 0 ){

        let countinueDecision = prompt("GAME IS OVER YOU DIED , do you want to restart? Y/N");
        if(countinueDecision.toLowerCase() == "y"){
            playersData.push({name:mainCharacter.name, points:(mainCharacter.upgradesActive.length + mainCharacter.minutesAlive)});
            mainCharacter = new Player(prompt("enter your name astronaut"),4);
            restoreTheLevel();
        }else{
            playersData.push({name:mainCharacter.name, points:(mainCharacter.upgradesActive.length + mainCharacter.minutesAlive)});
            mainCharacter = new Player("cheater",4);
            restoreTheLevel();

            playersData = playersData.sort((a, b) => (a.points > b.points) ? 1 : -1).map(item => `<li>name:${item.name} points:${item.points}</li>`);

            download(`
            <html>
            <style>
                body{
                    background-color: black;
                }
                ul {
                    color: white;
                    font-size: 30px;
                    font-family: "Courier New";
                }
            </style>
            <body>
            <ul> ${playersData.toString()} </ul>
            </body>
            </html>`,"gameStats",".html");
        }

        
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}

function checkForFinnish(){
    if(mainCharacter.givePositionObject(prebuiltLevel).type=="lander"){
        if((mainCharacter.oxygen < 50 || mainCharacter.heating < 50 ) && mainCharacter.achievements.indexOf("close call") == -1){
            mainCharacter.achievements.push(achievements[4]);
            alert("achievement unlocked! " + achievements[4])
        }
        if((mainCharacter.oxygen > 50 || mainCharacter.heating > 50) && mainCharacter.achievements.indexOf("adios amigos") == -1){
            mainCharacter.achievements.push(achievements[5]);
            alert("achievement unlocked! " + achievements[5])
        }
        let countinueDecision = prompt("Your reached the lander and your survived , do you want to restart? Y/N");
        if(countinueDecision.toLowerCase() == "y"){
            playersData.push({name:mainCharacter.name, points:(mainCharacter.upgradesActive.length + mainCharacter.minutesAlive)});
            mainCharacter = new Player(prompt("enter your name astronaut"),4);
            restoreTheLevel();
        }else{
            playersData.push({name:mainCharacter.name, points:(mainCharacter.upgradesActive.length + mainCharacter.minutesAlive)});
            mainCharacter = new Player("cheater",4);
            restoreTheLevel();

            
            playersData = playersData.sort((a, b) => (a.points > b.points) ? 1 : -1).map(item => `<li> name:${item.name} points:${item.points}</li>`);
            
            download(`
            <html>
            <style>
                body{
                    background-color: black;
                }
                ul {
                    color: white;
                    font-size: 30px;
                    font-family: "Courier New";
                }
            </style>
            <body>
            <ul> ${playersData.toString()} </ul>
            </body>
            </html>`,"gameStats",".html");
        }
    }
}

function createRandomPlaces(difficulty){
    //Math.round(Math.random() * (to - from) + from);
    let places = [];
    for(let i = 0; i < 13; i++){
        let placeIndex = Math.round(Math.random() * (5 - 0) + 0);
        if(i == 4){
            places.push(new Place(i,placeTypes[7],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[7],{},[{name:"metal",amount:3},{name:"wire",amount:2},{name:"magnet",amount:1},{name:"battery",amount:3}]))
        }else if(i == 7){
            places.push(new Place(i,placeTypes[8],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[8],{}))
        }else if(i == 12){
            places.push(new Place(i,placeTypes[6],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[6],{},[{name:"battery",amount:5},{name:"plastic",amount:5},{name:"tape",amount:4},{name:"wire",amount:2}]))
        }else if(i == 0){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 1){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 2){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 3){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 5){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 6){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 8){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 9){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 10){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }else if(i == 11){
            places.push(new Place(i,placeTypes[placeIndex],Math.round(Math.random() * (3000/difficulty - 0) + 0),dialogTypes[placeIndex],{}))
        }
        
    } 
    console.log(places);
    return places;      
}


function inputConvert(input){
    if(input == 1){
        return "north"
    }else if(input == 2){
        return "east"
    }else if(input == 3){
        return "south"
    }else if(input == 4){
        return "west"
    }else if(input == 5){
        return "search/salvage"
    }else if(input == 6){
        return "status"
    }else if(input == 7){
        return "items"
    }else if(input == 8){
        return "handbook"
    }else if(input == 9){
        return "call"
    }else{
        return 0;
    }
}


function printPlaceRepAppend(){
    $('#game-text').append("<p>" + mainCharacter.placeRep(prebuiltLevel) + "</p>");
}

function printStatusRepAppend(){
    $('#game-text').append("<p>" + mainCharacter.statusRep() + "</p>");
}

function printStatusRepText(){
    $('#game-text').text(mainCharacter.statusRep());
}

function printItemsAppend(){
    $('#game-text').append("<p>" + mainCharacter.itemRep() + "</p>");
}

function printSearchResultAppend(){
    $('#game-text').append("<p>" + mainCharacter.itemRep() + "</p>");
}

function checkForAchievements(){
    if(mainCharacter.upgradesActive.indexOf("radio") != -1 && mainCharacter.achievements.indexOf("smart decision") == -1){
        mainCharacter.achievements.push(achievements[0]);
        alert("achievement unlocked! " + achievements[0])
    }
    if((mainCharacter.upgradesActive.indexOf("CO2") != -1 || mainCharacter.upgradesActive.indexOf("light") != -1) &&  mainCharacter.achievements.indexOf("engineer") == -1){
        mainCharacter.achievements.push(achievements[1]);
        alert("achievement unlocked! " + achievements[1])
    }
    if(mainCharacter.minutesAlive > 100 && mainCharacter.achievements.indexOf("survivalist") == -1){
        mainCharacter.achievements.push(achievements[2]);
        alert("achievement unlocked! " + achievements[2]);
    } 
    if(mainCharacter.items.length > 4 && mainCharacter.achievements.indexOf("backpacking") == -1){
        mainCharacter.achievements.push(achievements[3]);
        alert("achievement unlocked! " + achievements[3])
    }
    if(mainCharacter.upgradesActive.indexOf("radio") != -1 && mainCharacter.achievements.indexOf("Houston, we've had a problem") == -1){
        mainCharacter.achievements.push(achievements[6]);
        alert("achievement unlocked! " + achievements[6])
    }
    
//smart decision - radio aquired
//engineer - constructed better CO2 or lightning system
//survivalist - logged more than 100 minutes of survival time
//backpacking - collected more than 3 items
//finish the game with less than 50 minutes remaining of oxygen or battery time
//adios amigos - finish the game with more than 100 minutes of oxygen or battery time remaining
//Houston, we've had a problem - make contact with the Houston
//scary stuff - discover a lava tube
}


function tryToMove(userInput){

    
   
    if(mainCharacter.givePositionObject(prebuiltLevel).directions[userInput]){

        let movingDecision = prompt(" to travel to that location will take " + mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].cost + " minutes, is it really worth it? Y/N");

        
        
        if(movingDecision.toLowerCase() == "y"){
            sleep(2250);

            if(mainCharacter.upgradesActive.indexOf("CO2") != -1){
                mainCharacter.updateStatus(100,mainCharacter.oxygen - mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].cost/2,mainCharacter.heating - mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].cost/2);
                mainCharacter.minutesAlive+=mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].cost;
                mainCharacter.move(mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].dirID);
                checkForDeath();
            }else{
                mainCharacter.updateStatus(100,mainCharacter.oxygen - mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].cost,mainCharacter.heating - mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].cost);
                mainCharacter.minutesAlive+=mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].cost;
                mainCharacter.move(mainCharacter.givePositionObject(prebuiltLevel).directions[userInput].dirID);
                checkForDeath();
            }
            
            checkForFinnish();

            if(mainCharacter.givePositionObject(prebuiltLevel).type == "lava tube" && mainCharacter.achievements.indexOf("scary stuff") == -1){
                mainCharacter.achievements.push(achievements[7]);
                alert("achievement unlocked! " + achievements[7])
            }

            if(consoleSize>8){
                $('#game-text').text("");
                printPlaceRepAppend();
                consoleSize=0;
            }else{
                printPlaceRepAppend();
                consoleSize++;
            }

        }else if(movingDecision.toLowerCase() == "n"){

            if(consoleSize>8){
                $('#game-text').text("");
                printPlaceRepAppend();
                consoleSize=0;
            }else{
                printPlaceRepAppend();
                consoleSize++;
            }

        }else{
            if(consoleSize>8){
                $('#game-text').text("");
                printPlaceRepAppend();
                consoleSize=0;
            }else{
                printPlaceRepAppend();
                consoleSize++;
            }
        }

        
        

    }else if(userInput=="spacecraft vector"){

        let movingDecision = prompt("to travel to that location will take 90 minutes, is it really worth it? Y/N");


        
        if(movingDecision.toLowerCase() == "y"){
            sleep(2250);
            if(mainCharacter.upgradesActive.indexOf("CO2") != -1){
                mainCharacter.updateStatus(100,mainCharacter.oxygen - 45,mainCharacter.heating - 45);
                mainCharacter.move(11);
                checkForDeath();
            }else{
                mainCharacter.updateStatus(100,mainCharacter.oxygen - 90,mainCharacter.heating - 90);
                mainCharacter.move(11);
                checkForDeath();
            }
            

            

            if(consoleSize>8){
                $('#game-text').text("");
                printPlaceRepAppend();
                consoleSize=0;
            }else{
                printPlaceRepAppend();
                consoleSize++;
            }

        }else if(movingDecision.toLowerCase() == "n"){

            if(consoleSize>8){
                $('#game-text').text("");
                printPlaceRepAppend();
                consoleSize=0;
            }else{
                printPlaceRepAppend();
                consoleSize++;
            }

        }else{
            if(consoleSize>8){
                $('#game-text').text("");
                printPlaceRepAppend();
                consoleSize=0;
            }else{
                printPlaceRepAppend();
                consoleSize++;
            }
        }

        
    }else{
        if(consoleSize>8){
            $('#game-text').text("I dont want to go there");
            printPlaceRepAppend();
            consoleSize=0;
        }else{
            $('#game-text').append("<p>" + "I dont want to go there" + "</p>");
            printPlaceRepAppend();
            consoleSize+=2;
        }
       
    }
}


function startSearchSalvage(){
    console.log("salvaging start");
    let waterIceAmount = mainCharacter.givePositionObject(prebuiltLevel).waterIce;
    let salvagedItemsArray = mainCharacter.givePositionObject(prebuiltLevel).salvagedItems;
    console.log("salvagedItemsArray: ",salvagedItemsArray);

    sleep(2250);

    if(mainCharacter.givePositionObject(prebuiltLevel).type != "rover" && mainCharacter.givePositionObject(prebuiltLevel).type != "spacecraft"){
        console.log("entered waterIce picking");
        $('#game-text').text("");
        if(waterIceAmount == 0){
            $('#game-text').append("<p>" + mainCharacter.givePositionObject(prebuiltLevel).dialog[0] + "</p>");
        }else if(waterIceAmount>0 && waterIceAmount<=3500){
            if(mainCharacter.upgradesActive.indexOf("light") != -1){
                $('#game-text').append("<p>" + mainCharacter.givePositionObject(prebuiltLevel).dialog[1] + mainCharacter.givePositionObject(prebuiltLevel).waterIce*2 + " grams" + "</p>");
                mainCharacter.oxygen+=((waterIceAmount * 10 )/ 100);
                prebuiltLevel.places[mainCharacter.positionID].waterIce = 0;
            }else{
                $('#game-text').append("<p>" + mainCharacter.givePositionObject(prebuiltLevel).dialog[1] + mainCharacter.givePositionObject(prebuiltLevel).waterIce + " grams" + "</p>");
                mainCharacter.oxygen+=((waterIceAmount * 5 )/ 100);
                prebuiltLevel.places[mainCharacter.positionID].waterIce = 0;
            }    
        }else if(waterIceAmount>3500){
            if(mainCharacter.upgradesActive.indexOf("light") != -1){
                $('#game-text').append("<p>" + mainCharacter.givePositionObject(prebuiltLevel).dialog[1] + mainCharacter.givePositionObject(prebuiltLevel).waterIce*2 + " grams" + "</p>");
                mainCharacter.oxygen+=((waterIceAmount * 10 )/ 100);
                prebuiltLevel.places[mainCharacter.positionID].waterIce = 0;
            }else{
                $('#game-text').append("<p>" + mainCharacter.givePositionObject(prebuiltLevel).dialog[1] + mainCharacter.givePositionObject(prebuiltLevel).waterIce + " grams" + "</p>");
                mainCharacter.oxygen+=((waterIceAmount * 5 )/ 100);
                prebuiltLevel.places[mainCharacter.positionID].waterIce = 0;
            } 
        }
    }

    if(mainCharacter.givePositionObject(prebuiltLevel).type == "rover" || mainCharacter.givePositionObject(prebuiltLevel).type == "spacecraft"){
        console.log("entered salvaging ");
        let foundItems = false;
        $('#game-text').text("");
        if(salvagedItemsArray.length == 0){
            $('#game-text').append("<p>" + mainCharacter.givePositionObject(prebuiltLevel).dialog[0] + "</p>");
        }else if(salvagedItemsArray.length>0 && salvagedItemsArray.length <= 3){
            foundItems = true;
            $('#game-text').append("<p>" + mainCharacter.givePositionObject(prebuiltLevel).dialog[1] + "</p>");
            mainCharacter.addItems(salvagedItemsArray);
            prebuiltLevel.places[mainCharacter.positionID].salvagedItems = [];
        }else if(salvagedItemsArray.length>3){
            foundItems = true;
            $('#game-text').append("<p>" + mainCharacter.givePositionObject(prebuiltLevel).dialog[2] + "</p>");
            mainCharacter.addItems(salvagedItemsArray);
            prebuiltLevel.places[mainCharacter.positionID].salvagedItems = [];
        }

       
        console.log("mainCharacter.items before:",mainCharacter.items);

        let batteryAmount = filter(mainCharacter.items, item => item.name == "battery");
        console.log(batteryAmount);

        if(batteryAmount.length>0){
            batteryAmount = batteryAmount[0].amount;
        }else{
            batteryAmount = 0;
        }

        $('#game-text').append("found " + batteryAmount + `${batteryAmount > 1 || batteryAmount == 0? " batteries": " battery"} `);

        $('#game-text').append(` and ${foundItems ? "some other items(see 7.items)": "nothing more"} `);

        consoleSize++;
        console.log(batteryAmount);
        mainCharacter.heating+=(batteryAmount * 10);
        mainCharacter.items=filter(mainCharacter.items,item => item.name != "battery");
        console.log("mainCharacter.items after:",mainCharacter.items);

    }
    printPlaceRepAppend();
}


function printStatusRep(){
    if(consoleSize>8){
        $('#game-text').text(mainCharacter.statusRep());
        printPlaceRepAppend();
        consoleSize=0;
    }else{
        $('#game-text').append("<p>" + mainCharacter.statusRep() + "</p>");
        printPlaceRepAppend();
        consoleSize++;
    }
}


function printItems(){
    if(mainCharacter.items.length!=0){
        if(consoleSize>8){
            $('#game-text').text("");
            $('#game-text').append(mainCharacter.itemRep());
            printPlaceRepAppend();
            consoleSize=0;
        }else{
            $('#game-text').append("" + mainCharacter.itemRep());
            consoleSize++;
            printPlaceRepAppend();
        }
    }else{
        $('#game-text').append(mainCharacter.itemRep());
        printPlaceRepAppend();
        consoleSize+=2;
    } 
}


function printUpgradeOption(){
    if(consoleSize>10){
        $('#game-text').text("");
        for(let i = 0; i < mainCharacter.handbook.length; i++){
            $('#game-text').append("<p>" + (i+1) + ". - " + mainCharacter.handbook[i] + "</p>");
            consoleSize++;
        }
        $('#game-text').append("Choose upgrade: a - 1, b - 2, c -3");
        consoleSize=0;
        consoleSize++;        
    }else{
        $('#game-text').append("Choose upgrade: a - 1, b - 2, c -3");
        consoleSize++;
    }
}


function printHandbook(){
    if(consoleSize>8){
        $('#game-text').text("");
        for(let i = 0; i < mainCharacter.handbook.length; i++){
            $('#game-text').append("<p>" + (i+1) + ". - " + mainCharacter.handbook[i] + "</p>");
            consoleSize++;
        }
        printUpgradeOption();
        printPlaceRepAppend();
        consoleSize=0;
    }else{
        for(let i = 0; i < mainCharacter.handbook.length; i++){
            $('#game-text').append("<p>" + (i+1) + ". - " + mainCharacter.handbook[i] + "</p>");
            consoleSize++;
        }
        printUpgradeOption();
        printPlaceRepAppend();
    }
}

function startCall(){
    if(mainCharacter.upgradesActive.indexOf("radio") != -1){
            sleep(2200);
            $('#game-text').append("<p>" + "HOUSTON: our indications are showing that in your area there is an autonomous spacecraft" + " that was landed two years ago, that spacecraft has some spare batteries that are compatible with your space suit spacecraft is to the  " + "south" + " of the " + prebuiltLevel.places[11].type + " do you want to travel straigt to " + prebuiltLevel.places[11].type + "or you want to find the spacecraft yourself? myself/guide me" + "</p>");

                consoleSize+=4;
            
            printPlaceRepAppend();
            consoleSize+=1;
        }else if (mainCharacter.upgradesActive.indexOf("radio") == -1){
            $('#game-text').append("<p> i dont have a radio set ...</p>");
            consoleSize++;
            printPlaceRepAppend();
        }
}

function completeLevel(){
    let directionsForRM = [

        
        {north: {dir:prebuiltLevel.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1},
                        east: {dir:prebuiltLevel.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4},
                        south: 0,
                        west: 0},

        
        
        
        
        {north: {dir:prebuiltLevel.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2},
                        east: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
                        south: {dir:prebuiltLevel.places[0].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:0},
                        west: 0},
        
        
        
        
        {north: {dir:prebuiltLevel.places[3].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:3},
                        east: {dir:prebuiltLevel.places[6].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6},
                        south: {dir:prebuiltLevel.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1},
                        west: 0
        },
        
        
                       
        {north: 0,
            east: {dir:prebuiltLevel.places[7].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7},
            south: {dir:prebuiltLevel.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2},
             west: 0},


             {north: {dir:prebuiltLevel.places[5].type ,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
                east: {dir:prebuiltLevel.places[8].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:8},
                 south: 0,
                 west: {dir:prebuiltLevel.places[0].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:0}},


                 {north: {dir:prebuiltLevel.places[6].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6},
                        east: {dir:prebuiltLevel.places[9].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
                        south: {dir:prebuiltLevel.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4},
                        west: {dir:prebuiltLevel.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1}},

{north: {dir:prebuiltLevel.places[7].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7},
                        east: {dir:prebuiltLevel.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
                        south: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
                        west: {dir:prebuiltLevel.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2}},

        {   north: 0,
            east: 0,
            south: 0,
            west: 0},
        
        
    
        
        
        
        {north: {dir:prebuiltLevel.places[9].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
            east: 0,
            south: 0,
            west: {dir:prebuiltLevel.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4}},
        
        
        
        
                {north: {dir:prebuiltLevel.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
                east: 0,
                south: {dir:prebuiltLevel.places[8].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:8},
                west: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5}},
        

                {north: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:11},
                east: 0,
                south: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
                 west: {dir:prebuiltLevel.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6}},
        
        
        {north: 0,
            east: {dir:prebuiltLevel.places[12].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:12},
            south: {dir:prebuiltLevel.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
            west: {dir:prebuiltLevel.places[7].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7}},
        
        

        {north: 0,
            east: 0,
            south: 0,
            west: {dir:prebuiltLevel.places[11].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:11}}
        
        ];
    
    for(let i = 0; i < 13; i++){
        if(i == 4){
            prebuiltLevel.places[i].directions = directionsForRM[i];
        }else if(i == 7){
            prebuiltLevel.places[i].directions = directionsForRM[i];
        }else if(i == 12){
            prebuiltLevel.places[i].directions = directionsForRM[i];
        }else{
            prebuiltLevel.places[i].directions = directionsForRM[i];
        }
    }
    
}




let prebuiltLevelExo = {
    places: [new Place(0,"scaterred rocks",1800,dialogTypes[placeTypes.indexOf("scaterred rocks")],{
        north: {dir:"big boulder",cost:23,dirID:1},
        east: {dir:"rover",cost:4,dirID:4},
        south: 0,
        west: 0
        
    }),new Place(1,"big boulder",5000,dialogTypes[placeTypes.indexOf("big boulder")],{
        north: {dir:"lava tube",cost:50,dirID:2},
        east: {dir:"scaterred rocks",cost:13,dirID:5},
        south: {dir:"scaterred rocks",cost:5,dirID:0},
        west: 0}
    ),new Place(2,"lava tube",250,dialogTypes[placeTypes.indexOf("lava tube")],{
        north: {dir:"small boulder",cost:8,dirID:3},
        east: {dir:"big crater",cost:10,dirID:6},
        south: {dir:"big boulder",cost:4,dirID:1},
        west: 0}
    ),new Place(3,"small boulder",450,dialogTypes[placeTypes.indexOf("small boulder")],{
        north: 0,
        east: {dir:"lander",cost:10,dirID:7},
        south: {dir:"lava tube",cost:4,dirID:2},
        west: 0}
    ),new Place(4,"rover",0,dialogTypes[placeTypes.indexOf("rover")],{
        north: {dir:"scaterred rocks",cost:9,dirID:5},
        east: {dir:"scaterred rocks",cost:13,dirID:8},
        south: 0,
        west: {dir:"scaterred rocks",cost:10,dirID:0}},
        [{name:"metal",amount:3},{name:"wire",amount:2},{name:"magnet",amount:1},{name:"battery",amount:3}]
    ),new Place(5,"scaterred rocks",890,dialogTypes[placeTypes.indexOf("scaterred rocks")],{
        north: {dir:"big crater",cost:4,dirID:6},
        east: {dir:"small boulder",cost:1,dirID:9},
        south: {dir:"rover",cost:9,dirID:4},
        west: {dir:"big boulder",cost:20,dirID:1}}
    ),new Place(6,"big crater",5000,dialogTypes[placeTypes.indexOf("big crater")],{
        north: {dir:"lander",cost:23,dirID:7},
        east: {dir:"small crater",cost:3,dirID:10},
        south: {dir:"scaterred rocks",cost:4,dirID:5},
        west: {dir:"lava tube",cost:1,dirID:2}}
    ),new Place(7,"lander",1200,dialogTypes[placeTypes.indexOf("lander")],{
        north: 0,
        east: 0,
        south: 0,
        west: 0}
    ),new Place(8,"scaterred rocks",0,dialogTypes[placeTypes.indexOf("scaterred rocks")],{
        north: {dir:"small boulder",cost:2,dirID:9},
        east: 0,
        south: 0,
        west: {dir:"rover",cost:23,dirID:4}}
    ),new Place(9,"small boulder",78,dialogTypes[placeTypes.indexOf("small boulder")],{
        north: {dir:"small crater",cost:5,dirID:10},
        east: 0,
        south: {dir:"scaterred rocks",cost:23,dirID:8},
        west: {dir:"scaterred rocks",cost:10,dirID:5}}
    ),new Place(10,"small crater",789,dialogTypes[placeTypes.indexOf("small crater")],{
        north: {dir:"big boulder",cost:9,dirID:11},
        east: 0,
        south: {dir:"small boulder",cost:23,dirID:9},
        west: {dir:"big crater",cost:3,dirID:6}}
    ),new Place(11,"big boulder",68,dialogTypes[placeTypes.indexOf("big boulder")],{
        north: 0,
        east: {dir:"spacecraft",cost:100,dirID:12},
        south: {dir:"small crater",cost:23,dirID:10},
        west: {dir:"lander",cost:1,dirID:7}}
    ),new Place(12,"spacecraft",68,dialogTypes[placeTypes.indexOf("spacecraft")],{
        north: 0,
        east: 0,
        south: 0,
        west: {dir:"big boulder",cost:15,dirID:11}},
        [{name:"battery",amount:5},{name:"plastic",amount:5},{name:"tape",amount:4},{name:"wire",amount:2}]
    )]
}


let prebuiltLevel = {places:[]};
prebuiltLevel.places = createRandomPlaces(prompt("difficulty: 1.easy 2.medium 3.hard"));
completeLevel();
    
        

console.log(prebuiltLevel);



let mainCharacter = new Player(prompt("enter your name astronaut"),4);
//console.log(mainCharacter.givePositionObject(prebuiltLevel))


let consoleSize = 1;

$(document).ready(function(){
    printPlaceRepAppend();
    $(document).keypress(function(key){

        if(key.which==13 && $('#user-input').is(':focus')){

            let userInputKeyboard = $('#user-input').val();
            let userInput = inputConvert(userInputKeyboard);
            console.log("userInputKeyboard:",userInputKeyboard);
            console.log("userInputKeyboard typeof:",typeof userInputKeyboard);
            


            if(typeof userInputKeyboard == "string" &&( userInputKeyboard <= 0 || userInputKeyboard > 10)){
                if(consoleSize>8){
                    $('#game-text').text("Bad input");
                    printPlaceRepAppend();
                    consoleSize=0;
                }else{
                    $('#game-text').append("<p>" + "Bad input" + "</p>");
                    printPlaceRepAppend();
                    consoleSize+=2;
                }

            }else{

             console.log("positionPlace: ",mainCharacter.givePositionObject(prebuiltLevel));
                  
                if(userInputKeyboard<5){

                    tryToMove(userInput);

                }else {
                    if(userInputKeyboard == 5){
                        startSearchSalvage();
                    }
                    else if(userInputKeyboard == 6){
                        printStatusRep();
                    }
                    else if(userInputKeyboard == 7){
                        printItems();
                    }else if(userInputKeyboard == 8){
                        printHandbook();
                    }else if(userInputKeyboard == 9){
                        startCall();
                    }else if(userInputKeyboard == 10){
                        generateRandomLevel();
                    }else if(userInputKeyboard.toLowerCase() == "a"){
                        //console.log("requiredForUpgrade before: ",upgrades[0].cost);
                        //console.log("this.items before: ",mainCharacter.items);
                        mainCharacter.getUpgrade(upgrades[0].name,upgrades[0].cost);

                    }else if(userInputKeyboard.toLowerCase() == "b"){
                        //console.log("requiredForUpgrade before: ",upgrades[1].cost);
                        //console.log("this.items before: ",mainCharacter.items);
                        mainCharacter.getUpgrade(upgrades[1].name,upgrades[1].cost);

                    }else if(userInputKeyboard.toLowerCase() == "c"){
                        //console.log("requiredForUpgrade before: ",upgrades[2].cost);
                        //console.log("this.items before: ",mainCharacter.items);
                        mainCharacter.getUpgrade(upgrades[2].name,upgrades[2].cost);

                    }else if(userInputKeyboard.toLowerCase() == "myself" && mainCharacter.upgradesActive.indexOf("radio") != -1){

                        $('#game-text').append("<p>" + "Good luck" + "</p>");
                        printPlaceRepAppend();
                        consoleSize+=2;

                    }else if(userInputKeyboard.toLowerCase() == "guide me" && mainCharacter.upgradesActive.indexOf("radio") != -1){

                        tryToMove("spacecraft vector");

                    }else{
                        $('#game-text').append("<p>" + "Bad input" + "</p>");
                        printPlaceRepAppend();
                        consoleSize+=2;
                    }   
                checkForAchievements();
            }
            
            
        }
    };

    });

    
})


document.getElementById('button').onclick = function() {
        
    let prebuiltLevelExport = {places:[]};
    prebuiltLevelExport.places = createRandomPlaces(prompt("difficulty: 1.easy 2.medium 3.hard"));
    
    let directionsForRM = [

    
        {north: {dir:prebuiltLevelExport.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1},
                        east: {dir:prebuiltLevelExport.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4},
                        south: 0,
                        west: 0},

        
        
        
        
        {north: {dir:prebuiltLevelExport.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2},
                        east: {dir:prebuiltLevelExport.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
                        south: {dir:prebuiltLevelExport.places[0].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:0},
                        west: 0},
        
        
        
        
        {north: {dir:prebuiltLevelExport.places[3].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:3},
                        east: {dir:prebuiltLevelExport.places[6].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6},
                        south: {dir:prebuiltLevelExport.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1},
                        west: 0
        },
        
        
                       
        {north: 0,
            east: {dir:prebuiltLevelExport.places[7].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7},
            south: {dir:prebuiltLevelExport.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2},
             west: 0},


             {north: {dir:prebuiltLevelExport.places[5].type ,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
                east: {dir:prebuiltLevelExport.places[8].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:8},
                 south: 0,
                 west: {dir:prebuiltLevelExport.places[0].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:0}},


                 {north: {dir:prebuiltLevelExport.places[6].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6},
                        east: {dir:prebuiltLevelExport.places[9].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
                        south: {dir:prebuiltLevelExport.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4},
                        west: {dir:prebuiltLevelExport.places[1].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:1}},

{north: {dir:prebuiltLevelExport.places[7].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7},
                        east: {dir:prebuiltLevelExport.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
                        south: {dir:prebuiltLevelExport.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5},
                        west: {dir:prebuiltLevelExport.places[2].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:2}},

        {   north: 0,
            east: 0,
            south: 0,
            west: 0},
        
        
    
        
        
        
        {north: {dir:prebuiltLevelExport.places[9].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
            east: 0,
            south: 0,
            west: {dir:prebuiltLevelExport.places[4].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:4}},
        
        
        
        
                {north: {dir:prebuiltLevelExport.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
                east: 0,
                south: {dir:prebuiltLevelExport.places[8].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:8},
                west: {dir:prebuiltLevelExport.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:5}},
        

                {north: {dir:prebuiltLevelExport.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:11},
                east: 0,
                south: {dir:prebuiltLevelExport.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:9},
                 west: {dir:prebuiltLevelExport.places[5].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:6}},
        
        
        {north: 0,
            east: {dir:prebuiltLevelExport.places[12].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:12},
            south: {dir:prebuiltLevelExport.places[10].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:10},
            west: {dir:prebuiltLevelExport.places[7].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:7}},
        
        

        {north: 0,
            east: 0,
            south: 0,
            west: {dir:prebuiltLevelExport.places[11].type,cost:Math.round(Math.random() * (45 - 5) + 5),dirID:11}}
        
        ];
    
    for(let i = 0; i < 13; i++){
        if(i == 4){
            prebuiltLevelExport.places[i].directions = directionsForRM[i];
        }else if(i == 7){
            prebuiltLevelExport.places[i].directions = directionsForRM[i];
        }else if(i == 12){
            prebuiltLevelExport.places[i].directions = directionsForRM[i];
        }else{
            prebuiltLevelExport.places[i].directions = directionsForRM[i];
        }
    }

    download(JSON.stringify(prebuiltLevelExport),"levelJSON",".txt");


};


