"use strict";

function MakeObj_CGF() {

    // if you want to put some style that applies only when this CGF is injected into the 
    // content area, you can do it like this (will be deleted on next nav bar click).
    var content = `

        <div class="obj_CGF">
            <h3>Provider Style Code</h3>
            <ul>
                <li>
                    <strong>MakeObj.js</strong> contains a reusable function, MakeObj, which creates a component 
                    from an input parameter object. This (plain JS) code creates a component (a div), not a React Component. 
                </li>
                <li>
                    <strong>obj.css</strong> provides default styling for the components made by MakeObj. 
                    The consumer can change the styling in this file to meet their wishes. 
                </li>
            </ul>

            <h3>Consumer Code</h3>
            <ul>
                <li>
                    <strong>MakeObj_CGF.js</strong> contains a Content Generating Function (CGF) 
                    that also uses plain JS and also returns a div. This CGF demonstrates how you can 
                    consume the provider style code (MakeObj.js and obj.css). For your CGFs, I usually 
                    ask you to invoke your Make function twice -- to prove that your code is object oriented 
                    (not relying on global variables) and then a third time (passing in an empty
                    parameter object or passing in no parameter object at all) to show that your Make 
                    function works fine using just default values.
                </li>
                <li>
                    <strong>obj_CGF.css</strong> was used to style the div returned by the Content 
                    Generating Funtion (CGF). 
                </li>
            </ul>

            <h3>Invoking the Consumer Code</h3>
            <p>
                The React Router (that we use in index.html) will only display React Components. 
                To convert the div (returned by MakeObj_CGF) to a React Component, we "run that div through" 
                a React Component named &lt;ConvertEle /> -- as demonstrated inside of the content area 
                in index.html: 
            </p>
            <p>
                <img class="codeImg" src="pics/ConvertEle_image.png" />
            </p>
            <div class="flexBoxC obj_CGF"></div>
        </div>
    `;

    var ele = document.createElement("div");
    ele.innerHTML = content; // the HTML code specified just above...

    // will hold three components side by side due to above styling.
    var flexBox = ele.getElementsByClassName("flexBoxC")[0];

    var firstParamObj = {
        title: "Nevada",
        imgFile: "https://cis-linux2.temple.edu/~sallyk/pics_sk/balloons.png",
        text: "$695 for 3 days/nights"
    };
    flexBox.appendChild(MakeObj(firstParamObj));

    var secondParamObj = {
        title: "Japan",
        imgFile: "https://cis-linux2.temple.edu/~sallyk/pics_sk/japan.png",
        text: "$3200 for 7 days/nights"
    };
    flexBox.appendChild(MakeObj(secondParamObj));

    // will show default values for all parameters when you pass no object at all. 
    // see function definition for MakeObj in _JS_reusable/MakeObj.js).
    flexBox.appendChild(MakeObj());

    // also could have done this to get the default component (passing empty object).
    //flexBox.appendChild(MakeObj({}));

    // can use these parameters to get another populated component. 
    // "Sydney", "https://cis-linux2.temple.edu/~sallyk/pics_sk/sydney.png", "$5900 for 9 days/nights"));

    return ele;
}