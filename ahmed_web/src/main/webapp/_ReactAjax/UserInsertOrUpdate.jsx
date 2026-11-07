"use strict";

const UserInsertOrUpdate = (props) => {

    var action = "insert";
    var id = "";

    var url = window.location.hash; // Gets #/userInsert:5 etc.

    console.log("url that invoked UserInsertOrUpdate is " + url);

    if (url.search(":") > -1) {
        const url_list = url.split(":");
        id = url_list[url_list.length - 1];
        console.log("to update id " + id);
        action = "update";
    } else {
        console.log("to insert");
    }

    const [userData, setUserData] = React.useState(
        {
            "webUserId": "",
            "userEmail": "",
            "userPassword": "",
            "userPassword2": "",
            "userImage": "",
            "birthday": "",
            "membershipFee": "",
            "userRoleId": "",
            "errorMsg": ""
        }
    );

    const [roleList, setRoleList] = React.useState([]);

    const [errorObj, setErrorObj] = React.useState(
        {
            "webUserId": "",
            "userEmail": "",
            "userPassword": "",
            "userPassword2": "",
            "userImage": "",
            "birthday": "",
            "membershipFee": "",
            "userRoleId": "",
            "errorMsg": ""
        }
    );

    const [isLoading, setIsLoading] = React.useState(true);

    const encodeUserInput = () => {
        var userInputObj = {
            "webUserId": userData.webUserId,
            "userEmail": userData.userEmail,
            "userPassword": userData.userPassword,
            "userPassword2": userData.userPassword2,
            "userImage": userData.userImage,
            "birthday": userData.birthday,
            "membershipFee": userData.membershipFee,
            "userRoleId": userData.userRoleId
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
            console.log("AJAX call for role list");
            ajax_alt("role/getAll",
                function (obj) {
                    console.log("role/getAll Ajax success");
                    if (obj.dbError.length > 0) {
                        setErrorObj(setProp(errorObj, "userRoleId", obj.dbError));
                    } else {
                        obj.roleList.sort(function (a, b) {
                            if (a.userRoleType > b.userRoleType) {
                                return 1
                            } else {
                                return -1;
                            }
                        });
                        setRoleList(obj.roleList);
                        setUserData(setProp(userData, "userRoleId", obj.roleList[0].userRoleId));

                        if (action === "update") {
                            console.log("Now getting webUser record " + id + " for the update");
                            ajax_alt("webUser/getById?userId=" + id,
                                function (obj) {
                                    if (obj.errorMsg.length > 0) {
                                        setErrorObj(setProp(errorObj, "errorMsg", obj.errorMsg));
                                    } else {
                                        setUserData(obj);
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
                }
            );
            setIsLoading(false);
        }, []);

    const validate = () => {
        setIsLoading(true);
        ajax_alt("webUser/" + action + "?jsonData=" + encodeUserInput(),
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
            <h1>New Web User</h1>
            <tbody>
                <tr>
                    <td>Id</td>
                    <td><input value={userData.webUserId} disabled /></td>
                    <td className="error">{errorObj.webUserId}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td><input value={userData.userEmail} onChange={e => setUserData(setProp(userData, "userEmail", e.target.value))} /></td>
                    <td className="error">{errorObj.userEmail}</td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td><input type="password" value={userData.userPassword} onChange={e => setUserData(setProp(userData, "userPassword", e.target.value))} /></td>
                    <td className="error">{errorObj.userPassword}</td>
                </tr>
                <tr>
                    <td>Re-enter Password</td>
                    <td><input type="password" value={userData.userPassword2} onChange={e => setUserData(setProp(userData, "userPassword2", e.target.value))} /></td>
                    <td className="error">{errorObj.userPassword2}</td>
                </tr>
                <tr>
                    <td>Image</td>
                    <td><input value={userData.userImage} onChange={e => setUserData(setProp(userData, "userImage", e.target.value))} /></td>
                    <td className="error">{errorObj.userImage}</td>
                </tr>
                <tr>
                    <td>Birthday</td>
                    <td><input value={userData.birthday} onChange={e => setUserData(setProp(userData, "birthday", e.target.value))} /></td>
                    <td className="error">{errorObj.birthday}</td>
                </tr>
                <tr>
                    <td>Membership Fee</td>
                    <td><input value={userData.membershipFee} onChange={e => setUserData(setProp(userData, "membershipFee", e.target.value))} /></td>
                    <td className="error">{errorObj.membershipFee}</td>
                </tr>
                <tr>
                    <td>Role</td>
                    <td>
                        <select onChange={e => setUserData(setProp(userData, "userRoleId", e.target.value))} value={userData.userRoleId}>
                            {
                                roleList.map(role =>
                                    <option key={role.userRoleId} value={role.userRoleId} >
                                        {role.userRoleType}
                                    </option>
                                )
                            }
                        </select>
                    </td>
                    <td className="error">{errorObj.userRoleId}</td>
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
window.UserInsertOrUpdate = UserInsertOrUpdate;