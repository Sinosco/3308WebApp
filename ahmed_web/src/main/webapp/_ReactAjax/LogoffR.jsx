const LogoffR = () => {

    // Don't claim the user is logged off until the API has actually responded.
    const [message, setMessage] = React.useState("Logging off...");

    // RUN ONCE PATTERN: the API call happens right away, no button click.
    React.useEffect(() => {

        ajax_alt(
            "webUser/logoff",

            function (obj) {
                // The API puts "user is now logged off" in errorMsg.
                setMessage(obj.errorMsg);
            },

            function (msg) {
                setMessage("AJAX error: " + msg);
            }
        );
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "1rem" }}>
            {message}
        </div>
    );

}; // function LogoffR