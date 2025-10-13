//package com.example.demo.service;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//@Service
//@RequiredArgsConstructor
//public class ShopApiService {
//
//    private final RestTemplate restTemplate;
//
//    @Value("${naver.api.client-id}")
//    private String clientId;
//
//    @Value("${naver.api.client-secret}")
//    private String clientSecret;
//
//    @Value("${naver.api.url}")
//    private String apiUrl; // https://openapi.naver.com/v1/search/shop.json
//
//    public String search(String query) {
//        String url = apiUrl + "?query=" + query;
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("X-Naver-Client-Id", clientId);
//        headers.set("X-Naver-Client-Secret", clientSecret);
//
//        HttpEntity<Void> entity = new HttpEntity<>(headers);
//
//        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
//    }
//}
