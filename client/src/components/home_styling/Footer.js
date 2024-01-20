import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start">
            <Container>
                <a href="https://www.instagram.com/myspecialbuddiess/" className="icon-link" aria-label="Instagram">
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://www.facebook.com/groups/2758011841018693" className="icon-link" aria-label="Facebook">
                    <FontAwesomeIcon icon={faFacebook} />
                </a>
            </Container>
        </footer>
    );
};
export default Footer