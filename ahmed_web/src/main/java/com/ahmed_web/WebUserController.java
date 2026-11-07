package com.ahmed_web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.webUser.*;
import dbUtils.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import view.WebUserView;

@RestController
public class WebUserController {

    @RequestMapping(value = "/webUser/getAll", produces = "application/json")
    public String allUsers() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = WebUserView.getAllUsers(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }

    @RequestMapping(value = "/webUser/login", params = { "userEmail", "userPassword" }, produces = "application/json")
    public String login(@RequestParam("userEmail") String userEmail,
            @RequestParam("userPassword") String userPassword,
            HttpServletRequest request) {

        StringData sd = new StringData();

        DbConn dbc = new DbConn();
        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() > 0) {
            dbc.close();
            return Json.toJson(sd);
        }

        sd = WebUserView.login(dbc, userEmail, userPassword);
        dbc.close();

        HttpSession session = request.getSession();
        if (sd.errorMsg.length() == 0) {
            session.setAttribute("loggedOnUser", sd);
        } else {
            session.invalidate();
        }

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/getProfile", produces = "application/json")
    public String getProfile(HttpServletRequest request) {

        StringData sd = new StringData();
        HttpSession session = request.getSession();

        if (session.getAttribute("loggedOnUser") != null) {
            sd = (StringData) session.getAttribute("loggedOnUser");
        } else {
            sd.errorMsg = "no user logged on";
        }

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/logoff", produces = "application/json")
    public String logoff(HttpServletRequest request) {

        StringData sd = new StringData();
        request.getSession().invalidate();
        sd.errorMsg = "user is now logged off";

        return Json.toJson(sd);
    }

    @GetMapping(value = "/webUser/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No user data was provided in JSON format";
        } else {
            System.out.println("user data for insert (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("user data for insert (java obj): " + insertData.toString());

                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr();
                if (errorMsgs.errorMsg.length() == 0) { // db connection OK
                    errorMsgs = DbMods.insert(insertData, dbc);
                }
                dbc.close();
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.webUser.StringData obj: " +
                        jsonInsertData + " - or other error in controller for 'webUser/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorMsgs);
    }

}