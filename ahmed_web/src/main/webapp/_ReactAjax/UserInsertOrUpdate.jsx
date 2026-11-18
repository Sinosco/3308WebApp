"use strict";

// One component for BOTH web_user insert and web_user update (code reuse).
//   #/userInsert        -> no :id in the URL -> action is "insert"
//   #/userUpdate/:id    -> :id in the URL    -> action is "update" (id = web_user_id to edit)
// All validation is done on the server side (webUser/insert and webUser/update Web APIs),
// this component just shows the server's error messages.
const UserInsertOrUpdate = () => {

    // React Router gives us the ":id" part of the URL (undefined for /userInsert).
    // (index.html puts useParams on window so this non-module file can use it.)
    const { id } = window.useParams();
    const action = id ? "update" : "insert"; // exact spelling must match the web APIs

    console.log("UserInsertOrUpdate running, action is " + action + ", id is " + id);

    const blankUser = {
        "webUserId": "",
        "userEmail": "",
        "userPassword": "",
        "userPassword2": "",
        "userImage": "",
        "birthday": "",
        "membershipFee": "",
        "userRoleId": "",
        "errorMsg": ""
    };

    // Holds all the user entered data. Each property is linked with an input element.
    const [userData, setUserData] = React.useState(blankUser);

    // Holds all the error messages - field level and form/record level (errorMsg).
    const [errorObj, setErrorObj] = React.useState(blankUser);

    // The list of roles that fills the Role pick list (select tag).
    const [roleList, setRoleList] = React.useState([]);

    // Two AJAX calls run in parallel (role list + the user record to edit), so
    // there is one boolean per call. We render only when BOTH are done.
    const [isLoadingRoleList, setIsLoadingRoleList] = React.useState(true);
    const [isLoadingUser, setIsLoadingUser] = React.useState(action === "update");

    // true while the insert/update AJAX call is running (disables the Save button).
    const [isSaving, setIsSaving] = React.useState(false);

    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj); // makes a copy of the object
        o[propName] = propValue;        // changes the property of the copy
        return o;
    };

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
        console.log("userInputObj on next line");
        console.log(userInputObj);
        return encodeURIComponent(JSON.stringify(userInputObj));
    };

    // Runs when the component first shows (and again if the id in the URL changes,
    // for example going from the update UI to the insert UI).
    React.useEffect(() => {

        // start from a clean slate
        setUserData(blankUser);
        setErrorObj(blankUser);
        setIsLoadingRoleList(true);
        setIsLoadingUser(action === "update");

        // AJAX call #1: the role list (fresh copy every time, for the pick list).
        ajax_alt(
            "role/getAll",

            function (obj) {
                if (obj.dbError.length > 0) {
                    setErrorObj(prev => setProp(prev, "userRoleId", obj.dbError));
                } else {
                    jsSort(obj.roleList, "userRoleType", "text"); // alphabetical by role name
                    setRoleList(obj.roleList);
                    if (action === "insert" && obj.roleList.length > 0) {
                        // the select tag shows the first role, so that must also be the value
                        // of userRoleId. (For update, the user's own role comes from call #2.)
                        // Functional form (prev => ...) so we never overwrite newer state.
                        setUserData(prev => setProp(prev, "userRoleId", obj.roleList[0].userRoleId));
                    }
                }
                setIsLoadingRoleList(false); // set last to prevent premature rendering
            },

            function (ajaxErrorMsg) {
                setErrorObj(prev => setProp(prev, "errorMsg", ajaxErrorMsg));
                setIsLoadingRoleList(false);
            }
        );

        // AJAX call #2 (update only): the web_user record to be edited.
        if (action === "update") {
            ajax_alt(
                "webUser/getById?userId=" + id,

                function (obj) {
                    if (obj.errorMsg.length > 0) {
                        setErrorObj(prev => setProp(prev, "errorMsg", obj.errorMsg));
                    } else {
                        setUserData(obj); // pre-fills every input (and selects the role)
                    }
                    setIsLoadingUser(false);
                },

                function (ajaxErrorMsg) {
                    setErrorObj(prev => setProp(prev, "errorMsg", ajaxErrorMsg));
                    setIsLoadingUser(false);
                }
            );
        }
    }, [id]);

    // Called when the user clicks Save. Calls the insert OR update API, which
    // answers with an object full of error messages (all "" if the record was saved).
    const doSave = () => {
        setIsSaving(true);
        ajax_alt(
            "webUser/" + action + "?jsonData=" + encodeUserInput(),

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

    if (isLoadingRoleList || isLoadingUser) {
        return <div> ... Loading ... </div>;
    }

    return (
        <div className="insertArea">
            <h3>{action === "update" ? "Update Web User" : "New Web User"}</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Id</td>
                        <td><input value={userData.webUserId} disabled /></td>
                        <td className="error">{errorObj.webUserId}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>
                            <input value={userData.userEmail}
                                onChange={e => setUserData(setProp(userData, "userEmail", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.userEmail}</td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td>
                            <input type="password" value={userData.userPassword}
                                onChange={e => setUserData(setProp(userData, "userPassword", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.userPassword}</td>
                    </tr>
                    <tr>
                        <td>Re-enter Password</td>
                        <td>
                            <input type="password" value={userData.userPassword2}
                                onChange={e => setUserData(setProp(userData, "userPassword2", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.userPassword2}</td>
                    </tr>
                    <tr>
                        <td>Image URL</td>
                        <td>
                            <input value={userData.userImage}
                                onChange={e => setUserData(setProp(userData, "userImage", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.userImage}</td>
                    </tr>
                    <tr>
                        <td>Birthday (MM/DD/YYYY)</td>
                        <td>
                            <input value={userData.birthday}
                                onChange={e => setUserData(setProp(userData, "birthday", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.birthday}</td>
                    </tr>
                    <tr>
                        <td>Membership Fee</td>
                        <td>
                            <input value={userData.membershipFee}
                                onChange={e => setUserData(setProp(userData, "membershipFee", e.target.value))} />
                        </td>
                        <td className="error">{errorObj.membershipFee}</td>
                    </tr>
                    <tr>
                        <td>Role</td>
                        <td>
                            <select value={userData.userRoleId}
                                onChange={e => setUserData(setProp(userData, "userRoleId", e.target.value))}>
                                {
                                    roleList.map(role =>
                                        <option key={role.userRoleId} value={role.userRoleId}>
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

}; // function UserInsertOrUpdate