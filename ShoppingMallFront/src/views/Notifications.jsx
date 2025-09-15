import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Modal,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notifications() {
  const [showModal, setShowModal] = useState(false);

  // 토스트 알림 띄우기
  const notify = (position) => {
    toast.info(
      <div>
        Welcome to <b>Material Kit Dashboard React</b> – a React 18 compatible
        notification system.
      </div>,
      {
        position, // e.g. "top-right", "bottom-left"
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: "🔔",
      }
    );
  };

  return (
    <>
      <Container fluid>
        <Card>
          <Card.Header>
            <Card.Title as="h4">Notifications</Card.Title>
            <p className="card-category">
              `react-toastify`를 사용해 React 18에서도 호환되도록 수정했습니다.
            </p>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md="6">
                <h5>
                  <small>Notifications Style</small>
                </h5>
                <Alert variant="info">
                  <span>This is a plain notification</span>
                </Alert>
                <Alert variant="success" dismissible>
                  <span>This is a notification with close button.</span>
                </Alert>
              </Col>

              <Col md="6">
                <h5>
                  <small>Notification States</small>
                </h5>
                <Alert variant="primary">Primary alert</Alert>
                <Alert variant="info">Info alert</Alert>
                <Alert variant="success">Success alert</Alert>
                <Alert variant="warning">Warning alert</Alert>
                <Alert variant="danger">Danger alert</Alert>
              </Col>
            </Row>

            <div className="places-buttons mt-4">
              <Row>
                <Col className="offset-md-3 text-center" md="6">
                  <Card.Title as="h4">Notifications Places</Card.Title>
                  <p className="card-category">
                    <small>Click to view notifications</small>
                  </p>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col lg="3" md="3">
                  <Button block onClick={() => notify("top-left")}>
                    Top Left
                  </Button>
                </Col>
                <Col lg="3" md="3">
                  <Button block onClick={() => notify("top-center")}>
                    Top Center
                  </Button>
                </Col>
                <Col lg="3" md="3">
                  <Button block onClick={() => notify("top-right")}>
                    Top Right
                  </Button>
                </Col>
              </Row>
              <Row className="justify-content-center mt-2">
                <Col lg="3" md="3">
                  <Button block onClick={() => notify("bottom-left")}>
                    Bottom Left
                  </Button>
                </Col>
                <Col lg="3" md="3">
                  <Button block onClick={() => notify("bottom-center")}>
                    Bottom Center
                  </Button>
                </Col>
                <Col lg="3" md="3">
                  <Button block onClick={() => notify("bottom-right")}>
                    Bottom Right
                  </Button>
                </Col>
              </Row>
            </div>

            <Row className="mt-4">
              <Col className="text-center" md="12">
                <h4 className="title">Modal</h4>
                <Button
                  className="btn-fill btn-wd"
                  variant="info"
                  onClick={() => setShowModal(true)}
                >
                  Launch Modal Mini
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Mini Modal */}
        <Modal
          className="modal-mini modal-primary"
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header className="justify-content-center">
            <div className="modal-profile">
              <i className="nc-icon nc-bulb-63"></i>
            </div>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>Always have an access to your profile</p>
          </Modal.Body>
          <div className="modal-footer">
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={() => setShowModal(false)}
            >
              Back
            </Button>
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      </Container>

      {/* Toast Container (전역 위치) */}
      <ToastContainer />
    </>
  );
}

export default Notifications;
