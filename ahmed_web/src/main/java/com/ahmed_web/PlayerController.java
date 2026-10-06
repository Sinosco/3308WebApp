package com.ahmed_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }
}