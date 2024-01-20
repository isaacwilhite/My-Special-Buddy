import React from 'react';
import './PictureWithTextOverlay.css';
import friendship from './images/friendship.jpeg'

const PictureWithText = () => {

    return (
        <div className="picture-with-text">
            <img src={friendship} alt="background pic" className="background-image" />
            <div className="overlay-text">
                <p style={{ fontWeight: 'bold' }}>Connect with compatible individuals and explore a variety of friendships.</p>
                <h1 style={{ fontWeight: 'bold' }}>Join the cause to improve the well-being of Special Needs individuals!</h1>
            </div>
        </div>
    );
};
export default PictureWithText