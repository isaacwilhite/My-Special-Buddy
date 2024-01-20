import React, { useState } from 'react';
import { Navbar, Container, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import logo from './images/long_ways_logo_transparent.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const MyNavbar = () => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Button variant="primary" onClick={handleShow}>
                    <FontAwesomeIcon icon={faBars} />
                </Button>
                <Navbar.Brand href="#" className="mx-auto">
                    <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: '500px', height: 'auto' }}/>
                </Navbar.Brand>
            </Container>
        </Navbar>
        <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
    <div className="d-flex flex-column">
    <Button variant="outline-success" onClick={() => navigate('/user_login')} className="mb-2">User Login</Button>
        <Button variant="outline-success" onClick={() => navigate('/user_signup')} className="mb-2">User Sign Up</Button>
        <Button variant="outline-success" onClick={() => navigate('/volunteer_login')} className="mb-2">I am a Buddy</Button>
        <Button variant="outline-success" onClick={() => navigate('/volunteer_signup')} className="mb-2">I want to be a Buddy!</Button>
        <Button variant="outline-success"className="mb-2">Get Pricing</Button>
    </div>
</Offcanvas.Body>
    </Offcanvas>
    </>
    );
};

export default MyNavbar;
