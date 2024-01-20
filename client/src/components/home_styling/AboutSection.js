import { Container, Row, Col } from 'react-bootstrap';


const AboutSection = () => {
    return (
        <Container>
            <h2 style={{ color: '#0D98BA', fontSize: '32px', textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
            About Special Buddies
            </h2>
            <Row>
                <Col md={6} className="about-text">
                    <h3>What is Special Buddies?</h3>
                    <p>At Special Buddies, we are committed to creating meaningful connections by pairing individuals with special needs with compassionate and compatible friends. Our platform is a celebration of diversity and companionship, designed with the belief that everyone deserves a friend who understands and appreciates them for who they are.</p>
                    <p>We offer a curated experience where users can choose from a wide variety of potential friends, ensuring that each match is based on shared interests and compatible personalities. Our goal is to facilitate new friendships that promote mutual respect, empathy, and joy.
                    </p>
                    <p>Whether you're seeking a friend to share in everyday adventures, someone to listen, or a friend that just gets it, My Special Buddies is your go-to destination for friendships that enrich lives and break barriers. Join us in our mission to ensure that every person with special needs finds a best friend who can turn a first encounter into cherished memories.</p>
                </Col>
                <Col md={6}>
    <div className="about-image1"></div> {/* Image as background */}
</Col>
            </Row>
            <Row>
                <Col md={6}>
    <div className="about-image2"></div> {/* Image as background */}
</Col>
                <Col md={6} className="about-text">
                    <h3>Safety Is Our Top Priority</h3>
                    <p>At Special Buddies, the safety, well-being, and compatibility of our members are the cornerstones of our community. We meticulously conduct extensive safety screenings for each potential friend, which includes detailed background checks to affirm their reliability and suitability as companions. Our diverse network comprises compassionate volunteers, seasoned professionals, and specialists trained to support a spectrum of special needs. </p>
                    <p>We believe trust is the foundation of a meaningful friendship. To cultivate this, we arrange secure video calls that provide a protected and personal way for you to connect with potential friends. This crucial step helps confirm a harmonious match, giving you peace of mind before any in-person introduction. Choose Special Buddies to find new best friends.</p>
                </Col>
            </Row>
            <Row>
                <Col md={6} className="about-text">
                    <h3>What can you expect?</h3>
                    <p>1. Begin by choosing a friend who aligns with your interests.
2. Take the next step with a secure video call to establish a connection. 
3. Once you feel comfortable, you can arrange a meeting at a time and place that suits you both. </p>
                    <p>Remember, the possibilities are endless—you're not limited to just one friend. Embrace the opportunity to build an expansive network of friends on Special Buddies, where you have the freedom to make as many friends as you wish.
                    </p>
                </Col>
                <Col md={6}>
    <div className="about-image3"></div> {/* Image as background */}
</Col>
            </Row>
        </Container>
    );
};
export default AboutSection