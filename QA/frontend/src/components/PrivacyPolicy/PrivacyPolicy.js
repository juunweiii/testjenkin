import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { Pagination } from '@mui/material';
import Navigation from '../Shared/Navigation/Navigation';
import Footer from '../Shared/Footer/Footer';
import TopicListItem from '../Shared/TopicListItem/TopicListItem';
import { UserContext } from '../Shared/UserProvider/UserProvider';
import { handleApiError } from '../Shared/ErrorHandling/ErrorHandler';
import FloatingAlert from '../Shared/ErrorHandling/FloatingAlert';
import DOMPurify from 'dompurify';

import 'bootstrap/dist/css/bootstrap.css';
import './PrivacyPolicy.css';



const PrivacyPolicy = () => {
 
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);




  return (
    <>
      <Navigation />
      <FloatingAlert message={message} onClose={() => setMessage('')} />
      <div className="header-gradient"></div>
      <Container className='privacy-container'>
        <div className="page-content-background">
        <Row>
          <Col>
            <div className='title-container'>
              <h1>Privacy Policy</h1>

              <h2>Introduction</h2>
              <p>Welcome to ThreadHub. We are committed to protecting your privacy and ensuring that your personal data is handled in accordance with Singapore's Personal Data Protection Act 2012 ("PDPA"). This Privacy Policy explains how we collect, use, disclose, and protect your personal data when you use our forum and related services.</p>

              <h2>Collection of Personal Data</h2>
              <p>We may collect personal data from you in the following ways:</p>
              <ul>
                  <li>When you register for an account on our forum.</li>
                  <li>When you post content, comments, or participate in discussions.</li>
                  <li>When you subscribe to our newsletters or notifications.</li>
                  <li>When you contact us for support or inquiries.</li>
              </ul>
              <p>The types of personal data we may collect include:</p>
              <ul>
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Username</li>
                  <li>Profile information</li>
                  <li>IP address</li>
                  <li>Any other information you voluntarily provide to us</li>
              </ul>

              <h2>Use of Personal Data</h2>
              <p>We may use your personal data for the following purposes:</p>
              <ul>
                  <li>To provide and maintain our forum services.</li>
                  <li>To verify your identity and manage your account.</li>
                  <li>To communicate with you, including responding to your inquiries and sending you updates.</li>
                  <li>To improve our forum and services based on your feedback and usage.</li>
                  <li>To ensure the security and integrity of our forum.</li>
                  <li>To comply with legal obligations and resolve disputes.</li>
              </ul>

              <h2>Disclosure of Personal Data</h2>
                <p>We may disclose your personal data to the following parties:</p>
                <ul>
                    <li>Service providers who assist us in operating our forum and providing our services.</li>
                    <li>Legal authorities or regulatory bodies when required by law.</li>
                    <li>Other users of the forum to the extent necessary to facilitate communication and interaction.</li>
                </ul>
                <p>We will take reasonable steps to ensure that these parties adhere to confidentiality and data protection standards comparable to our own.</p>

                <h2>Protection of Personal Data</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. These measures include:</p>
                <ul>
                    <li>Encryption of data during transmission.</li>
                    <li>Regular security audits and assessments.</li>
                    <li>Access controls and authentication mechanisms.</li>
                    <li>Secure storage solutions.</li>
                </ul>

                <h2>Retention of Personal Data</h2>
                <p>We will retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws. When personal data is no longer needed, we will securely delete or anonymize it.</p>

                <h2>Access to and Correction of Personal Data</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access your personal data that we hold.</li>
                    <li>Correct any inaccuracies or incomplete data.</li>
                    <li>Withdraw consent to the use of your personal data.</li>
                </ul>
                <p>To exercise these rights, please contact us using the contact details provided below. We will respond to your request within a reasonable timeframe.</p>
                <h2>Contact Us</h2>
                <p>If you have any questions or concerns about this Privacy Policy or our data protection practices, please contact us at:</p>
                <p>+65 9899 2122
                <br/>20 Punggol Hill Road
                <br/>Singapore 156782</p>
            </div>
          </Col>
        </Row>

        </div>
      </Container>
      <Footer />



    </>
  );
};

export default PrivacyPolicy;
