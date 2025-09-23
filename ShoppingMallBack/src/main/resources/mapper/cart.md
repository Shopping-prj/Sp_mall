<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.demo.dao.CartMapper">

    <!-- ==================== Cart ==================== -->

    <!-- 새로운 Cart 생성: AUTO_INCREMENT 키를 Cart.c_no에 바인딩 -->
    <!-- 🔧 변경: useGeneratedKeys 적용 확인 및 keyProperty="c_no" 지정 -->
    <insert id="insertCart" parameterType="com.example.demo.model.Cart"
            useGeneratedKeys="true" keyProperty="c_no">
        INSERT INTO cart (c_email, created_at)
        VALUES (#{c_email}, NOW())
    </insert>

    <!-- 이메일로 Cart 조회 -->
    <select id="getCartByEmail" parameterType="string" resultType="com.example.demo.model.Cart">
        SELECT * FROM cart WHERE c_email = #{email}
    </select>

    <!-- ==================== CartItem ==================== -->

    <!-- CartItem 추가 -->
    <insert id="insertCartItem" parameterType="com.example.demo.model.CartItem"
            useGeneratedKeys="true" keyProperty="ci_no">
        INSERT INTO cart_item (c_no, c_productId, c_count)
        VALUES (#{c_no}, #{c_productId}, #{c_count})
    </insert>

    <!-- 특정 Cart + 상품 조회 (존재 여부 체크용) -->
    <select id="getCartItem" resultType="com.example.demo.model.CartItem">
        SELECT * FROM cart_item
        WHERE c_no = #{c_no} AND c_productId = #{c_productId}
    </select>

    <!-- 🔧 변경: 프론트 렌더링을 위해 Product 정보를 함께 반환 -->
    <!-- 특정 Cart 안의 모든 아이템 + 상품 정보 -->
    <select id="getCartItemsWithProduct" parameterType="long" resultType="com.example.demo.dto.CartItemDTO">
        SELECT
        ci.ci_no,
        ci.c_no,
        ci.c_productId,
        ci.c_count,
        p.p_title,
        p.p_lprice,
        p.p_image
        FROM cart_item ci
        JOIN product p ON p.p_productId = ci.c_productId
        WHERE ci.c_no = #{c_no}
        ORDER BY ci.ci_no DESC
    </select>

    <!-- 특정 상품 수량 증가 -->
    <update id="increaseCount">
        UPDATE cart_item
        SET c_count = c_count + #{c_count}
        WHERE c_no = #{c_no} AND c_productId = #{c_productId}
    </update>

    <!-- 특정 CartItem 수량 변경 -->
    <update id="updateCount" parameterType="com.example.demo.model.CartItem">
        UPDATE cart_item
        SET c_count = #{c_count}
        WHERE ci_no = #{ci_no}
    </update>

    <!-- 특정 CartItem 삭제 -->
    <delete id="deleteCartItem" parameterType="long">
        DELETE FROM cart_item WHERE ci_no = #{value}
    </delete>

    <!-- 회원 Cart 전체 삭제 (Cart 삭제 시 Item도 Cascade) -->
    <delete id="deleteCartByEmail" parameterType="string">
        DELETE FROM cart WHERE c_email = #{value}
    </delete>

</mapper>
