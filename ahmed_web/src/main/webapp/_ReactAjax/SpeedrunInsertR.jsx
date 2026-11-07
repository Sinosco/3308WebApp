"use strict";

// Insert UI for the Player_Info ("other") table. All validation is done on the server side 
const SpeedrunInsertR = () => {

    console.log("SpeedrunInsertR running");

    const [speedrunData, setSpeedrunData] = React.useState(
        {
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
        }
    );

    const [errorObj, setErrorObj] = React.useState(
        {
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
        }
    );

    // The list of web users that fills the Web User pick list (select tag).
    const [webUserList, setWebUserList] = React.useState([]);

    const [isLoading, setIsLoading] = React.useState(true);

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
        return encodeURIComponent(JSON.stringify(speedrunInputObj));
    };

    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj); // makes a copy of the object
        o[propName] = propValue;        // changes the property of the copy
        return o;
    };

    React.useEffect(() => {
        ajax_alt(
            "webUser/getAll",

            function (obj) {   // success function gets obj from ajax_alt
                if (obj.dbError.length > 0) {
                    setErrorObj(setProp(errorObj, "web_user_id", obj.dbError));
                } else if (obj.webUserList.length > 0) {
                    jsSort(obj.webUserList, "userEmail", "text");
                    setWebUserList(obj.webUserList);
                    // the select tag shows the first web user, so that must also be the 
                    // value of web_user_id (otherwise web_user_id would be "" until the user picks).
                    setSpeedrunData(setProp(speedrunData, "web_user_id", obj.webUserList[0].webUserId));
                }
                setIsLoading(false); // set isLoading last to prevent premature rendering.
            },

            function (ajaxErrorMsg) {   // failure function gets error message from ajax_alt
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }
        );
    }, []);

    const doInsert = () => {
        setIsLoading(true);
        ajax_alt(
            "Player_Info/insert?jsonData=" + encodeSpeedrunInput(),

            function (obj) {   // obj holds field level and record level error messages
                console.log("These are the error messages (next line)");
                console.log(obj);
                if (obj.errorMsg.length === 0) {
                    // errorMsg = "" means no error, record was inserted.
                    obj.errorMsg = "Record Saved !";
                }
                setErrorObj(obj);
                setIsLoading(false);
            },

            function (ajaxErrorMsg) {   // couldn't even reach the insert API
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }
        );
    };

    if (isLoading) {
        return <div> ... Loading ... </div>;
    }

    return (
        <div className="insertArea">
            <h3>New Speedrun</h3>
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
                            <button type="button" onClick={doInsert}>Save</button>
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

}; // function SpeedrunInsertR
