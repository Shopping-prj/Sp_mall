package com.example.demo.dao;

import com.example.demo.model.PurchaseCancel;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PurchaseCancelDao {
    private final SqlSessionTemplate sqlSession;
    private static final String NS = "com.example.demo.dao.PCancelMapper.";

    public int insert(PurchaseCancel cancel) {
        return sqlSession.insert(NS + "insert", cancel);
    }

    public PurchaseCancel getByImpUid(String impUid) {
        return sqlSession.selectOne(NS + "getByImpUid", impUid);
    }

    public List<PurchaseCancel> getAllCancel() {
        return sqlSession.selectList(NS + "getAllCancel");
    }

    public int deleteByImpUid(String impUid) {
        return sqlSession.delete(NS + "deleteByImpUid", impUid);
    }
}
