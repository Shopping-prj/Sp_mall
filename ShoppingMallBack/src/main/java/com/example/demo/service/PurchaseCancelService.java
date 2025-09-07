package com.example.demo.service;

import com.example.demo.dao.PurchaseCancelDao;
import com.example.demo.model.PurchaseCancel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseCancelService {
    private final PurchaseCancelDao dao;

    public String register(PurchaseCancel cancel) {
        dao.insert(cancel);
        return cancel.getPc_imp_uid();
    }

    @Transactional(readOnly = true)
    public PurchaseCancel getByImpUid(String impUid) {
        return dao.getByImpUid(impUid);
    }

    @Transactional(readOnly = true)
    public List<PurchaseCancel> getAllCancel() {
        return dao.getAllCancel();
    }

    public void delete(String impUid) {
        dao.deleteByImpUid(impUid);
    }
}
