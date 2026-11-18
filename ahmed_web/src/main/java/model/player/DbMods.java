package model.player;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.*;

public class DbMods {

    public static String timeMsg(String s, boolean required) {
        if (s == null || s.trim().length() == 0) {
            return required ? "Input is required" : "";
        }
        if (!s.trim().matches("([01]?\\d|2[0-3]):[0-5]\\d:[0-5]\\d")) {
            return "Please enter a time as HH:MM:SS";
        }
        return "";
    }

    private static String emptyToNull(String s) {
        if (s == null || s.trim().length() == 0) {
            return null;
        }
        return s.trim();
    }

    /*
     * Shared by insert AND update. Is there already a record that is identical to
     * the user's input, other than the record whose Player_id is excludeId?
     * - insert passes 0 (no record has Player_id 0, so nothing is excluded)
     * - update passes the id of the record being edited (so a record is never
     * reported as a duplicate of itself, e.g., if the user clicks Save without
     * changing anything).
     */
    private static boolean entryExistsElsewhere(StringData d, DbConn dbc, int excludeId) {
        try {
            String sql = "SELECT COUNT(*) FROM Player_Info WHERE "
                    + "Player_Username = ? "
                    + "AND Nether_Enter_Time <=> ? "
                    + "AND Stronghold_Enter_Time <=> ? "
                    + "AND Final_Time = ? "
                    + "AND COALESCE(Starting_Structure,'') = ? "
                    + "AND COALESCE(Bastion_Type,'') = ? "
                    + "AND web_user_id = ? "
                    + "AND Player_id <> ?";
            PreparedStatement ps = dbc.getConn().prepareStatement(sql);
            ps.setString(1, d.Player_Username);
            ps.setString(2, emptyToNull(d.Nether_Enter_Time));
            ps.setString(3, emptyToNull(d.Stronghold_Enter_Time));
            ps.setString(4, d.Final_Time.trim());
            ps.setString(5, d.Starting_Structure);
            ps.setString(6, d.Bastion_Type);
            ps.setInt(7, Validate.convertInteger(d.web_user_id));
            ps.setInt(8, excludeId);
            ResultSet rs = ps.executeQuery();
            boolean exists = rs.next() && rs.getInt(1) > 0;
            rs.close();
            ps.close();
            return exists;
        } catch (Exception e) {
            System.out.println("entryExistsElsewhere() error: " + e.getMessage());
            return false; // if this check fails, let the insert/update itself report problem.
        }
    }

    /*
     * Returns a "StringData" object that is full of field level validation
     * error messages (or "" for any field that passes validation).
     * Shared by insert AND update.
     */
    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

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

            if (entryExistsElsewhere(inputData, dbc, 0)) {
                errorMsgs.errorMsg = "That exact entry already exists. Please change at least one field.";
                return errorMsgs;
            }

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

    public static StringData update(StringData updateData, DbConn dbc) {

        // Same validation method that insert uses (code reuse).
        StringData errorMsgs = validate(updateData);

        // For update, we also need to check that Player_id has been supplied.
        errorMsgs.Player_id = Validate.integerMsg(updateData.Player_id, true);

        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        }

        // Player_id passed validation, so it is safe to convert it here.
        if (entryExistsElsewhere(updateData, dbc, Validate.convertInteger(updateData.Player_id))) {
            errorMsgs.errorMsg = "That exact entry already exists. Please change at least one field.";
            return errorMsgs;
        }

        String sql = "UPDATE Player_Info SET Player_Username = ?, Player_Skin = ?, "
                + "Nether_Enter_Time = NULLIF(?,''), Stronghold_Enter_Time = NULLIF(?,''), "
                + "Final_Time = ?, Starting_Structure = ?, Bastion_Type = ?, web_user_id = ? "
                + "WHERE Player_id = ?";

        PrepStatement pStatement = new PrepStatement(dbc, sql);

        pStatement.setString(1, updateData.Player_Username);
        pStatement.setString(2, updateData.Player_Skin);
        pStatement.setString(3, emptyToNull(updateData.Nether_Enter_Time));
        pStatement.setString(4, emptyToNull(updateData.Stronghold_Enter_Time));
        pStatement.setString(5, updateData.Final_Time.trim());
        pStatement.setString(6, updateData.Starting_Structure);
        pStatement.setString(7, updateData.Bastion_Type);
        pStatement.setInt(8, Validate.convertInteger(updateData.web_user_id));
        pStatement.setInt(9, Validate.convertInteger(updateData.Player_id));

        int numRows = pStatement.executeUpdate();

        errorMsgs.errorMsg = pStatement.getErrorMsg();
        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows == 1) {
                errorMsgs.errorMsg = ""; // SUCCESS. Let the user interface decide how to tell the user.
            } else {
                errorMsgs.errorMsg = numRows + " records were updated when exactly 1 was expected "
                        + "(does that Player_id exist?).";
            }
        } else if (errorMsgs.errorMsg.contains("foreign key")) {
            errorMsgs.errorMsg = "Invalid web user - " + errorMsgs.errorMsg;
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That player username is already taken - " + errorMsgs.errorMsg;
        }
        return errorMsgs;
    } // update

    // Reads one Player_Info record (joined with web_user, to get the email) so the
    // client can pre-fill the update UI.
    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();
        // This case already tested in the controller, but (belt and suspenders)
        // we are double checking here as well.
        if (id == null) {
            sd.errorMsg = "Cannot getById (player): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (player): URL parameter 'id' can't be converted to an Integer.";
            return sd;
        }
        try {
            String sql = "SELECT Player_id, Player_Username, Player_Skin, Nether_Enter_Time, "
                    + "Stronghold_Enter_Time, Final_Time, Starting_Structure, Bastion_Type, "
                    + "Player_Info.web_user_id, user_email "
                    + "FROM Player_Info LEFT JOIN web_user ON Player_Info.web_user_id = web_user.web_user_id "
                    + "WHERE Player_id = ?";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected
                sd.Player_id = Format.fmtInteger(results.getObject("Player_id"));
                sd.Player_Username = Format.fmtString(results.getObject("Player_Username"));
                sd.Player_Skin = Format.fmtString(results.getObject("Player_Skin"));
                sd.Nether_Enter_Time = Format.fmtTime(results.getObject("Nether_Enter_Time"));
                sd.Stronghold_Enter_Time = Format.fmtTime(results.getObject("Stronghold_Enter_Time"));
                sd.Final_Time = Format.fmtTime(results.getObject("Final_Time"));
                sd.Starting_Structure = Format.fmtString(results.getObject("Starting_Structure"));
                sd.Bastion_Type = Format.fmtString(results.getObject("Bastion_Type"));
                sd.web_user_id = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
            } else {
                sd.errorMsg = "Player Not Found.";
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.player.DbMods.getById(): " + e.getMessage();
        }
        return sd;
    } // getById

}