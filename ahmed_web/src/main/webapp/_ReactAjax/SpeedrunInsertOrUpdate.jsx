"use strict";

// One component for BOTH speedrun (Player_Info) insert and update (code reuse).
//   #/speedrunInsert        -> no :id in the URL -> action is "insert"
//   #/speedrunUpdate/:id    -> :id in the URL    -> action is "update" (id = Player_id to edit)
// All validation is done on the server side (Player_Info/insert and Player_Info/update
// Web APIs), this component just shows the server's error messages.
const SpeedrunInsertOrUpdate = () => {

    // React Router gives us the ":id" part of the URL (undefined for /speedrunInsert).
    // (index.html puts useParams on window so this non-module file can use it.)
    const { id } = window.useParams();
    const action = id ? "update" : "insert"; // exact spelling must match the web APIs

    console.log("SpeedrunInsertOrUpdate running, action is " + action + ", id is " + id);

    const blankSpeedrun = {
        "Player_id": "",
        "Player_Username": "",
        "Player_Skin": "",
        "Nether_Enter_Time": "",
        "Stronghold_Enter_Time": "",
        "Final_Time": "",
        "Starting_Structure": "",
        "Bastion_Type": "",
        "web_user_id": "",
        "errorMsg": ""
    };

    // Holds all the user entered data. Each property is linked with an input element.
    const [speedrunData, setSpeedrunData] = React.useState(blankSpeedrun);

    // Holds all the error messages - field level and form/record level (errorMsg).
    const [errorObj, setErrorObj] = React.useState(blankSpeedrun);

    // The list of web users that fills the Web User pick list (select tag).
    const [webUserList, setWebUserList] = React.useState([]);

    // Two AJAX calls run in parallel (web user list + the speedrun to edit), so
    // there is one boolean per call. We render only when BOTH are done.
    const [isLoadingUserList, setIsLoadingUserList] = React.useState(true);
    const [isLoadingSpeedrun, setIsLoadingSpeedrun] = React.useState(action === "update");

    // true while the insert/update AJAX call is running (disables the Save button).
    const [isSaving, setIsSaving] = React.useState(false);

    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj); // makes a copy of the object
        o[propName] = propValue;        // changes the property of the copy
        return o;
    };

    const encodeSpeedrunInput = () => {
        var speedrunInputObj = {
            "Player_id": speedrunData.Player_id,
            "Player_Username": speedrunData.Player_Username,
            "Player_Skin": speedrunData.Player_Skin,
            "Nether_Enter_Time": speedrunData.Nether_Enter_Time,
            "Stronghold_Enter_Time": speedrunData.Stronghold_Enter_Time,
            "Final_Time": speedrunData.Final_Time,
            "Starting_Structure": speedrunData.Starting_Structure,
            "Bastion_Type": speedrunData.Bastion_Type,
            "web_user_id": speedrunData.web_user_id
        };
        console.log("speedrunInputObj on next line");
        console.log(speedrunInputObj);
        return encodeURIComponent(JSON.stringify(speedrunInputObj));
    };

    // Runs when the component first shows (and again if the id in the URL changes,
    // for example going from the update UI to the insert UI).
    React.useEffect(() => {

        // start from a clean slate
        setSpeedrunData(blankSpeedrun);
        setErrorObj(blankSpeedrun);
        setIsLoadingUserList(true);
        setIsLoadingSpeedrun(action === "update");

        // AJAX call #1: the web user list (fresh copy every time, so a user that was
        // just added shows up in the pick list).
        ajax_alt(
            "webUser/getAll",

            function (obj) {
                if (obj.dbError.length > 0) {
                    setErrorObj(prev => setProp(prev, "web_user_id", obj.dbError));
                } else {
                    jsSort(obj.webUserList, "userEmail", "text"); // alphabetical by email
                    setWebUserList(obj.webUserList);
                    if (action === "insert" && obj.webUserList.length > 0) {
                        // the select tag shows the first user, so that must also be the value
                        // of web_user_id. (For update, the owner comes from call #2.)
                        // Functional form (prev => ...) so we never overwrite newer state.
                        setSpeedrunData(prev => setProp(prev, "web_user_id", obj.webUserList[0].webUserId));
                    }
                }
                setIsLoadingUserList(false); // set last to prevent premature rendering
            },

            function (ajaxErrorMsg) {
                setErrorObj(prev => setProp(prev, "errorMsg", ajaxErrorMsg));
                setIsLoadingUserList(false);
            }
        );

        // AJAX call #2 (update only): the speedrun record to be edited.
        if (action === "update") {
            ajax_alt(
                "Player_Info/getById?playerId=" + id,

                function (obj) {
                    if (obj.errorMsg.length > 0) {
                        setErrorObj(prev => setProp(prev, "errorMsg", obj.errorMsg));
                    } else {
                        setSpeedrunData(obj); // pre-fills every input (and selects the web user)
                    }
                    setIsLoadingSpeedrun(false);
                },

                function (ajaxErrorMsg) {
                    setErrorObj(prev => setProp(prev, "errorMsg", ajaxErrorMsg));
                    setIsLoadingSpeedrun(false);
                }
            );
        }
    }, [id]);

    // Called when the user clicks Save. Calls the insert OR update API, which
    // answers with an object full of error messages (all "" if the record was saved).
    const doSave = () => {
        setIsSaving(true);
        ajax_alt(
            "Player_Info/" + action + "?jsonData=" + encodeSpeedrunInput(),

            function (obj) {   // obj holds field level and record level error messages
                console.log("These are the error messages (next line)");
                console.log(obj);
                if (obj.errorMsg.length === 0) {
                    // errorMsg = "" means no error, record was inserted (or updated).
                    obj.errorMsg = "Record Saved !";
                }
                setErrorObj(obj);
                setIsSaving(false);
            },

            function (ajaxErrorMsg) {   // couldn't even reach the insert/update API
                setErrorObj(prev => setProp(prev, "errorMsg", ajaxErrorMsg));
                setIsSaving(false);
            }
        );
    };

    if (isLoadingUserList || isLoadingSpeedrun) {
        return <div> ... Loading ... </div>;
    }

    return (
        <div className="insertArea">
            <h3>{action === "update" ? "Update Speedrun" : "New Speedrun"}</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Id</td>
                        <td><input value={speedrunData.Player_id} disabled /></td>
                        <td className="error">{errorObj.Player_id}</td>
                    </tr>
                    <tr>
                        <td>Username</td>
                        <td>
                            <input value={speedrunData.Player_Username}
                                onChange={e => setSpeedrunData(setProp(speedrunData, "Player_Username", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.Player_Username}</td>
                    </tr>
                    <tr>
                        <td>Skin Image URL</td>
                        <td>
                            <input value={speedrunData.Player_Skin}
                                onChange={e => setSpeedrunData(setProp(speedrunData, "Player_Skin", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.Player_Skin}</td>
                    </tr>
                    <tr>
                        <td>Nether Enter Time (HH:MM:SS)</td>
                        <td>
                            <input value={speedrunData.Nether_Enter_Time}
                                onChange={e => setSpeedrunData(setProp(speedrunData, "Nether_Enter_Time", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.Nether_Enter_Time}</td>
                    </tr>
                    <tr>
                        <td>Stronghold Enter Time (HH:MM:SS)</td>
                        <td>
                            <input value={speedrunData.Stronghold_Enter_Time}
                                onChange={e => setSpeedrunData(setProp(speedrunData, "Stronghold_Enter_Time", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.Stronghold_Enter_Time}</td>
                    </tr>
                    <tr>
                        <td>Final Time (HH:MM:SS)</td>
                        <td>
                            <input value={speedrunData.Final_Time}
                                onChange={e => setSpeedrunData(setProp(speedrunData, "Final_Time", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.Final_Time}</td>
                    </tr>
                    <tr>
                        <td>Starting Structure</td>
                        <td>
                            <input value={speedrunData.Starting_Structure}
                                onChange={e => setSpeedrunData(setProp(speedrunData, "Starting_Structure", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.Starting_Structure}</td>
                    </tr>
                    <tr>
                        <td>Bastion Type</td>
                        <td>
                            <input value={speedrunData.Bastion_Type}
                                onChange={e => setSpeedrunData(setProp(speedrunData, "Bastion_Type", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.Bastion_Type}</td>
                    </tr>
                    <tr>
                        <td>Web User</td>
                        <td>
                            <select value={speedrunData.web_user_id}
                                onChange={e => setSpeedrunData(setProp(speedrunData, "web_user_id", e.target.value))}>
                                {
                                    webUserList.map(user =>
                                        <option key={user.webUserId} value={user.webUserId}>
                                            {user.userEmail}
                                        </option>
                                    )
                                }
                            </select>
                        </td>
                        <td className="error">{errorObj.web_user_id}</td>
                    </tr>
                    <tr>
                        <td>
                            <br />
                            <button type="button" onClick={doSave} disabled={isSaving}>Save</button>
                        </td>
                        <td className="error" colSpan="2">
                            <br />
                            {errorObj.errorMsg}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

}; // function SpeedrunInsertOrUpdate