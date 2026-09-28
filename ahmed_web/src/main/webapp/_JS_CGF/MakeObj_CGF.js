"use strict";

function MakeObj_CGF() {

    var container = document.createElement("div");
    container.classList.add("obj-container");

    var speedrun1 = MakeObj({
        spawnStruct: "Ruined Portal",
        spawnStructImg: "pics/IronMan.png",
        netherTime: "10:19",
        bastionType: "Stables",
        strongholdTime: "16:47",
        finalTime: "20:34"
    }); container.appendChild(speedrun1);

    var speedrun2 = MakeObj({}); container.appendChild(speedrun2);
    
    return ele;
}