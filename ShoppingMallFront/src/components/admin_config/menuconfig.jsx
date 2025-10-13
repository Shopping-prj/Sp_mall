// src/config/menuConfig.js

const menuConfig = {
  member: {
    title: "회원관리",
    items: [
      { label: "회원 정보관리", path: "/admin/member" },
      { label: "회원 등록", path: "/admin/member/add" },
      { label: "회원 정보수정", path: "/admin/member/update" },
      { label: "회원 삭제", path: "/admin/member/delete" },
    ],
  },
  category: {
    title: "카테고리관리",
    items: [
      { label: "카테고리 관리", path: "/admin/category/info"},
      { label: "카테고리 순위", path: "/admin/category/ranking"}
    ],
  },
  product: {
    title: "상품관리",
    items: [
      { label: "전체 상품관리", path: "/admin/product" },
      { label: "상품 정보관리", path: "/admin/product/Info" },
      { label: "상품 등록관리", path: "/admin/product/Add" },
      { label: "상품 삭제관리", path: "/admin/product/Delete" },
    ],
  },
  order: {
    title: "주문관리",
    items: [
      { label: "주문리스트(전체)", path: "/admin/order" },
      { label: "입금대기", path: "/admin/order/waiting" },
      { label: "배송준비", path: "/admin/order/ready" },
      { label: "배송중", path: "/admin/order/shipping" },
      { label: "배송완료", path: "/admin/order/done" },
      { label: "취소/교환", path: "/admin/order/cancel" },
    ],
  },
  // 필요에 따라 추가...
};

export default menuConfig;