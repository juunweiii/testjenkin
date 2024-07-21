import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import './Footer.css'

const Footer = () => {
  const logoPath = `${process.env.PUBLIC_URL}/images/footerlogo2x.png`;

  return <footer className="footer-threadhub">
    <Container>
  <Row> 
  <Col sm={5}>
      <img className="footer-logo" src={logoPath} alt="Threadhub Logo Footer"></img>
      <h3>About ThreadHub</h3>
      <p> ThreadHub is all about forming communities and fostering discussion around the hottest topics, bringing together a myriad of voices to hear and be heard!</p>
  </Col>
  
  <Col sm={3} className='footer-sub-col'>
      <h3>ThreadHub Pte Ltd</h3>
      <p>+65 9899 2122</p>
      <p>20 Punggol Hill Road</p>
      <p>Singapore 156782</p>
  </Col>
  <Col  sm={3} className='footer-sub-col'>
      <h3>Useful Links</h3>
      <ul className='footer-list'>
        <li><a href="/privacypolicy">Privacy policy</a></li>
        <li><a href="/codeofconduct">Code of Conduct</a></li>
      </ul>
  </Col>
  <p className="copyright"><em>Copyright &copy; 2023 ThreadHub Pte Ltd</em></p>
  </Row>
  </Container>
  
  
</footer>;
};

export default Footer;