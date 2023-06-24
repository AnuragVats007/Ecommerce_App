import React from 'react'
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/Appstore.png'
import "./Footer.css"

const Footer = () => {
  return (
    <footer id='footer'>
        <div className='leftFooter'>
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <img src={playStore} alt='playStore' />
            <img src={appStore} alt='AppStore'/>
        </div>
        <div className='midFooter'>
            <h1>Ecommerce</h1>
            <p>High quality is our first Priority</p>
            <p>Copyright 2023 &copy; MeAnurag</p>
        </div>
        <div className='rightFooter'>
                <h4>Follow US</h4>
                <a href='#'>Instagram</a>
                <a href='#'>Youtubr</a>
                <a href='#'>Facebook</a>
        </div>

    </footer>
  )
}

export default Footer