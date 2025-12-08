import React from "react";
import "./Header.css";
import { images } from "../../assets/images.js";

const Header = () => {
  return (
    <div className="header" style={{backgroundImage: `url(${images.header_img})`}}>
      <div className="header-contents">
        <h2>Order your food here</h2>
        <p>
          Choose from a diverse menu featuring a detectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
