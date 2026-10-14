const AjaxSpeedruns = ({url}) => {

    console.log("AjaxCars running");

    // Tell React that 'items' (an array of objects) is a state variable 
    // that (when changed) should redisplay this component.
    // Set its initial value to [], an empty array.
    const [items, setItems] = React.useState([]);

    // Tell React that "error" is a state variable that (when changed) 
    // should redisplay this component. Set its initial value to null.
    const [error, setError] = React.useState(null);
    const [dbList, setDbList] = React.useState([]);

    const [isLoading, setIsLoading] = React.useState(true);

    const [sortBy, setSortBy] = React.useState("Player_Username"); // leftmost column first
    const [filterInput, setFilterInput] = React.useState(""); // what is typed
    const [filteredList, setFilteredList] = React.useState([]);           // what Search last applied

    // useEffect 2nd parameter is an array of elements that 
    // (if any of those state variables change) should trigger the function specified 
    // as the 1st useEffect parameter. 
    // RUN ONCE PATTERN: If you put [] as 2nd param, it runs the 1st param (fn) once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(
            "json/speedruns.json",

            // success function (anonymous)
            function (obj) {   // success function gets obj from ajax_alt
                if (obj.dbError.length > 0) {
                    setError({friendly: "Database currently unavailable.", technical: obj.dbError});
                    setItems([]);
                } else {
                    console.log("in AjaxCars, here is web user list (on the next line):");
                    console.log(obj.Player_Info);
                    setDbList(obj.Player_Info);
                    setFilteredList(obj.Player_Info);
                }
                setIsLoading(false); // set isLoading last to prevent premature rendering. 
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                setError({friendly: "Unable to load the speedrun list from the server.", technical: "AJAX Error: " + msg}   );
                setIsLoading(false); // set isLoading last to prevent premature rendering.
            }
        );
    }, []);

    const doFilter = (filterInputVal) => {
        let newList = filterObjList(dbList, filterInputVal);
        console.log("function doFilter. filterInputVal is: " + filterInputVal +
            ". See filtered list on next line:");
        console.log(newList);
        setFilteredList(newList);
    };

    const clearFilter = () => {
        setFilterInput("");
        doFilter("");
        setFilteredList(dbList.slice());
    }

    function sortByProp(propName, sortType) {
        let listCopy = structuredClone(dbList);  

        jsSort(listCopy, propName, sortType);
        console.log("Sorted list is below");
        console.log(listCopy);

        setDbList(listCopy);
        setFilteredList(listCopy);
    }


    if (isLoading) {
        console.log("Is Loading...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log("Error...");
        return (
            <div>
                <p><strong>{error.friendly}</strong></p>
                <p>Technical details: {error.technical}</p>
            </div>
        );

    }

    console.log("items for SpeedrunTable on next line");
    console.log(items);

    /* Note that the sort icons are included (below) -- just to show you 
    how to style them -- but these icons do not have any functionality 
    in the Lab Activity. They'll get that in the HW of this module. */
    return (
        <div className="clickSort">
            <h3>
                Filterable Speedrun List &nbsp;
                <input value={filterInput} onChange={(e) => setFilterInput(e.target.value)} />
                &nbsp;
                <button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp;
                <button onClick={clearFilter}>Clear</button>
            </h3>
            <table>
                <tr>
                    <th onClick={() => sortByProp("Player_Username", "text")} >
                        <img src="icons/dark/blackDownSort.png" />Username
                    </th>
                    <th onClick={() => sortByProp("Nether_Enter_Time", "time")}
                        className="textAlignCenter">
                        <img src="icons/dark/blackDownSort.png" />Nether Enter Time
                    </th>
                    <th onClick={() => sortByProp("Stronghold_Enter_Time", "time")}
                        className="textAlignCenter">
                        <img src="icons/dark/blackDownSort.png" />Stronghold Enter Time
                    </th>
                    <th onClick={() => sortByProp("Final_Time", "time")}
                        className="textAlignCenter">
                        <img src="icons/dark/blackDownSort.png" />Final Time
                    </th>
                    <th onClick={() => sortByProp("Starting_Structure", "text")}
                        className="textAlignCenter">
                        <img src="icons/dark/blackDownSort.png" />Starting Structure
                    </th>
                    <th onClick={() => sortByProp("Bastion_Type", "text")}
                        className="textAlignCenter">
                        <img src="icons/dark/blackDownSort.png" />Bastion Type
                    </th>
                </tr>

                {
                    filteredList.map((listObj,index) =>
                        <tr key={listObj.Player_id || index}>
                            <td className="skinSizing">{listObj.Player_Username}<br /><img src={listObj.Player_Skin} /></td>
                            <td className="textAlignRight">{listObj.Nether_Enter_Time}</td>
                            <td className="textAlignRight">{listObj.Stronghold_Enter_Time}</td>
                            <td className="textAlignRight">{listObj.Final_Time}</td>
                            <td>{listObj.Starting_Structure}</td>
                            <td>{listObj.Bastion_Type}</td>
                        </tr>
                    )
                }

            </table>
        </div>
    );

}; // function AjaxCars