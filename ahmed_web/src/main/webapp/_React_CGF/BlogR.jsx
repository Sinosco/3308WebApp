"use strict"; 

function BlogR() {
    return (
        <div className="blog">
            <h1>My Personal Blog</h1>
            <h3>Proposed Data Table</h3>
                <p>
                    Numerical tracking of 3 different enter times (time format),
                        string tracking starting structure and bastion type. Describe several key moments in a speedrun.
                </p>
                                <ul>
                    <li>Nether time: Time Format numerical</li>
                    <li>Stronghold time: Time Format numerical</li>
                    <li>End time: Time Format numerical</li>
                    <li>Starting structure: String</li>
                    <li>Bastion type: String</li>
                </ul>
            
            <h3>My Database Experience:</h3>
                <p> No experience coding one, but I do interact with one at work made by some college kids 20 years ago (its not great).</p>
            <h3>My Web Development Experience:</h3> 
                <p>I was a co-leader of my highschool Computer Science Club where we taught our members very rudimentary web development skills like basic HTML, CSS, and JS functionality. We would use premade tutorials and customize it to our needs. Never did anything more beyond that.</p>
            <h3>HW 1 Home Page</h3> 
                <p>I had trouble getting started, I decided to upload everything to github so I can work on my main desktop and laptop whenever, but then it somehow broke the server's abililty to access my index.html on local host. I have it working now, I basically just reset everything to how it was before I did git init. Beyond that this assignment was fairly simple. Seeing the h3 and p elements on the page is already giving me ideas for how this could get developed further and how other websites are actually fairly simple, they just have a bit more touchup. I had a bit more trouble dealing positioning the navbar but I didn't have too much difficulty after fiddling around with it.</p>
            <h3>HW 2 </h3> 
                <p>Importing the styling things were pretty easy. The navbar didn't pose that much of a problem. The issue was trying to copy paste my previous home page content to the blog and home react pages. It would completely break the site and make everything blank including the nav bar. I ended up resetting to an earlier stable build and experimented until I figured out the issue was having inline styling that prevented overflow. Besides that this homework wasn't too bad. I am having trouble connecting to localhost all of a sudden but my VSC live preview worked alright. I use firefox as my preview and the non-compatibility issues are showing as there is a massive top padding issue on my home page on firefox but testing it on chrome it looks fine.</p>
            <h3>Database Update</h3> 
                <h4>Requirements</h4> 
                    <ul>
                        <li>Auto increment Key:             Player_ID</li>
                        <li>Name/Unique Character:          Player_Username</li>
                        <li>Image URL:                      Player_Skin</li>
                        <li>User Optional non-char field 1: Nether_Enter_Time</li>
                        <li>User Optional non-char field 2: Stronghold_Enter_Time</li>
                        <li>Addtional:                      End_Enter_Time</li>
                        <li>Addtional:                      Starting_Structure String</li>
                        <li>Addtional:                      Bastion_Type String</li>
                    </ul>
            <h3>HW 3 </h3>
                <h4>Database</h4>
                <p>This hw wasn't too bad, it was a little time consuming being careful with making the tables because I thought it would be annoying to fix them if I made a mistake. It turns out it was pretty easy to go back and reedit them when you haven't added any data yet. I have a feeling I can make my dates better but technically I still need the hour portion for really bad players. Filling up data cells was the most annoying part I ended up not doing a lot of that. Overall not bad just tedious</p>
            <h3>Server Page</h3><p>Click <a href="hello" target="_blank" class="serverLink" >here</a> to see my published Server Side Page. </p>

            <h3>HW4 </h3>
                <p>This lab was a lot more time consuming as there was a lot to personalize. I was kind of obsessing over the best way to lay things out. I drew out the basic layout I wanted but even then I kept messing with things, eventually I realized I was spending too much time and cut myself off. Using the lab assignment as a reference was extremely useful and kept me guided in how to implement everything. </p>

            <h3>HW5 </h3>
                <p>This lab was largely pretty easy, it would have been much more difficult if the professor hadn't gone over the steps we should take to fix the code. There were a lot of interconnected pieces and functions and classes you needed to call in different files that it would have been hell to configure all of it on my own. Thankfully the professor was kind enough to demo the general steps we should take. The only difficulty I had was publishing as I had gotten used to leaving the WEB_INF file alone and deleting everything else, I will now be deleting it too along with all the other files. I also had an issue merging my lab files with this hw folder but I was able to fix it by adding the com.fasterxml dependency to the pom.xml and then doing maven clean and then verify. I also had issues with having my Run Java update whenever I changed the HTML but it worked out in the end.</p>
            <h3>Database Connections</h3>                
                <p> Click <a href="webUser/getAll" target="_blank">here</a> to view the web users.</p>
                <p> Click <a href="Player_Info/getAll" target="_blank">here</a> to view the database of speedruns!</p>
            <h3>HW6 </h3>
                <p>I had some trouble merging my homework with the lab files, there were lots of little bits I had forgotten or overlooked. I forgot to bring over ajax_alt.js and had forgotten how exactly we were pulling from our web_users from our db and copied over the users.json thinking it was needed. I forgot to copy over clicksort.css and even then I forgot to source and link them in my actual HTML file. Just a lot of small things.  </p>
                <p>I had a LOT of trouble getting the sortable columns and filtering search to work. I originally tried to do it on my own using claude to help but struggled for an hour and a half before a friend told me there was a tutorial from which I ashamedly adapted that code into my own. I still had a lot of issues where filtering worked for one table and not the other, and sorting worked for the other table and not this one. I used a lot of claude to help figure out the fixes for this homework, including rewriting filterObjList and sortOrder. </p>
        </div>
    );
}