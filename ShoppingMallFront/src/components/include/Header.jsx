import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">XXX</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />     
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Link to="/" className='nav-link'>Home</Link>
              <Link to="/memo" className='nav-link'>메모관리</Link>
              <Link to="/schedule" className='nav-link'>일정관리</Link>
              <Link to="/cal" className='nav-link'>달력</Link>
              <Link to="/naverSearch" className='nav-link'>검색</Link>
            </Nav>
          </Navbar.Collapse>               
        </Container>
      </Navbar>    
    </>
  )
}

export default Header

/*
  npm i bootstrap

  npm i react-bootstrap
*/