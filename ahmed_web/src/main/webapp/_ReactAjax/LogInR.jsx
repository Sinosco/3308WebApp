const LoginR = () => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [user, setUser] = React.useState(null);     // the logged-on user (from the API), or null
    const [message, setMessage] = React.useState(""); // error / status message to show

    // Unlike Profile and Logoff, Log On waits for a button click before calling the API.
    const doLogon = () => {

        setUser(null);
        setMessage("Logging on...");

        ajax_alt(
            "webUser/login?userEmail=" + encodeURIComponent(email) +
            "&userPassword=" + encodeURIComponent(password),

            function (obj) {   // obj is the StringData the API returned
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    setMessage(obj.errorMsg);   // DB error or "credentials not found"
                } else {
                    setMessage("");
                    setUser(obj);               // success: show the welcome UI
                }
            },

            function (msg) {
                setMessage("AJAX error: " + msg);
            }
        );
    };

    return (
        <div style={{ textAlign: "center" }}>

            <div style={{ padding: "1rem" }}>
                <label htmlFor="loginEmail">Email Address </label>
                <input id="loginEmail" type="text" value={email}
                    onChange={e => setEmail(e.target.value)} />

                {"  "}

                <label htmlFor="loginPassword">Password </label>
                <input id="loginPassword" type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { doLogon(); } }} />

                {"  "}

                <button type="button" onClick={doLogon}>Submit</button>
            </div>

            {message && <div style={{ padding: "1rem" }}>{message}</div>}

            {user && <ProfileView user={user} heading="Welcome" />}

        </div>
    );

}; // function LoginR