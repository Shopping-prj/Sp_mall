package com.example.demo.controller.admin;

import com.example.demo.model.Member;
import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminMemberController
 * -----------------------------------------------------
 * 관리자 전용 회원 관리 컨트롤러 (email 기반)
 * - 전체 회원 목록 조회
 * - 특정 회원 상세 조회 (email 기준)
 * - 회원 정보 수정 (주소 등)
 * - 회원 삭제 (email 기준)
 * - 관리자에 의한 회원 강제 등록
 * -----------------------------------------------------
 */
@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final MemberService memberService;

    /**
     * 전체 회원 조회
     * - 관리자 권한 필요
     * - 모든 회원의 목록을 반환
     * @return 전체 회원 리스트
     */
    @GetMapping
    public ResponseEntity<List<Member>> getAllMember() {
        return ResponseEntity.ok(memberService.getAll());
    }

    /**
     * 특정 회원 상세 조회
     * - 회원 email로 단일 회원 조회
     * @param email 회원 email
     * @return 해당 회원 객체
     */
    @GetMapping("/{email}")
    public ResponseEntity<Member> getMemberByEmail(@PathVariable String email) {
        return ResponseEntity.ok(memberService.getByEmail(email));
    }

    /**
     * 회원 정보 수정
     * - 현재 예시는 주소(m_address) 수정만 처리
     * - 필요 시 권한, 비밀번호 등 확장 가능
     * @param email 회원 email
     * @param updated 수정할 회원 데이터 (Member 객체)
     * @return 상태코드 204 (No Content)
     */
    @PatchMapping("/{email}")
    public ResponseEntity<Void> updateMember(@PathVariable String email, @RequestBody Member updated) {
        memberService.updateAddressByEmail(email, updated.getM_address());
        return ResponseEntity.noContent().build();
    }

    /**
     * 회원 삭제
     * - 회원 email 기준 삭제
     * - 관련된 cart, orders 등은 FK 제약에 따라 cascade 동작 가능
     * @param email 회원 email
     * @return 상태코드 204 (No Content)
     */
    @DeleteMapping("/{email}")
    public ResponseEntity<Void> delete(@PathVariable String email) {
        memberService.deleteByEmail(email);
        return ResponseEntity.noContent().build();
    }

    /**
     * 관리자에 의한 회원 강제 등록
     * - 일반 회원가입이 아닌 관리자가 직접 DB에 추가
     * - 기본 권한, 장바구니 생성 로직은 service.register()에서 처리
     * @param req Member 객체 (필수값: email, address, password 등)
     * @return 생성된 회원 PK (m_no)
     */
    @PostMapping("/add")
    public ResponseEntity<Long> addMember(@RequestBody Member req) {
        Long id = memberService.register(req);
        return ResponseEntity.ok(id);
    }
}
