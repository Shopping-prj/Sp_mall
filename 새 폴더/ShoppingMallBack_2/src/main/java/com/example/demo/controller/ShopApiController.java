//package com.example.demo.controller;
//
//import com.example.demo.service.ShopApiService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/shop")
//@RequiredArgsConstructor
//public class ShopApiController {
//
//    private final ShopApiService shopApiService;
//
//    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<String> search(@RequestParam String query) {
//        return ResponseEntity.ok(shopApiService.search(query));
//    }
//}
