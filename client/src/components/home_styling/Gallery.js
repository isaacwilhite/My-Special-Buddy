import { Carousel } from 'react-bootstrap';
import pic1 from "./images/IMG_4742.jpg"
import pic2 from "./images/bre.png"
import pic3 from "./images/IMG_1576.jpg"
import pic4 from "./images/brreya.png"
import pic5 from "./images/IMG_0361.jpg"
import pic6 from "./images/1.png"
const Gallery = () => {
    const imageList = [
        { src: pic1, alt: "pic1" },
        { src: pic2, alt: "pic2" },
        { src: pic3, alt: "pic3" },
        { src: pic4, alt: "pic4" },
        { src: pic5, alt: "pic5" },
        { src: pic6, alt: "pic6" }
    ]
    return (
        <>
        <h1 style={{ color: '#4A90E2', fontSize: '32px', textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
        Our Buddies And Their Best Friends
        </h1>
        <Carousel>
        {imageList.map((image, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block carousel-img"
                        src={image.src}
                        alt={image.alt}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
        </>
    );
};

export default Gallery