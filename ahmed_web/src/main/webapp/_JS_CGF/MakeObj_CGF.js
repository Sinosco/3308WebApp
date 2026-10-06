"use strict";

function MakeObj_CGF() {

    var container = document.createElement("div");
    container.classList.add("obj_CGF");

    var speedrun1 = MakeObj({
        spawnStruct: "Ruined Portal",
        spawnStructImg: "pics/ruinedPortal.png",
        netherTime: "10",
        bastionType: "Stables",
        strongholdTime: "16",
        finalTime: "20",
        reflect: "craft shield against archer skeletons"
    }); container.appendChild(speedrun1);

    
    var speedrun1 = MakeObj({
        spawnStruct: "Shipwreck",
        spawnStructImg: "pics/shipwreck.png",
        netherTime: "4",
        bastionType: "Treasure",
        strongholdTime: "10",
        finalTime: "14",
        reflect: "Blaze bed for faster rods"
    }); container.appendChild(speedrun1);

    var speedrun3 = MakeObj({}); container.appendChild(speedrun3);

    return container;
}