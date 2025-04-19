import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import "./Pets.css";

function MyPets() {
    const [myPets, setMyPets] = useState([]);

    useEffect(() => {
        
        const savedPets = JSON.parse(localStorage.getItem("myPets")) || [];
        setMyPets(savedPets);
    }, []);

     

    return (
        <div className="my-pets-container">
            <TopBar />
            <MenuBar />
            <div className="my-pets-content">
                <h1>My Pets</h1>
                {myPets.length === 0 ? (
                    <p>You don’t own any pets yet! Go to the <Link to="/shop">Shop</Link> to buy some.</p>
                ) : (
                    <div className="pet-collection">
                        {myPets.map((pet, index) => (
                            <div key={index} className="pet-item">
                                <img src={pet.image} alt={pet.name} className="pet-img" />
                                <h3>{pet.name}</h3>
                            </div>
                            
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyPets;
