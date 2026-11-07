package model.player;

public class StringData {
    public String Player_id = ""; // auto-increment primary key
    public String Player_Username = ""; // varChar 45, must be unique
    public String Player_Skin = ""; // varChar 45, required (length >=1)
    public String Nether_Enter_Time = ""; // varChar 500, required (length >=1)
    public String Stronghold_Enter_Time = ""; // type date, optional
    public String Final_Time = ""; // type decimal, optional
    public String Starting_Structure = ""; // foreign key (integer), required by DB
    public String Bastion_Type = ""; // varChar, joined from user_role table.
    public String web_user_id = ""; // varChar, joined from user_role table.
    public String userEmail = ""; // varChar, joined from user_role table.

    public String errorMsg = ""; // not actually in the database, used by the app
                                 // to convey success or failure.

    public StringData() {
    }

    // Counts the characters in all the fields (except errorMsg). The validate
    // method
    // in DbMods fills a StringData object with field level error messages, so if
    // the
    // count is greater than 0, at least one field failed validation.
    public int characterCount() {
        String s = this.Player_id + this.Player_Username + this.Player_Skin +
                this.Nether_Enter_Time + this.Stronghold_Enter_Time + this.Final_Time +
                this.Starting_Structure + this.Bastion_Type + this.web_user_id + this.userEmail;
        return s.length();
    }

    // not required, can be useful for debugging, e.g.,
    // System.println(sdObj.toString());
    public String toString() {
        return "Player Id:" + this.Player_id
                + ", Player Username: " + this.Player_Username
                + ", Player Skin: " + this.Player_Skin
                + ", Nether Enter Time: " + this.Nether_Enter_Time
                + ", Stronghold Enter Time: " + this.Stronghold_Enter_Time
                + ", Final Time: " + this.Final_Time
                + ", Starting Structure: " + this.Starting_Structure
                + ", Bastion Type: " + this.Bastion_Type
                + ", Web User Id: " + this.web_user_id
                + ", User Email: " + this.userEmail;
    }
}
