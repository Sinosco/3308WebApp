// Reusable UI used by BOTH the Log In page and the Get Profile page.
// user = the web user object (StringData as JSON) returned by the Web API.
// heading = "Welcome" (login) or "Profile" (get profile).
const ProfileView = ({ user, heading }) => {

    return (
        <div style={{ padding:"1rem" }}>
            <h3>{heading}, Web User {user.webUserId}</h3>
            <div>Email: {user.userEmail}</div>
            <div>Birthday: {user.birthday}</div>
            <div>Membership Fee: {user.membershipFee}</div>
            <div>User Role: {user.userRoleId} {user.userRoleType}</div>

            {user.userImage &&
                <img src={user.userImage} alt={user.userEmail}
                    style={{
                        width: "8rem", marginTop: "0.5rem", borderRadius: "0.5rem",
                        boxShadow: "0.25rem 0.25rem 0.25rem #AAAAAA"
                    }} />
            }
        </div>
    );

}; // function ProfileView