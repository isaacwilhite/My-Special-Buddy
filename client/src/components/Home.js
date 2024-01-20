
import MyNavbar from './home_styling/MyNavbar';
import Gallery from './home_styling/Gallery';
import PictureWithText from './home_styling/PictureWithText'
import AboutSection from './home_styling/AboutSection';
import Footer from './home_styling/Footer';

const Home = () => {
  return (
    <div>
      <MyNavbar />
      <PictureWithText />
      <Gallery />
      <AboutSection />
      <Footer />
    </div>
  )
}

export default Home;