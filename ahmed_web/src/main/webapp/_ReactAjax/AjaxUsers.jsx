const AjaxUsers = ({url}) => {

    console.log("AjaxUsers running");

    // Tell React that 'items' (an array of objects) is a state variable 
    // that (when changed) should redisplay this component.
    // Set its initial value to [], an empty array.
    const [items, setItems] = React.useState([]);

    // Tell React that "error" is a state variable that (when changed) 
    // should redisplay this component. Set its initial value to null.
    const [error, setError] = React.useState(null);
    const [dbList, setDbList] = React.useState([]);

    const [filterInput, setFilterInput] = React.useState(""); // what is typed
    const [filteredList, setFilteredList] = React.useState([]);           // what Search last applied
    const [isLoading, setIsLoading] = React.useState(true);

    // useEffect 2nd parameter is an array of elements that 
    // (if any of those state variables change) should trigger the function specified 
    // as the 1st useEffect parameter. 
    // RUN ONCE PATTERN: If you put [] as 2nd param, it runs the 1st param (fn) once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(
            "webUser/getAll",

            // success function (anonymous)
            function (obj) {   // success function gets obj from ajax_alt
                if (obj.dbError.length > 0) {
                    setError({friendly: "Database currently unavailable.", technical: obj.dbError});
                } else {
                    console.log("in AjaxUsers, here is web user list (on the next line):");
                    console.log(obj.webUserList);
                    setDbList(obj.webUserList);
                    setFilteredList(obj.webUserList);
                }
                setIsLoading(false); // set isLoading last to prevent premature rendering. 
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                console.log("Ajax error encountered: " + msg);
                setError({friendly: "Unable to load the user list from the server.", technical: "AJAX Error: " + msg});
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

    console.log("items for UserTable on next line");
    console.log(items);

    /* Note that the sort icons are included (below) -- just to show you 
    how to style them -- but these icons do not have any functionality 
    in the Lab Activity. They'll get that in the HW of this module. */
    return (
        <div className="clickSort">
            <h3>
                Filterable User List &nbsp;
                <input value={filterInput} onChange={(e) => setFilterInput(e.target.value)} />
                &nbsp;
                <button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp;
                <button onClick={clearFilter}>Clear</button>
            </h3>


            <table>
                <tr>
                    <th onClick={() => sortByProp("userEmail", "text")} >
                            <img src="icons/dark/blackDownSort.png" />Email
                        </th>
                        <th className="textAlignCenter">Image</th>
                        <th onClick={() => sortByProp("birthday", "date")}
                            className="textAlignCenter">
                            <img src="icons/dark/blackDownSort.png" />Birthday
                        </th>
                        <th onClick={() => sortByProp("membershipFee", "number")}
                            className="textAlignRight" >
                            <img src="icons/dark/blackDownSort.png" />Membership Fee
                        </th>
                        <th onClick={() => sortByProp("userRoleType", "text")}>
                            <img src="icons/dark/blackDownSort.png" />Role
                        </th>
                        <th>Error</th>

                </tr>

                {
                    filteredList.map((listObj, index) =>
                        <tr key={listObj.webUserId || index}>
                            <td>{listObj.userEmail}</td>
                            <td className="shadowImage textAlignCenter"><img src={listObj.userImage} /></td>
                            <td className="textAlignCenter">{listObj.birthday}</td>
                            <td className="textAlignRight">{listObj.membershipFee}</td>
                            <td className="nowrap">{listObj.userRoleId} {listObj.userRoleType}</td>
                            <td>{listObj.errorMsg}</td>
                        </tr>
                    )
                }

            </table>
        </div>
    );




}; // function AjaxUsers 