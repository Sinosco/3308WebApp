"use strict";

function MakeObj({
    spawnStruct = "Untitled",
    spawnStructImg = "invalid.png", // image will show default icon if not provided by consumer
    netherTime = "No time provided",
    bastionType = "No bastion type provided",
    strongholdTime = "No time provided",
    finalTime = "No time Provided"
    } = {} // if the consumer passes no object at all, it will act as if an empty object was passed.
    ) { 

    var ele = document.createElement("div");
    ele.classList.add("obj"); // adds styling to ele - see obj.css rules for ".obj"

    ele.spawnStruct = spawnStruct; ele.spawnStructImg = spawnStructImg; ele.netherTime = netherTime; 
    ele.bastionType = ele.bastionType; ele.strongholdTime = strongholdTime; ele.finalTime = finalTime;

    ele.innerHTML = `
        <div class='objInfoClass'></div>
        <div class='objControls'>
            <button class='netherEnterButtonClass'>Nether</button>
            <input class='netherEnterInputClass' type='text'/> <br/>
        
            <button class='strongholdEnterButtonClass'>Stronghold</button>
            <input class='strongholdEnterInputClass' type='text'/> <br/>

            <button class='finalTimeButtonClass'>Finished</button>
            <input class='finalTimeInputClass' type='text'/> <br/>

            Bastion Type: <select class="selectBastionTypeClass">
                <option value="1">Bridge</option>
                <option value="2">Stables</option>
                <option value="3">Treasure</option>
                <option value="4">Housing</option>
            </select>

        </div>
    `;

    // get a reference to the H2 tag (so we can add an onclick function to it).
    var objInfo =               ele.getElementsByClassName("objInfoClass") [0]; 
    var netherEnterButton =     ele.getElementsByClassName("netherEnterButtonClass")[0];
    var netherEnterInput =      ele.getElementsByClassName("netherEnterInputClass")[0];
    var strongholdEnterButton = ele.getElementsByClassName("strongholdEnterButtonClass")[0];
    var strongholdEnterInput =  ele.getElementsByClassName("strongholdEnterInputClass")[0];
    var finalTimeButton =       ele.getElementsByClassName("finalTimeButtonClass")[0];
    var finalTimeInput =        ele.getElementsByClassName("finalTimeInputClass")[0];

    var selectBastionType =     ele.getElementsByClassName("selectBastionTypeClass")[0];

    var display = function () {
        var setSpawnStructImg = "";
        if (spawnStructImg === null) { spawnStructureImg = "<p>image not available</p>"; } 
        else                 { spawnStructureImg = `<img src='${spawnStructImg}' alt='Picture of ${spawnStruct}' />`; }

        objInfo.innerHTML = 
        `<h3>${spawnStruct}</h3>
          ${setSpawnStructImg}
          <p>
             Nether Enter Time: ${ele.netherTime} <br/>
             Bastion Type: ${ele.bastionType} <br/>
             Stronghold Enter Time: ${ele.strongholdTime} <br/>
             Final Time: ${ele.finalTime} <br/>

             Salary: ${formatCurrency(empSalary)}
          </p> `;
    };

    objInfo.setNetherTime =     function(newTime){ ele.netherTime =     newTime; display(); };
    objInfo.setStrongholdTime = function(newTime){ ele.strongholdTime = newTime; display(); };
    objInfo.setFinalTime =      function(newTime){ ele.finalTime =      newTime; display(); };

    display();

    netherEnterButton.onclick = function() {ele.setNetherTime(netherEnterInput.value); };
    strongholdEnterButton.onclick = function() {ele.setStrongholdTime(strongholdEnterInput.value); };
    finalEnterButton.onclick = function() {ele.setFinalTime(finalTimeInput.value); };
    
        


    return ele;
}