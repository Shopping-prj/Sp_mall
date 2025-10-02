<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.dao.CartMapper">

    <!-- ==================== ResultMap ==================== -->

    <!-- CartItemDTO: cart_item + product 조인 -->
    <resultMap id="CartItemDTO" type="com.example.demo.dto.CartItemDTO">
        <id     property="ci_no"       column="ci_no"/>
        <result property="c_no"        column="c_no"/>
        <result property="c_productId" column="c_productId"/>
        <result property="c_count"     column="c_count"/>
        <!-- 상품 정보 -->
        <result property="p_title"     column="p_title"/>
        <result property="p_lprice"    column="p_lprice"/>
        <result property="p_image"     column="p_image"/>
    </resultMap>

    <!-- CartDTO: cart + items -->
    <resultMap id="CartDTO" type="com.example.demo.dto.CartDTO">
        <id     property="c_no"    column="c_no"/>
        <result property="c_email" column="c_email"/>
        <collection property="items" resultMap="CartItemDTO"/>
    </resultMap>

    <resultMap id="CartEntity" type="com.example.demo.model.Cart">
        <id property="c_no" column="c_no"/>
        <result property="c_email" column="c_email"/>
        <result property="created_at" column="created_at" jdbcType="TIMESTAMP"/>
    </resultMap>

    <resultMap id="CartItemEntity" type="com.example.demo.model.CartItem">
        <id     property="ci_no"       column="ci_no"/>
        <result property="c_no"        column="c_no"/>
        <result property="c_productId" column="c_productId"/>
        <result property="c_count"     column="c_count"/>
    </resultMap>
    <!-- ==================== Cart ==================== -->

    <!-- 회원 이메일로 CartDTO 조회 -->
    <select id="getCartByEmail" parameterType="string" resultMap="CartDTO">
        SELECT
        c.c_no, c.c_email,
        ci.ci_no, ci.c_productId, ci.c_count,
        p.p_title, p.p_lprice, p.p_image
        FROM cart c
        LEFT JOIN cart_item ci ON c.c_no = ci.c_no
        LEFT JOIN product p ON ci.c_productId = p.p_productId
        WHERE c.c_email = #{value}
    </select>

    <select id="findEmailByCart" parameterType="long" resultType="string">
        SELECT c_email FROM cart WHERE c_no = #{c_no}
    </select>

    <!-- Cart row 조회 (Entity 전용) -->
    <select id="findCartEntityByEmail" parameterType="string" resultMap="CartEntity">
        SELECT c_no, c_email, created_at
        FROM cart
        WHERE c_email = #{value}
    </select>

    <!-- Cart 생성 -->
    <insert id="insertCart" parameterType="com.example.demo.model.Cart"
            useGeneratedKeys="true" keyProperty="c_no">
        INSERT INTO cart (c_email, created_at)
        VALUES (#{c_email}, NOW())
    </insert>
    

    <!-- ==================== CartItem ==================== -->

    <!-- 특정 상품 조회 -->
    <select id="findCartItem" parameterType="map" resultMap="CartItemEntity">
        SELECT ci_no, c_no, c_productId, c_count
        FROM cart_item
        WHERE c_no = #{c_no} AND c_productId = #{c_productId}
    </select>

    <!-- CartItem 추가 -->
    <insert id="insertCartItem" parameterType="com.example.demo.model.CartItem">
        INSERT INTO cart_item (c_no, c_productId, c_count)
        VALUES (#{c_no}, #{c_productId}, #{c_count})
    </insert>

    <!-- 장바구니 아이템 수량 증가 -->
    <update id="updateCartItemCount" parameterType="map">
        UPDATE cart_item
        SET c_count = c_count + #{addCount}
        WHERE c_no = #{c_no} AND c_productId = #{c_productId}
    </update>

    <!-- CartItem 삭제 -->
    <delete id="deleteCartItem">
        DELETE FROM cart_item
        WHERE ci_no = #{ci_no}
    </delete>

    <!-- ci_no → email 역추적 -->
    <select id="findEmailByCartItem" parameterType="long" resultType="string">
        SELECT c.c_email
        FROM cart c
        JOIN cart_item ci ON c.c_no = ci.c_no
        WHERE ci.ci_no = #{ci_no}
    </select>

    <!-- 특정 회원 전체 아이템 삭제 -->
    <delete id="deleteCartItemsByEmail" parameterType="string">
        DELETE FROM cart_item
        WHERE c_no = (SELECT c_no FROM cart WHERE c_email = #{email})
    </delete>

</mapper>
