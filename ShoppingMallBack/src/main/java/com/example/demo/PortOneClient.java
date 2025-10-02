package com.example.demo.portone;

import com.example.demo.model.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * PortOne REST API 연동 클라이언트
 * - 토큰 발급
 * - 결제 상세 조회
 */
@Slf4j
@Component
public class PortOneClient {

    private final RestTemplate restTemplate = new RestTemplate();

    // ⚠️ PortOne 발급 API 키/시크릿 (application.yml에 등록)
    @Value("${portone.api.key}")
    private String apiKey;

    @Value("${portone.api.secret}")
    private String apiSecret;

    private static final String BASE_URL = "https://api.iamport.kr";

    /**
     * 액세스 토큰 발급
     */
    public String getAccessToken() {
        String url = BASE_URL + "/users/getToken";

        Map<String, String> body = Map.of(
                "imp_key", apiKey,
                "imp_secret", apiSecret
        );

        Map response = restTemplate.postForObject(url, body, Map.class);
        Map responseData = (Map) response.get("response");
        String token = (String) responseData.get("access_token");

        log.info("PortOne AccessToken 발급 성공");
        return token;
    }

    /**
     * 결제 상세 조회
     * - impUid 기반으로 PortOne에서 최신 결제정보 가져오기
     */
    public Payment getPaymentDetail(String token, String impUid) {
        String url = BASE_URL + "/payments/" + impUid;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        Map data = (Map) response.getBody().get("response");

        // PortOne 응답을 Payment 엔티티로 변환
        Payment payment = new Payment();
        payment.setPay_imp_uid((String) data.get("imp_uid"));
        payment.setPay_merchant_uid((String) data.get("merchant_uid"));
        payment.setPay_status((String) data.get("status"));
        payment.setPay_paid_amount(((Number) data.get("amount")).longValue());
        payment.setPay_pg_tid((String) data.get("pg_tid"));
        payment.setPay_receipt_url((String) data.get("receipt_url"));
        payment.setPay_method((String) data.get("pay_method"));
        payment.setPg_provider((String) data.get("pg_provider"));
        payment.setPg_type("payment");
        payment.setApply_num((String) data.get("apply_num"));
        payment.setCard_name((String) data.get("card_name"));
        payment.setCard_number((String) data.get("card_number"));
        payment.setBank_name((String) data.get("bank_name"));
        payment.setSuccess(true);

        log.info("PortOne 상세조회 성공: imp_uid={}", payment.getPay_imp_uid());
        return payment;
    }
}
