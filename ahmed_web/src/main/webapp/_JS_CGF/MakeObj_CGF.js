"use strict";

function MakeObj_CGF() {

    var container = document.createElement("div");
    container.classList.add("obj_CGF");

    var speedrun1 = MakeObj({
        spawnStruct: "Ruined Portal",
        spawnStructImg: "pics/IronMan.png",
        netherTime: "10",
        bastionType: "Stables",
        strongholdTime: "16",
        finalTime: "20",
    }); container.appendChild(speedrun1);

    var speedrun2 = MakeObj({}); container.appendChild(speedrun2);

    return container;
}