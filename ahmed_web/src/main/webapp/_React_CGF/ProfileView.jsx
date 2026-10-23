// Reusable UI for Log In and Get Profile page
const ProfileView = ({ user, heading }) => {
    const rowStyle = { padding: "0.4rem 0" };   
    
    return (
        <div style={{ padding:"1rem" }}>
            <h3>{heading}, Web User {user.webUserId}</h3>
            <div style={rowStyle}>Birthday: {user.birthday}</div>
            <div style={rowStyle}>Membership Fee: {user.membershipFee}</div>
            <div style={rowStyle}>User Role: {user.userRoleId} {user.userRoleType}</div>

            {user.userImage &&
                <img src={user.userImage} alt={user.userEmail}
                    style={{
                        width: "15rem", marginTop: "0.5rem", borderRadius: "0.5rem",
                        boxShadow: "0.25rem 0.25rem 0.25rem #AAAAAA"
                    }} />
            }
        </div>
    );

};
