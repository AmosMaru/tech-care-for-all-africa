import React from "react";
import {Link} from "react-router-dom";
import '../styles/Navbar.css';
import { useAuthentication } from "../auth";


function Navbar() {

    const {isAuthorized, logout} = useAuthentication();

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="navbar">
            <Link to="/" className="navbar-logo-link">
                <img src='https://tc4a.africa/wp-content/cache/seraphinite-accelerator/s/m/d/img/0bb11a36cc3f242129e8a039246ae6af.8072.png' alt="Logo" className="navbar-logo"/>
            </Link>
            <ul className="navbar-menu-left">
              
            </ul>
            <ul className="navbar-menu-right">
                {isAuthorized ? (
                    <li>
                        <Link onClick={handleLogout} to="/logout" className="button-link">Logout</Link>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to="/login" className="button-link-login">Log In</Link>
                        </li>
                        <li>
                            <Link to="/register" className="button-link">Register</Link>
                        </li>
                    </>
                )}
                
               
            </ul>
        </div>
    );
}

export default Navbar;