import React, { useEffect,useState } from "react";
import veggiesbanner from "./accfiles/GoGrocers1.png"
import GoGrocers from "./accfiles/GoGrocers2.png"
import "./styles.css"
import $ from "jquery";

function Banner()
{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const imageUrl = windowWidth >= 800 ? veggiesbanner : GoGrocers;
    const [display_status_2, setdisplay_status_2] = useState(false);
    
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      setdisplay_status_2(window.innerWidth <= 600);
    };

    useEffect(() => { 
        if (display_status_2) {
            $('.cardtext').css('float', 'right');
        } else {
            $('.cardtext').css('float', 'none');
            $('.colelement').css('padding-top','25px');
            $('.colelement').css('padding-bottom','25px');
        }
      }, [display_status_2]);
    
    useEffect(() => {
      window.addEventListener('resize', handleWindowResize);
    
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      }
    }, []);
    return(
        <div>
        <section className="bannersec">
        <div className="banner" id="bannerdiv">
        <img className ="veggiesbanner" src={imageUrl} alt="veggiesbanner"></img>   
        </div>
        </section>
        </div>
    );
}
export default Banner;