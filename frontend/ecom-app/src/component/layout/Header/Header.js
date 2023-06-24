import React from 'react';
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png"
// import "overlay-navbar/ReactNavbar.min.css";

const Header = () => {
  return (
    <ReactNavbar 
    // burgerColor = "#eb4034"
    burgerColorHover = "#a62d24"
    logo = {logo}
    logoWidth = "20vmax"
    navColor1 = "rbga(0,0,0,0.4)"
    logoHoverColor = "10px"
    logoHoverSize = "#eb4034"
    link1Text = "Home"
    link2Text = "Product"
    link3Text = "Contact"
    link4Text = "About"
    link1Url = "/" 
    link2Url = "/product"
    link3Url = "/contact"
    link4Url = "/about"
    linl1Size = "1.3vmax"
    link1Color = "rbga(35,35,35,0.8)"
    nav1justifyContent = "flex-end"
    nav2justifyContent = "flex-end"
    nav3justifyContent = "flex-start"
    nav4justifyContent = "flex-start"
    link1ColorHOver = "#eb4034"
    // link2ColorHOver = "#eb4034"
    // link3ColorHOver = "#eb4034"
    // link4ColorHOver = "#eb4034"
    link1Margin = "1vmax"
    // link3Margin = "0vmax"
    // link4Margin = "1vmax"
    profileIconColor = "rgba(35,35,35,0.8)"
    cartIconColor = "rgba(35,35,35,0.8)"
    searchIconColor = "rgba(35,35,35,0.8)"
    searchIconColorHover = "#eb4034"
    profileIconColorHover = "#eb4034"
    cartIconColorHover = "#eb4034"
    cartIconMargin = "1vmax"
    />
  )
}

export default Header