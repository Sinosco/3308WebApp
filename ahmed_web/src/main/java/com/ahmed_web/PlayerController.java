package com.ahmed_web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.player.*;
import dbUtils.*;
import view.playerView;

@RestController //TODO check
public class PlayerController {

    @RequestMapping(value = "/Player_Info/getAll", produces = "application/json")
    public String allPlayers() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = playerView.getAllPlayers(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }

    // Insert API: receives one Player_Info StringData object (as JSON in the URL parameter 
    // jsonData) and returns a StringData object full of field level and record level 
    // error messages (all "" if the insert worked). 
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
}
