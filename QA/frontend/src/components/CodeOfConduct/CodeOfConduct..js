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
import './CodeOfConduct.css';



const CodeOfConduct = () => {
 
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);




  return (
    <>
      <Navigation />
      <FloatingAlert message={message} onClose={() => setMessage('')} />
      <div className="header-gradient"></div>
      <Container className='conduct-container'>
        <div className="page-content-background">
        <Row>
          <Col>
            <div className='title-container'>
              <h1>Code Of Conduct</h1>

              <h2>Introduction</h2>
              <p>Welcome to ThreadHub! We are committed to providing a friendly, safe, and welcoming environment for all our members. This Code of Conduct outlines our expectations for participant behavior and the consequences of unacceptable behavior.</p>

              <h2>Expected Behavior</h2>
              <p>We expect all participants in our forum to:</p>
              <ul>
                  <li>Be respectful and considerate in your interactions with others.</li>
                  <li>Use inclusive language and be mindful of diverse perspectives.</li>
                  <li>Provide constructive feedback and engage in healthy discussions.</li>
                  <li>Respect the privacy of others and protect personal information.</li>
                  <li>Comply with all applicable laws and regulations.</li>
              </ul>

              <h2>Unacceptable Behavior</h2>
              <p>The following behaviors are considered unacceptable and will not be tolerated:</p>
              <ul>
                  <li>Harassment, discrimination, or abuse of any kind.</li>
                  <li>Use of offensive or inappropriate language or content.</li>
                  <li>Personal attacks, threats, or inflammatory comments.</li>
                  <li>Posting spam, advertisements, or unrelated content.</li>
                  <li>Impersonation of others or misrepresentation of your identity.</li>
                  <li>Violation of intellectual property rights.</li>
              </ul>

              <h2>Reporting and Enforcement</h2>
              <p>If you witness or experience any unacceptable behavior, please report it to our moderators immediately. We are committed to addressing all reports promptly and fairly.</p>
              
              <h2>Consequences of Unacceptable Behavior</h2>
              <p>Participants who engage in unacceptable behavior may face consequences, including:</p>
              <ul>
                  <li>Warning or temporary suspension from the forum.</li>
                  <li>Permanent ban from the forum.</li>
                  <li>Reporting to appropriate authorities if necessary.</li>
              </ul>

              <h2>Appeals</h2>
              <p>If you believe that you have been unfairly accused or penalized for a violation, you may appeal the decision by contacting our moderators at the email provided above. We will review your appeal and respond within a reasonable timeframe.</p>

              <h2>Changes to This Code of Conduct</h2>
              <p>We may update this Code of Conduct from time to time to reflect changes in our community standards or legal requirements. We will notify you of any significant changes by posting a notice on our forum or sending you an email. Your continued use of our forum after such changes constitutes your acceptance of the revised Code of Conduct.</p>

              <p>By participating in our forum, you acknowledge that you have read, understood, and agreed to abide by this Code of Conduct.</p>
            </div>
          </Col>
        </Row>

        </div>
      </Container>
      <Footer />



    </>
  );
};

export default CodeOfConduct;
