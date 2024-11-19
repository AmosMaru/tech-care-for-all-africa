import React from "react";
import Header from "../components/Header";
import Product from "../components/Product";
import OrderItem from   "../components/OrderItems";
import { useAuthentication } from "../auth";

const Home = () => {


    const {isAuthorized, logout} = useAuthentication();


    return (
        <div>

            {isAuthorized ? 
            (  
                <div>

            <h1>NOTE: Refresh to apply changes</h1>
                <Product />            
                <OrderItem />  
                </div>
            ): (
                <div>

                <Header />


            </div>
            )}


        </div>
    );
}

export default Home;