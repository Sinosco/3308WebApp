package com.ahmed_web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.player.*;
import dbUtils.*;
import view.playerView;

@RestController
public class PlayerController {

    @RequestMapping(value = "/Player_Info/getAll", produces = "application/json")
    public String allPlayers() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = playerView.getAllPlayers(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list);
    }

    @GetMapping(value = "/Player_Info/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No speedrun data was provided in JSON format";
        } else {
            System.out.println("speedrun data for insert (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("speedrun data for insert (java obj): " + insertData.toString());

                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr(); // "" unless there is a db connection error
                if (errorMsgs.errorMsg.length() == 0) { // db connection OK
                    errorMsgs = DbMods.insert(insertData, dbc);
                }
                dbc.close(); // EVERY code path that opens a db connection must close it
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.player.StringData obj: " +
                        jsonInsertData + " - or other error in controller for 'Player_Info/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorMsgs);
    }

    // Returns one Player_Info record (as JSON) so the client can pre-fill the update UI.
    @GetMapping(value = "/Player_Info/getById", params = { "playerId" }, produces = "application/json")
    public String getById(@RequestParam("playerId") String playerId) {

        StringData sd = new StringData();
        if (playerId == null) {
            sd.errorMsg = "Error: URL must be Player_Info/getById?playerId=xx " +
                    "where xx is the Player_id of the desired speedrun record.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr(); // "" unless there is a db connection error
            if (sd.errorMsg.length() == 0) { // db connection OK
                sd = DbMods.getById(dbc, playerId);
            }
            dbc.close(); // EVERY code path that opens a db connection must close it
        }
        return Json.toJson(sd);
    }

    @GetMapping(value = "/Player_Info/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonUpdateData) {

        StringData errorData = new StringData();

        if ((jsonUpdateData == null) || jsonUpdateData.length() == 0) {
            errorData.errorMsg = "Cannot update. No speedrun data was provided in JSON format";
        } else {
            System.out.println("speedrun data for update (JSON): " + jsonUpdateData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonUpdateData, StringData.class);
                System.out.println("speedrun data for update (java obj): " + updateData.toString());

                DbConn dbc = new DbConn();
                errorData.errorMsg = dbc.getErr(); // "" unless there is a db connection error
                if (errorData.errorMsg.length() == 0) { // db connection OK
                    errorData = DbMods.update(updateData, dbc);
                }
                dbc.close(); // EVERY code path that opens a db connection must close it
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.player.StringData obj: " +
                        jsonUpdateData + " - or other error in controller for 'Player_Info/update': " +
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorData);
    }
}