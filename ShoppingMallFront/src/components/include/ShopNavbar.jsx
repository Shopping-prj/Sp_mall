// src/components/Header.jsx
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Header = ({ title = "CosmoShop" }) => {
  const location = useLocation();

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    const node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        {/* Mobile sidebar toggle */}
        <div className="d-flex align-items-center">
          <Button
            variant="dark"
            className="d-lg-none btn-fill rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand className="ml-2">{title}</Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" navbar>
            <Nav.Item>
              <Nav.Link as={Link} to="/admin/dashboard">
                <i className="nc-icon nc-palette"></i>
                <span className="d-lg-none ml-1">Dashboard</span>
              </Nav.Link>
            </Nav.Item>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} variant="default">
                <i className="nc-icon nc-planet"></i>
                <span className="notification">5</span>
                <span className="d-lg-none ml-1">Notification</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Notification 1</Dropdown.Item>
                <Dropdown.Item>Notification 2</Dropdown.Item>
                <Dropdown.Item>Notification 3</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

          <Nav className="ml-auto" navbar>
            <Nav.Item>
              <Nav.Link as={Link} to="/account">Account</Nav.Link>
            </Nav.Item>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link}>Dropdown</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Action</Dropdown.Item>
                <Dropdown.Item>Another action</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Item>
              <Nav.Link onClick={() => console.log("Log out clicked")}>
                Log out
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
