package com.ahmed_web;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class Controller {
    @GetMapping("hello")
    public String helloController() {
        return "<h1>Hello World</h1>";
    }
    
}
