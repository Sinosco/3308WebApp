"use strict";

const SpeedrunInsertOrUpdate = (props) => {

    var action = "insert";
    var id = "";

    var url = window.location.hash; // Gets #/userInsert:5 etc.

    console.log("url that invoked SpeedrunInsertOrUpdate is " + url);

    if (url.search(":") > -1) {
        const url_list = url.split(":");
        id = url_list[url_list.length - 1];
        console.log("to update id " + id);
        action = "update";
    } else {
        console.log("to insert");
    }

    const [playerData, setPlayerData] = React.useState(
        {
            "Player_id": "",
            "Player_Username": "",
            "Player_Skin": "",
            "Nether_Enter_time": "",
            "Stronghold_Enter_Time": "",
            "Final_Time": "",
            "Starting_Structure": "",
            "Bastion_Type": "",
            "web_user_id": "",
            "userEmail": "",
            "errorMsg": ""
        }
    );

    const [userList, setUserList] = React.useState([]);

    const [errorObj, setErrorObj] = React.useState(
        {
            "Player_id": "",
            "Player_Username": "",
            "Player_Skin": "",
            "Nether_Enter_time": "",
            "Stronghold_Enter_Time": "",
            "Final_Time": "",
            "Starting_Structure": "",
            "Bastion_Type": "",
            "web_user_id": "",
            "userEmail": "",
            "errorMsg": ""
        }
    );

    const [isLoading, setIsLoading] = React.useState(true);

    const encodeUserInput = () => {
        var userInputObj = {
            "Player_id": playerData.Player_id,
            "Player_Username": playerData.Player_Username,
            "Player_Skin": playerData.Player_Skin,
            "Nether_Enter_Time": playerData.Nether_Enter_Time,
            "Stronghold_Enter_Time": playerData.Stronghold_Enter_Time,
            "Final_Time": playerData.Final_Time,
            "Starting_Structure": playerData.Starting_Structure,
            "Bastion_Type": playerData.Bastion_Type,
            "web_user_id": playerData.web_user_id
        };
        return encodeURI(JSON.stringify(userInputObj));
    };

    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj);
        o[propName] = propValue;
        return o;
    };

    React.useEffect(
        () => {
            console.log("AJAX call for web user list");
            ajax_alt("webUser/getAll",
                function (obj) {
                    console.log("webUser/getAll Ajax success");
                    if (obj.dbError.length > 0) {
                        setErrorObj(setProp(errorObj, "web_user_id", obj.dbError));
                    } else {
                        obj.webUserList.sort(function (a, b) {
                            if (a.userEmail > b.userEmail) {
                                return 1
                            } else {
                                return -1;
                            }
                        });
                        setUserList(obj.webUserList);

                        if (obj.webUserList.length > 0) {
                            setPlayerData(setProp(playerData, "web_user_id", obj.webUserList[0].webUserId));
                        }

                        if (action === "update") {
                            console.log("Now getting Player_Info record " + id + " for the update");
                            ajax_alt("playerInfo/getById?playerId=" + id,
                                function (obj) {
                                    if (obj.errorMsg.length > 0) {
                                        setErrorObj(setProp(errorObj, "errorMsg", obj.errorMsg));
                                    } else {
                                        setPlayerData(obj);
                                    }
                                },
                                function (ajaxErrorMsg) {
                                    setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                                }
                            );
                        }
                    }
                },
                function (ajaxErrorMsg) {
                    setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                    setIsLoading(false);
                }
            );
        }, []);

    const validate = () => {
        setIsLoading(true);
        ajax_alt("playerInfo/" + action + "?jsonData=" + encodeUserInput(),
            function (obj) {
                if (obj.errorMsg.length === 0) {
                    obj.errorMsg = "Record Saved !";
                }
                setErrorObj(obj);
                setIsLoading(false);
            },
            function (ajaxErrorMsg) {
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }
        );
    };

    if (isLoading) {
        return <div> ... Loading ... </div>;
    }

    return (
        <table className="insertArea">
            <tbody>
                <tr>
                    <td>Player ID</td>
                    <td><input value={playerData.Player_id} disabled /></td>
                    <td className="error">{errorObj.Player_id}</td>
                </tr>
                <tr>
                    <td>Username</td>
                    <td><input value={playerData.Player_Username} onChange={e => setPlayerData(setProp(playerData, "Player_Username", e.target.value))} /></td>
                    <td className="error">{errorObj.Player_Username}</td>
                </tr>
                <tr>
                    <td>Skin (Image URL)</td>
                    <td><input value={playerData.Player_Skin} onChange={e => setPlayerData(setProp(playerData, "Player_Skin", e.target.value))} /></td>
                    <td className="error">{errorObj.Player_Skin}</td>
                </tr>
                <tr>
                    <td>Nether Enter Time (hh:mm:ss)</td>
                    <td><input value={playerData.Nether_Enter_Time} onChange={e => setPlayerData(setProp(playerData, "Nether_Enter_Time", e.target.value))} /></td>
                    <td className="error">{errorObj.Nether_Enter_Time}</td>
                </tr>
                <tr>
                    <td>Stronghold Enter Time (hh:mm:ss)</td>
                    <td><input value={playerData.Stronghold_Enter_Time} onChange={e => setPlayerData(setProp(playerData, "Stronghold_Enter_Time", e.target.value))} /></td>
                    <td className="error">{errorObj.Stronghold_Enter_Time}</td>
                </tr>
                <tr>
                    <td>Final Time (hh:mm:ss)</td>
                    <td><input value={playerData.Final_Time} onChange={e => setPlayerData(setProp(playerData, "Final_Time", e.target.value))} /></td>
                    <td className="error">{errorObj.Final_Time}</td>
                </tr>
                <tr>
                    <td>Starting Structure</td>
                    <td><input value={playerData.Starting_Structure} onChange={e => setPlayerData(setProp(playerData, "Starting_Structure", e.target.value))} /></td>
                    <td className="error">{errorObj.Starting_Structure}</td>
                </tr>
                <tr>
                    <td>Bastion Type</td>
                    <td><input value={playerData.Bastion_Type} onChange={e => setPlayerData(setProp(playerData, "Bastion_Type", e.target.value))} /></td>
                    <td className="error">{errorObj.Bastion_Type}</td>
                </tr>
                <tr>
                    <td>Web User (Owner)</td>
                    <td>
                        <select onChange={e => setPlayerData(setProp(playerData, "web_user_id", e.target.value))} value={playerData.web_user_id}>
                            {
                                userList.map(user =>
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
                        <button type="button" onClick={validate}>Save</button>
                    </td>
                    <td className="error" colSpan="2">
                        <br />
                        {errorObj.errorMsg}
                    </td>
                </tr>
            </tbody>
        </table>
    );

};

// EXPOSE TO WINDOW SO INDEX.HTML CAN SEE IT
window.PlayerInsertOrUpdate = PlayerInsertOrUpdate;