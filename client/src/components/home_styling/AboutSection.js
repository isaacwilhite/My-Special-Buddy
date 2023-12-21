import { Container, Row, Col } from 'react-bootstrap';

const AboutSection = () => {
    return (
        <Container>
            <h2 style={{ color: '#0D98BA', fontSize: '32px', textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
            About Special Buddies
            </h2>
            <Row>
                <Col md={6}>
                    <h3>What is Special Buddies?</h3>
                    <p>At Special Buddies, we are committed to creating meaningful connections by pairing individuals with special needs with compassionate and compatible friends. Our platform is a celebration of diversity and companionship, designed with the belief that everyone deserves a friend who understands and appreciates them for who they are.</p>
                    <p>We offer a curated experience where users can choose from a wide variety of potential friends, ensuring that each match is based on shared interests and compatible personalities. Our goal is to facilitate new friendships that promote mutual respect, empathy, and joy.
                    </p>
                    <p>Whether you're seeking a friend to share in everyday adventures, someone to listen, or a friend that just gets it, My Special Buddies is your go-to destination for friendships that enrich lives and break barriers. Join us in our mission to ensure that every person with special needs finds a best friend who can turn a first encounter into cherished memories.</p>
                </Col>
                <Col md={6}>
                    {/* Image */}
                </Col>
            </Row>
        </Container>
    );
};
export default AboutSection