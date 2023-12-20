import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

const MyNavbar = () => {
    const navigate = useNavigate()
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#">
                    <img src="../../images/long-ways-logo-transparent-png.png" alt="Logo" />
                </Navbar.Brand>
                <div className="ms-auto">
                    <Button variant="outline-success" onClick={() => navigate('/user_login')}>User Login</Button>
                    <Button variant="outline-success" onClick={() => navigate('/user_signup')}>User Sign Up</Button>
                    <Button variant="outline-success" onClick={() => navigate('/volunteer_login')}>I am a Buddy</Button>
                    <Button variant="outline-success" onClick={() => navigate('/volunteer_signup')}>I want to be a Buddy!</Button>
                </div>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
