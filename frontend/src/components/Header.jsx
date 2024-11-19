import React from "react";
import "../styles/Header.css";
import { useAuthentication } from "../auth";

import {Link} from "react-router-dom";

const Header = () => {

    const {isAuthorized, logout} = useAuthentication();

    const handleLogout = () => {
        logout();
    }


    return (
        <header className="header">
            <img src='https://tc4a.africa/wp-content/cache/seraphinite-accelerator/s/m/d/img/0bb11a36cc3f242129e8a039246ae6af.8072.png' alt="Background woman" className="header-bg" />
            <div className="header-content">
                <h1>Tech Care For All  </h1>
                <h3>Assessment Project</h3>
                <ul className="navbar-menu-right">
                {isAuthorized ? (
                    <li>
                        <Link onClick={handleLogout} to="/logout" className="button-link">Logout</Link>
                    </li>
                ) : (
                    <>
                        
                        <li>
                            <Link to="/register" className="button-link">Get Started</Link>
                        </li>

                        <div></div>
                    </>
                    
                )}
                
               
            </ul>
                
            </div>
           
        </header>
        
    )
}

export default Header;