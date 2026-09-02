package com.ahmed_web;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class Controller {
    @GetMapping("hello")
    public String helloController() {
        return "<h1>Shaikh J Ahmed tup53806 from CIS3808 Lec:TTR Lab:F doing a minecraft website for some reason</h1>";
    }
    
}
