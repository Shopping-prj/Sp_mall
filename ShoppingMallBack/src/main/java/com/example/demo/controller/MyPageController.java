package com.example.demo.controller;

import com.example.demo.model.MyPage;
import com.example.demo.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService service;

    @PostMapping
    public ResponseEntity<Long> register(@RequestBody MyPage req) {
        return ResponseEntity.ok(service.register(req));
    }

    @GetMapping("/{email}")
    public ResponseEntity<List<Map>> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.getByEmail(email));
    }

}
