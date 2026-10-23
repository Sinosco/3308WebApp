package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import model.webUser.*;
import dbUtils.*;

public class WebUserView {

    public static StringDataList getAllUsers(DbConn dbc) {

        // sdl will be an empty array and DbError with "" 
        StringDataList sdl = new StringDataList(); 

        sdl.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
        if (sdl.dbError.length() > 0) {
            return sdl; // cannot proceed, db error (and that's been recorded in return object).
        }
        
        // sd will have all of it's fields initialized to ""
        StringData sd = new StringData();
        
        try {
            String sql = "SELECT web_user_id, user_email, user_password, user_image, membership_fee, birthday, "
                    + "web_user.user_role_id, user_role_type "
                    + "FROM web_user LEFT JOIN user_role ON web_user.user_role_id = user_role.user_role_id "
                    + "ORDER BY web_user_id ";  // always order by something, not just random order.
            
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {
                
                sd = new StringData();
                
                // the Format methods do not throw exceptions. If they find illegal data (like you 
                // tried to format a date as an integer), they return an error message (instead of 
                // returning the formatted value). So, you'll see these error messages right in the 
                // API output (JSON data) and/or you'll see it on the page in the UI.

                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                sd.userPassword = Format.fmtString(results.getObject("user_password"));
                sd.userImage = Format.fmtString(results.getObject("user_image"));
                sd.birthday = Format.fmtDate(results.getObject("birthday"));
                sd.membershipFee = Format.fmtDollar(results.getObject("membership_fee"));
                sd.userRoleId = Format.fmtInteger(results.getObject("web_user.user_role_id"));
                sd.userRoleType = Format.fmtString(results.getObject("user_role_type"));
                sdl.add(sd);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in WebUserView.getAllUsers(): " + e.getMessage();
            sdl.add(sd);    
        }
        return sdl;
    }

public static StringData login(DbConn dbc, String userEmail, String userPassword) {
 
        // sd will have all of its fields initialized to ""
        StringData sd = new StringData();
 
        try {
            // Same SELECT/JOIN as getAllUsers, but WHERE instead of ORDER BY.
            String sql = "SELECT web_user_id, user_email, user_password, user_image, membership_fee, birthday, "
                    + "web_user.user_role_id, user_role_type "
                    + "FROM web_user LEFT JOIN user_role ON web_user.user_role_id = user_role.user_role_id "
                    + "WHERE user_email = ? AND user_password = ?";
 
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            stmt.setString(1, userEmail);      // fills in the first ?
            stmt.setString(2, userPassword);   // fills in the second ?
            ResultSet results = stmt.executeQuery();
 
            if (results.next()) {   // a matching row was found
 
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                sd.userPassword = Format.fmtString(results.getObject("user_password"));
                sd.userImage = Format.fmtString(results.getObject("user_image"));
                sd.birthday = Format.fmtDate(results.getObject("birthday"));
                sd.membershipFee = Format.fmtDollar(results.getObject("membership_fee"));
                sd.userRoleId = Format.fmtInteger(results.getObject("web_user.user_role_id"));
                sd.userRoleType = Format.fmtString(results.getObject("user_role_type"));
 
            } else {
                sd.errorMsg = "Credentials not found.";
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in WebUserView.login(): " + e.getMessage();
        }
        return sd;
    }

}
