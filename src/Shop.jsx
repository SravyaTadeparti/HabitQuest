import "./Shop.css";
import { useState, useEffect } from "react";
import { auth } from "./firebase"; // Removed Firestore
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import tokenIcon from "./assets/token.png"; 
import rpgMerchant from "./assets/shopkeeper.png";
import petImage from "./assets/placeholder.jpg"; // Change to your pet image

function Shop() {
    const [tokens, setTokens] = useState(100); // Default to 100 coins for now
    const pet = { id: "001", name: "Mystic Fox", price: 10, image: petImage }; // Hardcoded pet

    // Simulating fetching user tokens (No Firestore)
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Fake token fetch
        setTokens(100);
    }, []);

    // Buy pet function
    const buyPet = (pet) => {
        if (tokens < pet.price) {
            alert("Not enough coins!");
            return;
        }
        setTokens(tokens - pet.price);
    };

    return (
        <div className="shop-container">
            <TopBar />
            <MenuBar />
            <div className="shop-content">
                
                {/* Merchant Section */}
                <div className="merchant-area">
                    <img src={rpgMerchant} alt="Merchant" className="merchant-img" />
                    <div className="speech-box">
                        <p>“Ah, a fine traveler! Would you like to buy a pet?”</p>
                    </div>
                </div>

                {/* Token Display */}
                <div className="token-display">
                    <img src={tokenIcon} alt="Token" className="token-icon" />
                    <span className="token-count">{tokens} Coins</span>
                </div>

                {/* Pet Shop Grid */}
                <div className="pet-shop">
                    {Array(20).fill(pet).map((pet, index) => (
                        <div key={index} className="pet-item">
                            <img src={pet.image} alt={pet.name} className="pet-img" />
                            <h3>{pet.name}</h3>
                            <p>{pet.price} Coins</p>
                            <button onClick={() => buyPet(pet)}>Buy</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Shop;
