package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import model.player.*;
import dbUtils.*;

public class playerView {

    public static StringDataList getAllPlayers(DbConn dbc) {

        // sdl will be an empty array and DbError with ""
        StringDataList sdl = new StringDataList();

        sdl.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
        if (sdl.dbError.length() > 0) {
            return sdl; // cannot proceed, db error (and that's been recorded in return object).
        }

        StringData sd = new StringData();

        try {
            // Note the trailing spaces so the SQL pieces don't run together.
            String sql = "SELECT Player_id, Player_Username, Player_Skin, Nether_Enter_Time, "
                    + "Stronghold_Enter_Time, Final_Time, Starting_Structure, Bastion_Type, web_user_id "
                    + "FROM Player_Info "
                    + "ORDER BY Player_id ";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {

                sd = new StringData();

                sd.Player_id =              Format.fmtInteger(results.getObject("Player_id"));
                sd.Player_Username =        Format.fmtString (results.getObject("Player_Username"));
                sd.Player_Skin =            Format.fmtString (results.getObject("Player_Skin"));
                sd.Nether_Enter_Time =      Format.fmtTime   (results.getObject("Nether_Enter_Time"));
                sd.Stronghold_Enter_Time =  Format.fmtTime   (results.getObject("Stronghold_Enter_Time"));
                sd.Final_Time =             Format.fmtTime   (results.getObject("Final_Time"));
                sd.Starting_Structure =     Format.fmtString (results.getObject("Starting_Structure"));
                sd.BastionType =            Format.fmtString (results.getObject("Bastion_Type"));
                sd.web_user_id =            Format.fmtInteger(results.getObject("web_user_id"));
                sdl.add(sd);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in PlayerView.getAllPlayers(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}