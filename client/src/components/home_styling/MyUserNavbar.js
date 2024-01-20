import React, { useState } from 'react';
import { Navbar, Container, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import logo from './images/long_ways_logo_transparent.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const MyUserNavbar = () => {
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
    <Button variant="outline-success" onClick={() => navigate('/meet_volunteers')} className="mb-2">Meet Buddies</Button>
        <Button variant="outline-success" onClick={() => navigate('/chats')} className="mb-2">Messages</Button>
        <Button variant="outline-success" onClick={() => navigate('/user_edit_profile')} className="mb-2">Edit Profile</Button>
    </div>
</Offcanvas.Body>
    </Offcanvas>
    </>
    );
};

export default MyUserNavbar;
