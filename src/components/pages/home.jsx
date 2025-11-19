import "../../styles.css";
import React from "react";
import Footer from "../elements/footer.jsx";
import Navbar from "../elements/navbar.jsx";
import Banner from "../elements/banner.jsx";
import Cards from "../elements/cards.jsx";
import Carousel from "../elements/carousel.jsx";
import AISuggestion from "../AISuggestions.jsx";

function Home() {
  return (
    <div>
      <Navbar />
      <Banner />
      <Cards />
      <AISuggestion />
      <Carousel />
      <Footer />
    </div>
  );
}

export default Home;
