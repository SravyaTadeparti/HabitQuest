import "./Shop.css";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import tokenIcon from "./assets/token.png"; 
import rpgMerchant from "./assets/shopkeeper.png";
import petImage from "./assets/placeholder.jpg";

function Shop() {
    const [tokens, setTokens] = useState(0); // Default to 0 coins
    const pet = { id: "001", name: "Mystic Fox", price: 10, image: petImage }; // Example pet

    // Fetch user's token count from Firestore
    useEffect(() => {
        const fetchTokens = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setTokens(userDoc.data().tokens || 0);
            }
        };

        fetchTokens();
    }, []);

    // Buy pet function (deduct coins in Firestore)
    const buyPet = async (pet) => {
        const user = auth.currentUser;
        if (!user) return alert("You must be logged in!");

        if (tokens < pet.price) {
            alert("Not enough coins!");
            return;
        }

        const userDocRef = doc(db, "users", user.uid);
        const newBalance = tokens - pet.price;

        try {
            await updateDoc(userDocRef, { tokens: newBalance }); // Update Firestore
            setTokens(newBalance); // Update UI immediately

            // Retrieve existing pets and add the new one
            const savedPets = JSON.parse(localStorage.getItem("myPets")) || [];
            savedPets.push(pet);
            localStorage.setItem("myPets", JSON.stringify(savedPets));

            alert(`${pet.name} has been added to your collection!`);
        } catch (error) {
            console.error("Error updating tokens:", error);
        }
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

                {/* Pet Shop Grid */}
                <div className="pet-shop">
                    {Array(20).fill(pet).map((_, index) => (
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
