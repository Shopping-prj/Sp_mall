import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const OrderList = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return <p className="text-muted text-center">주문 내역이 없습니다.</p>;
  }

  console.log("🧩 OrderList items:", items);

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {items.map((order, index) => (
        <Col key={index}>
          <Card
            className="h-100 border-0"
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0,0,0,0.2)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                height: "180px",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <img
                src={order.o_image}
                alt={order.o_title}
                style={{
                  maxHeight: "160px",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            <Card.Body>
              <Card.Title
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  marginBottom: "0.4rem",
                  minHeight: "40px",
                }}
              >
                {order.o_title}
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: "0.85rem",
                  color: "#6c757d",
                  lineHeight: "1.4",
                }}
              >
                {(() => {
                  const count = Number(order.oi_count ?? 0);
                  const unit  = Number(order.o_lprice ?? 0); // 개당 가격
                  const total = unit * count;                // 합계 = 수량 × 단가
                  return (
                    <>
                      수량: {count.toLocaleString()}개 <br />
                      단가: {unit.toLocaleString()}원 <br />
                      금액: <strong>{total.toLocaleString()}원</strong>
                    </>
                  );
                })()}
              </Card.Text>
              <Card.Text
                style={{
                  fontSize: "0.8rem",
                  color: "#495057",
                  backgroundColor: "#f8f9fa",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  display: "inline-block",
                }}
              >
                상태: {order.mp_order} / {order.o_status}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default OrderList;
