package com.example.demo.service;

import com.example.demo.dao.PurchaseHistoryDao;
import com.example.demo.model.PurchaseHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseHistoryService {
    private final PurchaseHistoryDao dao;

    public Long register(PurchaseHistory ph) {
        dao.insert(ph);
        return ph.getPh_no();
    }

    @Transactional(readOnly = true)
    public PurchaseHistory getByNo(Long no) {
        return dao.getByNo(no);
    }

    @Transactional(readOnly = true)
    public List<PurchaseHistory> getAllPurchaseHistory() {
        return dao.getAllPurchaseHistory();
    }

    @Transactional(readOnly = true)
    public List<PurchaseHistory> getByEmail(String email) {
        return dao.getByEmail(email);
    }

    public void updateDelivery(Long no, String delivery) {
        dao.updateDelivery(no, delivery);
    }

    public void updatePayment(Long no, String payment) {
        dao.updatePayment(no, payment);
    }

    public void delete(Long no) {
        dao.deleteByNo(no);
    }
}
