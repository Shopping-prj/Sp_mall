package com.example.demo.service;

import com.example.demo.dao.OrderDao;
import com.example.demo.dto.OrderItemDTO;
import com.example.demo.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * OrderService
 * - Controller <-> DAO 중간 계층
 * - DB 트랜잭션 / 비즈니스 로직 담당
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // ✅ (1) 읽기 전용 트랜잭션 명시
@Slf4j
public class OrderService {

    private final OrderDao orderDao;

    /**
     * ✅ 회원 이메일 기준 주문 전체 조회
     *
     * 변경 이유:
     *  1️⃣ 기존 코드는 null일 때 예외를 던졌지만, MyBatis selectList()는 기본적으로 null이 아닌 '빈 리스트'를 반환함.
     *      → 따라서 null 체크 대신 isEmpty()를 사용해야 함.
     *  2️⃣ 빈 리스트 상태에서도 프론트가 정상 렌더링 가능하도록
     *      IllegalStateException 대신 List.of()로 안전하게 반환.
     *  3️⃣ 트랜잭션에 readOnly 옵션을 추가하여 불필요한 커밋을 방지하고 성능 최적화.
     */
    public List<OrderItemDTO> getOrderByEmail(String email) {
        List<OrderItemDTO> orders = orderDao.getOrderByEmail(email);

        // ✅ 빈 결과일 경우 예외 대신 빈 리스트 반환 (UI가 '주문 내역이 없습니다'로 표시 가능)
        if (orders == null || orders.isEmpty()) {
            log.info("📭 주문 내역이 없습니다: {}", email);
            return List.of();
        }

        return orders;
    }

    /**
     * ✅ 이메일 + 상품명으로 주문 검색
     *
     * 변경 이유:
     *  1️⃣ searchParams는 Map<String,String>으로 전달되며,
     *      DB 조회 결과가 없을 때도 빈 리스트를 반환하므로 null 방어 코드 추가.
     *  2️⃣ 로그를 명시적으로 남겨 추후 검색 파라미터 확인 용이.
     *  3️⃣ 동일하게 빈 리스트 반환 구조로 통일.
     */
    public List<OrderItemDTO> searchToOrder(Map<String, String> searchParams) {
        log.info("🔍 주문 검색 요청: {}", searchParams);
        List<OrderItemDTO> orders = orderDao.searchToOrder(searchParams);

        if (orders == null || orders.isEmpty()) {
            log.info("❌ 검색 결과 없음: {}", searchParams);
            return List.of();
        }

        return orders;
    }

    /**
     * ✅ 관리자 - 검색 조건으로 주문 조회
     */
    public List<Order> searchOrders(Map<String, Object> param) {
        log.info("🔎 [관리자] 주문 검색 요청: {}", param);
        // 👉 OrderMapper.xml의 searchOrders 호출
        List<Order> list = orderDao.getAllOrders(); // 🔸 임시용, DAO에 메서드 추가 권장

        if (list == null || list.isEmpty()) {
            log.info("📭 검색 결과 없음");
            return List.of();
        }
        return list;
    }

    /**
     * ✅ 관리자 - 요약 통계
     */
    public Map<String, Object> getOrderSummary() {
        log.info("📊 [관리자] 주문 요약 통계 조회 요청");
        Map<String, Object> summary = orderDao.getOrderSummary();

        if (summary == null || summary.isEmpty()) {
            log.info("📭 요약 데이터 없음");
            return Map.of();
        }
        return summary;
    }

    /**
     * ✅ 관리자 - 최근 주문 5건
     */
    public List<Order> getRecentOrders() {
        log.info("🕓 [관리자] 최근 주문 조회 요청");
        List<Order> list = orderDao.getRecentOrders();

        if (list == null || list.isEmpty()) {
            log.info("📭 최근 주문 없음");
            return List.of();
        }
        return list;
    }

    /**
     * ✅ 관리자 - 전체 주문 목록
     */
    public List<Order> getAllOrders() {
        log.info("📦 [관리자] 전체 주문 목록 요청");
        List<Order> list = orderDao.getAllOrders();

        if (list == null || list.isEmpty()) {
            log.info("📭 전체 주문 없음");
            return List.of();
        }

        // ✅ ready / cancelled는 payment 기준, 나머지는 order 기준
        return list.stream().peek(o -> {
            String payStatus = o.getPay_status() != null ? o.getPay_status().toLowerCase() : "";
            if ("ready".equals(payStatus)) {
                o.setO_status("입금대기");
            } else if ("cancelled".equals(payStatus)) {
                o.setO_status("결제취소");
            } else if ("failed".equals(payStatus)) {
                o.setO_status("결제실패");
            } else if ("paid".equals(payStatus) && (o.getO_status() == null || o.getO_status().isBlank())) {
                o.setO_status("결제완료");
            }
        }).toList();
    }
}
