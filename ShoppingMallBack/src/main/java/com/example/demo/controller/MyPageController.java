package com.example.demo.controller;

import com.example.demo.dto.PaymentCancelDTO;
import com.example.demo.model.Member;

import com.example.demo.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Log4j2
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService service;

    // 1. 회원 이메일로 회원정보 조회
    @GetMapping("/{email}")
    public ResponseEntity<Member> getByEmail(@PathVariable String email) {
        log.info(email);
        return ResponseEntity.ok(service.getByEmail(email));
    }
    // 2. 회원정보 수정(주소, 이름, 페스워드만 가능)(0=실패, 1=성공)
    @PostMapping("/update")
    public ResponseEntity<Integer> updateByUser(@RequestBody Member pmember) {
        return ResponseEntity.ok(service.updateByUser(pmember));
    }
    // 3. 회원페스워드 검증(성공=성공메세지, 실패=오류를 전송)
    @PostMapping("/verification")
    public ResponseEntity<String> passwordByVerification(@RequestBody Member pmember) {
        return ResponseEntity.ok(service.passwordByVerification(pmember));
    }
    // 4. 회원탈퇴
    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteByEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.deleteByEmail(email));
    }

    // 5. 주문취소 (오류=실패, 1=성공)
    @PostMapping("/ocancel")
    public ResponseEntity<Integer> cancelByOrder(@RequestBody PaymentCancelDTO paymentCancelDTO) {
        return ResponseEntity.ok(service.cancelByOrder(paymentCancelDTO));
    }
}