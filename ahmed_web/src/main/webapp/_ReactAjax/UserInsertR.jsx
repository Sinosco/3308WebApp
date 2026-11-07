"use strict"; //TODO check

// Insert UI for the web_user table. All validation is done on the server side 
// (webUser/insert Web API), this component just shows the server's error messages.
const UserInsertR = () => {

    console.log("UserInsertR running");

    // State Variable that holds all the user entered data. Each property of this 
    // object is linked with one input tag. 
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

    // State Variable that holds all the error messages - field level 
    // and record level (errorMsg).
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

    // The list of roles that fills the User Role pick list (select tag).
    const [roleList, setRoleList] = React.useState([]);

    // Stays true until the role list arrives (so we don't show an empty pick list) 
    // and is true again while we wait for the insert API to answer. 
    const [isLoading, setIsLoading] = React.useState(true);

    // Only the properties that are in model.webUser.StringData.java can be sent 
    // (the server can't convert JSON that has property names it does not know). 
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
        // encodeURIComponent (instead of encodeURI) also encodes characters like & and # 
        // so a password or an image URL that has one of those can't break the URL.
        return encodeURIComponent(JSON.stringify(userInputObj));
    };

    // If you just change the value of a State object's property, React does not know the 
    // object changed. setProp returns a copy of the object with the one property changed. 
    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj); // makes a copy of the object
        o[propName] = propValue;        // changes the property of the copy
        return o;
    };

    // RUN ONCE PATTERN: get the list of roles (role/getAll) to fill the select tag.
    React.useEffect(() => {
        ajax_alt(
            "role/getAll",

            function (obj) {   // success function gets obj from ajax_alt
                if (obj.dbError.length > 0) {
                    setErrorObj(setProp(errorObj, "userRoleId", obj.dbError));
                } else {
                    jsSort(obj.roleList, "userRoleType", "text");
                    setRoleList(obj.roleList);
                    // the select tag shows the first role, so that must also be the 
                    // value of userRoleId (otherwise userRoleId would be "" until the user picks).
                    setUserData(setProp(userData, "userRoleId", obj.roleList[0].userRoleId));
                }
                setIsLoading(false); // set isLoading last to prevent premature rendering.
            },

            function (ajaxErrorMsg) {   // failure function gets error message from ajax_alt
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }
        );
    }, []);

    // Called when the user clicks Save. Sends the user's data to the insert API, which 
    // answers with an object full of error messages (all "" if the record was inserted).
    const doInsert = () => {
        setIsLoading(true);
        ajax_alt(
            "webUser/insert?jsonData=" + encodeUserInput(),

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
            <h3>New Web User</h3>
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
                            {/* option value is the role's PK (what we store as the FK), 
                                option text is the role name (what the user sees). */}
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

}; // function UserInsertR
