package com.example.demo.controller;

import com.example.demo.model.Member;
import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/members")
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

    @GetMapping
    public ResponseEntity<Member> getByEmail(@RequestParam(required = false) String email) {
        if (email != null) {
            return ResponseEntity.ok(service.getByEmail(email));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member req) {
        try {
            Member m = service.login(req.getM_email(), req.getM_password());
            return ResponseEntity.ok(m);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Member>> getAllMember() {
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/address")
    public ResponseEntity<Void> updateAddress(@PathVariable Long id, @RequestBody String address)    {
        service.updateAddress(id, address);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
