package com.example.demo.controller;

import com.example.demo.model.Member;
import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService service;

    @PostMapping
    public ResponseEntity<Long> register(@RequestBody Member req) {
        return ResponseEntity.ok(service.register(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/email/{email:.+}")
    public ResponseEntity<Member> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(service.getByEmail(email));
    }

    @GetMapping
    public ResponseEntity<List<Member>> getAllMember() {
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/address")
    public ResponseEntity<Void> updateAddress(@PathVariable Long id, @RequestBody String address) {
        service.updateAddress(id, address);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> updatePassword(@PathVariable Long id, @RequestBody String rawPw) {
        service.updatePassword(id, rawPw);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
