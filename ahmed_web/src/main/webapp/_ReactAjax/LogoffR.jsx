const LogoffR = () => {
    
     const [message, setMessage] = React.useState("Logging off...");

     React.useEffect(() => {
        ajax_alt(
            "webUser/logoff",

            function (obj) { setMessage(obj.errorMsg); },
            function (msg) { setMessage("AJAX error: " + msg); }
        );
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "1rem" }}>
            {message}
        </div>
    );
};