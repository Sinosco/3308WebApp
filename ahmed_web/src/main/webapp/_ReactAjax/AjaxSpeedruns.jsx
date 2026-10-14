const AjaxSpeedruns = ({url}) => {

    console.log("AjaxCars running");

    // Tell React that 'items' (an array of objects) is a state variable 
    // that (when changed) should redisplay this component.
    // Set its initial value to [], an empty array.
    const [items, setItems] = React.useState([]);

    // Tell React that "error" is a state variable that (when changed) 
    // should redisplay this component. Set its initial value to null.
    const [error, setError] = React.useState(null);

    const [isLoading, setIsLoading] = React.useState(true);

    // useEffect 2nd parameter is an array of elements that 
    // (if any of those state variables change) should trigger the function specified 
    // as the 1st useEffect parameter. 
    // RUN ONCE PATTERN: If you put [] as 2nd param, it runs the 1st param (fn) once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(
            url, // URL for AJAX call to invoke
            //"json/users.json", // URL for AJAX call to invoke
            //"webUser/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (dbList) {   // success function gets obj from ajax_alt
                if (dbList.dbError.length > 0) {
                    setError(dbList.dbError);
                } else {
                    console.log("in AjaxCars, here is web user list (on the next line):");
                    console.log(dbList.Player_Info);
                    setItems(dbList.Player_Info);
                }
                setIsLoading(false); // set isLoading last to prevent premature rendering. 
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                setError(msg);
                setIsLoading(false); // set isLoading last to prevent premature rendering.
            }
        );
    },
        []);

    if (isLoading) {
        console.log("Is Loading...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log("Error...");
        return <div>Error: {error} </div>;
    }

    console.log("items for UserTable on next line");
    console.log(items);

    /* Note that the sort icons are included (below) -- just to show you 
    how to style them -- but these icons do not have any functionality 
    in the Lab Activity. They'll get that in the HW of this module. */
    return (
        <div className="clickSort">
            <h3>
                Speedrun List
            </h3>
            <table>
                <tr>
                    <th className="textAlignCenter"><img src="icons/dark/blackDownSort.png" />Username</th>
                    <th className="textAlignCenter"><img src="icons/dark/blackDownSort.png" />Nether Enter Time</th>
                    <th className="textAlignCenter"><img src="icons/dark/blackDownSort.png" />Stronghold Enter Time</th>
                    <th className="textAlignCenter"><img src="icons/dark/blackDownSort.png" />Final Time</th>
                    <th className="textAlignCenter"><img src="icons/dark/blackDownSort.png" />Starting Structure</th>
                    <th className="textAlignCenter"><img src="icons/dark/blackDownSort.png" />Bastion Type</th>
                    
                </tr>

                {
                    items.map((item, index) =>
                        <tr key={item.id}>
                            <td className="skinSizing">{item.Player_Username}<br /><img src={item.Player_Skin} /></td>
                            <td>{item.Nether_Enter_Time}</td>
                            <td>{item.Stronghold_Enter_Time}</td>
                            <td>{item.Final_Time}</td>
                            <td>{item.Starting_Structure}</td>
                            <td>{item.Bastion_Type}</td>
                        </tr>
                    )
                }

            </table>
        </div>
    );

}; // function AjaxCars