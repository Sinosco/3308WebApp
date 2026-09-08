"use strict";

function MakeObj({
    title = "Untitled",
    imgFile = "invalid.png", // image will show default icon if not provided by consumer
    text = "No description provided."
} = {} // if the consumer passes no object at all, it will act as if an empty object was passed.
) { 

    var ele = document.createElement("div");
    ele.classList.add("obj"); // adds styling to ele - see obj.css rules for ".obj"

    ele.innerHTML = `
        <h2 class="myHeadingC">${title}</h2>
        <div><img src="${imgFile}"></div>
        <p>${text}</p>
    `;

    // get a reference to the H2 tag (so we can add an onclick function to it). 
    var myHeading = ele.getElementsByClassName("myHeadingC")[0];

    myHeading.onclick = function () {
        alert("You'll love " + title + "!!");
    };

    return ele;
}