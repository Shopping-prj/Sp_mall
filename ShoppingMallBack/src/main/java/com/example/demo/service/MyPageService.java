package com.example.demo.service;

import com.example.demo.dao.MyPageDao;
import com.example.demo.dao.PaymentDao;
import com.example.demo.model.MyPage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class MyPageService {

    private final MyPageDao myPageDao;

    public Long register(MyPage req) {return myPageDao.insert(req);}

    @Transactional(readOnly = true)
    public List<Map> getByEmail(String email) {return myPageDao.getByEmail(email);}

}
