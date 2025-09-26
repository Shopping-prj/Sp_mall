import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#343a40',
        color: 'white',
        paddingBottom: '1rem',
        marginTop: 'auto',
      }}
    >
      <Container>
        <hr style={{ borderColor: '#555', marginTop: '2rem' }} />
        <p style={{ textAlign: 'center', margin: 0 }}>© 2025 COSMO. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;