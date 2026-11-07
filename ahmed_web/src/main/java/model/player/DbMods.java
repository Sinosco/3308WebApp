package model.player;

import dbUtils.*;

public class DbMods { //clean up

    /*
     * Validates a time entered as H:MM:SS or HH:MM:SS (hours 0-23, minutes and
     * seconds 0-59). Returns "" if the input is OK, otherwise an error message.
     * If the field is not required, an empty entry is OK (the field is nullable).
     * Validate.java has no method for "time" so this one lives here.
     */
    public static String timeMsg(String s, boolean required) {
        if (s == null || s.trim().length() == 0) {
            return required ? "Input is required" : "";
        }
        if (!s.trim().matches("([01]?\\d|2[0-3]):[0-5]\\d:[0-5]\\d")) {
            return "Please enter a time as HH:MM:SS";
        }
        return "";
    }

    // Returns null if the string is null or empty, else the trimmed string.
    private static String emptyToNull(String s) {
        if (s == null || s.trim().length() == 0) {
            return null;
        }
        return s.trim();
    }

    // Returns true if a row that matches every field of the user's entry is already
    // in the database (checked before inserting so that the user gets a friendly message).
    private static boolean entryExists(StringData d, DbConn dbc) {
        try {
            // <=> is MySQL's null safe equals (so null <=> null is true).
            String sql = "SELECT COUNT(*) FROM Player_Info WHERE "
                    + "Player_Username = ? "
                    + "AND Nether_Enter_Time <=> ? "
                    + "AND Stronghold_Enter_Time <=> ? "
                    + "AND Final_Time = ? "
                    + "AND COALESCE(Starting_Structure,'') = ? "
                    + "AND COALESCE(Bastion_Type,'') = ? "
                    + "AND web_user_id = ?";
            java.sql.PreparedStatement ps = dbc.getConn().prepareStatement(sql);
            ps.setString(1, d.Player_Username);
            ps.setString(2, emptyToNull(d.Nether_Enter_Time));
            ps.setString(3, emptyToNull(d.Stronghold_Enter_Time));
            ps.setString(4, d.Final_Time.trim());
            ps.setString(5, d.Starting_Structure);
            ps.setString(6, d.Bastion_Type);
            ps.setInt(7, Validate.convertInteger(d.web_user_id));
            java.sql.ResultSet rs = ps.executeQuery();
            boolean exists = rs.next() && rs.getInt(1) > 0;
            rs.close();
            ps.close();
            return exists;
        } catch (Exception e) {
            System.out.println("entryExists() error: " + e.getMessage());
            return false; // if this check fails, let the insert itself report any problem.
        }
    }

    /*
     * Returns a "StringData" object that is full of field level validation
     * error messages (or "" for any field that passes validation).
     */
    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        /*
         * Useful to copy field names from StringData as a reference
         * public String Player_id = "";             // auto-increment, not validated
         * public String Player_Username = "";       // varChar 16, required
         * public String Player_Skin = "";           // varChar 500, optional
         * public String Nether_Enter_Time = "";     // time, optional (nullable)
         * public String Stronghold_Enter_Time = ""; // time, optional (nullable)
         * public String Final_Time = "";            // time, required
         * public String Starting_Structure = "";    // varChar 20, optional
         * public String Bastion_Type = "";          // varChar 15, optional
         * public String web_user_id = "";           // foreign key (integer), required
         */
        // Validation
        errorMsgs.Player_Username = Validate.stringMsg(inputData.Player_Username, 16, true);
        errorMsgs.Player_Skin = Validate.stringMsg(inputData.Player_Skin, 500, false);
        errorMsgs.Nether_Enter_Time = timeMsg(inputData.Nether_Enter_Time, false);
        errorMsgs.Stronghold_Enter_Time = timeMsg(inputData.Stronghold_Enter_Time, false);
        errorMsgs.Final_Time = timeMsg(inputData.Final_Time, true);
        errorMsgs.Starting_Structure = Validate.stringMsg(inputData.Starting_Structure, 20, false);
        errorMsgs.Bastion_Type = Validate.stringMsg(inputData.Bastion_Type, 15, false);
        errorMsgs.web_user_id = Validate.integerMsg(inputData.web_user_id, true);

        return errorMsgs;
    } // validate

    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            if (entryExists(inputData, dbc)) {
                errorMsgs.errorMsg = "That exact entry already exists. Please change at least one field.";
                return errorMsgs;
            }

            // Start preparing SQL statement. PrepStatement.setString turns null into "",
            // so NULLIF(?,'') is what turns an empty time back into a real null in the database.
            String sql = "INSERT INTO Player_Info (Player_Username, Player_Skin, Nether_Enter_Time, "
                    + "Stronghold_Enter_Time, Final_Time, Starting_Structure, Bastion_Type, web_user_id) "
                    + "VALUES (?,?,NULLIF(?,''),NULLIF(?,''),?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.Player_Username);
            pStatement.setString(2, inputData.Player_Skin);
            pStatement.setString(3, emptyToNull(inputData.Nether_Enter_Time));
            pStatement.setString(4, emptyToNull(inputData.Stronghold_Enter_Time));
            pStatement.setString(5, inputData.Final_Time.trim());
            pStatement.setString(6, inputData.Starting_Structure);
            pStatement.setString(7, inputData.Bastion_Type);
            pStatement.setInt(8, Validate.convertInteger(inputData.web_user_id));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to
                                             // the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk
                    // sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                // user friendly message first, then the technical message from the DBMS.
                errorMsgs.errorMsg = "Invalid web user - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That player username is already taken - " + errorMsgs.errorMsg;
            }

        } // all fields passed validation
        return errorMsgs;
    } // insert

}
