package model.player;
public class StringData {
    public String Player_id = "";     // auto-increment primary key
    public String Player_Username = "";     // varChar 45, must be unique
    public String Player_Skin = "";  // varChar 45, required (length >=1)
    public String Nether_Enter_Time = "";     // varChar 500, required (length >=1)
    public String Stronghold_Enter_Time = "";      // type date, optional
    public String Final_Time = ""; // type decimal, optional
    public String Starting_Structure = "";    // foreign key (integer), required by DB
    public String BastionType = "";  // varChar, joined from user_role table.
    public String web_user_id = "";  // varChar, joined from user_role table.

    public String errorMsg = "";      // not actually in the database, used by the app 
                                      // to convey success or failure.    
}
