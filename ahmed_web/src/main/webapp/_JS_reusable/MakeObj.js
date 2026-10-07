"use strict";

function MakeObj({
    spawnStruct = "Untitled",
    spawnStructImg = "pics/barrier.png", // image will show default icon if not provided by consumer
    netherTime = 0,
    bastionType = "No bastion type provided",
    strongholdTime = 0,
    finalTime = 0,
    reflect = "No improvements"
    } = {} // if the consumer passes no object at all, it will act as if an empty object was passed.
    ) { 

    var ele = document.createElement("div");
    ele.classList.add("obj"); // adds styling to ele - see obj.css rules for ".obj"

    ele.spawnStruct = spawnStruct; ele.spawnStructImg = spawnStructImg; ele.netherTime = netherTime; 
    ele.bastionType = bastionType; ele.strongholdTime = strongholdTime; ele.finalTime = finalTime;
    ele.reflect = reflect;

    ele.innerHTML = `
        <div class='objInfoClass'></div>
        <div class='objControls'>
            <p class='informationText'>Adjust your times in the boxes below.</p>
            <button class='netherEnterButtonClass'>Nether</button>
            <input class='netherEnterInputClass' type='text'/> <br/>
            
            <button class='strongholdEnterButtonClass'>Stronghold</button>
            <input class='strongholdEnterInputClass' type='text'/> <br/>

            <button class='finalTimeButtonClass'>Finished</button>
            <input class='finalTimeInputClass' type='text'/> <br/>
                <p class='error'></p>
            
                Bastion Type: <select class="selectBastionTypeClass">
                    <option value="None">None Selected</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Stables">Stables</option>
                    <option value="Treasure">Treasure</option>
                    <option value="Housing">Housing</option>
                </select> <br/>
            
            <p class='informationText'>Take some time to reflect on how you can improve. </p>
            <button class='reflectButtonClass'>What to improve</button>
            <input class='reflectInputClass' type='text'/> <br/>

        </div>
    `;

    // get a reference to the H2 tag (so we can add an onclick function to it).
    var objInfo =               ele.getElementsByClassName("objInfoClass") [0]; 
    var netherEnterButton =     ele.getElementsByClassName("netherEnterButtonClass")[0];
    var netherEnterInput =      ele.getElementsByClassName("netherEnterInputClass")[0];
        var selectBastionType =     ele.getElementsByClassName("selectBastionTypeClass")[0];
    var strongholdEnterButton = ele.getElementsByClassName("strongholdEnterButtonClass")[0];
    var strongholdEnterInput =  ele.getElementsByClassName("strongholdEnterInputClass")[0];
    var finalTimeButton =       ele.getElementsByClassName("finalTimeButtonClass")[0];
    var finalTimeInput =        ele.getElementsByClassName("finalTimeInputClass")[0];

    var reflectButton =         ele.getElementsByClassName("reflectButtonClass")[0];
    var reflectInput =          ele.getElementsByClassName("reflectInputClass")[0];
    var error =                 ele.getElementsByClassName("error")[0];

    var display = function () {
        var setSpawnStructImg = "";
        if (spawnStructImg === null) { setSpawnStructImg = `<br><img src='${pics/barrier.png}' alt='Image not available' /><br>`; } 
        else                 { setSpawnStructImg = `<br><img src='${spawnStructImg}' alt='No structure found' /><br>`; }

        objInfo.innerHTML = 
        `<h3>${spawnStruct}</h3>
          ${setSpawnStructImg}
             <p>Nether Enter Time: ${ele.netherTime} minutes </p>
             <p>Bastion Type: ${ele.bastionType}  </p>
             <p>Stronghold Enter Time: ${ele.strongholdTime} minutes</p>
             <p>Final Time: ${ele.finalTime} minutes </p>
             <p>What to improve: ${ele.reflect} </p>
             - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        `;
    };

    ele.setNetherTime =     function(newTime){ ele.netherTime =      addMinutes(ele.netherTime, newTime); display(); };
    ele.setStrongholdTime = function(newTime){ ele.strongholdTime =  addMinutes(ele.strongholdTime, newTime); display(); };
    ele.setFinalTime =      function(newTime){ ele.finalTime =       addMinutes(ele.finalTime, newTime); display(); };
    ele.setBastionType =    function(newType) { ele.bastionType =   newType; display(); };
    ele.setReflect =        function(text) { ele.reflect +=          text;    display(); };
    display();

    netherEnterButton.onclick = function()      {if(displayError(netherEnterInput.value));     else ele.setNetherTime(netherEnterInput.value); };
    strongholdEnterButton.onclick = function()  {if(displayError(strongholdEnterInput.value)); else ele.setStrongholdTime(strongholdEnterInput.value); };
    finalTimeButton.onclick = function()        {if(displayError(finalTimeInput.value));       else ele.setFinalTime(finalTimeInput.value); };
    selectBastionType.onchange = function ()    {ele.setBastionType(selectBastionType.value)}
    reflectButton.onclick = function()          {ele.setReflect(reflectInput.value)}
        
    function displayError(input){
        if(isNaN(input) || input.trim() === ""){error.textContent = "One or several of your adjustment times are invalid"; return true;}
        else             error.textContent = ""
        return false;
    }

    var addMinutes = function (current, amount) {
        var total = Math.round((Number(current) + Number(amount)) * 100) / 100;
        return Math.max(0, total);   // optional: stops the total from going below 0
    };



    return ele;
}