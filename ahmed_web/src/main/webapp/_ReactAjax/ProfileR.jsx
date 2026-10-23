const ProfileR = () => {

    const [user, setUser] = React.useState(null);
    const [message, setMessage] = React.useState("Loading profile...");

    // RUN ONCE PATTERN (like ShowData): the API call happens right away, no button click.
    React.useEffect(() => {

        ajax_alt(
            "webUser/getProfile",

            function (obj) {
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    // Server says nobody is logged on.
                    setMessage("Cannot show profile -- " + obj.errorMsg);
                } else {
                    setMessage("");
                    setUser(obj);
                }
            },

            function (msg) {
                setMessage("AJAX error: " + msg);
            }
        );
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "1rem" }}>
            {message && <div>{message}</div>}
            {user && <ProfileView user={user} heading="Profile" />}
        </div>
    );

}; // function ProfileR