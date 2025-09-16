import React, { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Container,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 상품 추가
  const addToCart = (item) => {
    setCart([...cart, item]);
    toast.success(`${item.name} 장바구니에 담겼습니다.`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // 상품 삭제
  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    toast.info("상품이 장바구니에서 제거되었습니다.", {
      position: "bottom-right",
      autoClose: 1500,
    });
  };

  // 총합
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <Container fluid>
        <Card>
          <Card.Header>
            <Card.Title as="h4">장바구니</Card.Title>
            <p className="card-category">React + react-bootstrap + react-toastify</p>
          </Card.Header>

          <Card.Body>
            {/* 상품 버튼 (예시) */}
            <Row>
              <Col md="6">
                <Button
                  variant="primary"
                  onClick={() => addToCart({ name: "상품 A", price: 10000 })}
                  className="mr-2"
                >
                  상품 A 담기
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => addToCart({ name: "상품 B", price: 20000 })}
                >
                  상품 B 담기
                </Button>
              </Col>

              {/* 장바구니 보기 버튼 */}
              <Col md="6" className="text-right">
                <Button variant="info" onClick={() => setShowModal(true)}>
                  장바구니 보기 ({cart.length})
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 모달: 장바구니 목록 */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>내 장바구니</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cart.length === 0 ? (
              <p>장바구니가 비어 있습니다.</p>
            ) : (
              <ListGroup>
                {cart.map((item, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {item.name} - {item.price.toLocaleString()}원
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => removeFromCart(idx)}
                    >
                      삭제
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            <h5 className="mt-3">총합: {total.toLocaleString()}원</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              닫기
            </Button>
            <Button
              variant="success"
              onClick={() => {
                toast.success("결제가 진행됩니다...");
                setShowModal(false);
              }}
            >
              결제하기
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      {/* 토스트 전역 영역 */}
      <ToastContainer />
    </>
  );
}

export default Cart;
