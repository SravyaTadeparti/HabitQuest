import "./Shop.css";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import tokenIcon from "./assets/token.png";
import rpgMerchant from "./assets/shopkeeper.png";
import petImage from "./assets/placeholder.jpg";
import { motion } from "framer-motion";

function Shop() {
    const [tokens, setTokens] = useState(0);
    const pet = { id: "001", name: "Mystic Fox", price: 10, image: petImage };

    const [showWheel, setShowWheel] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState(null);
    const [rotation, setRotation] = useState(0);

    const rewards = ["5 Tokens", "10 Tokens", "15 Tokens", "Mystic Fox"];
    const segmentAngle = 360 / rewards.length;

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
            await updateDoc(userDocRef, { tokens: newBalance });
            setTokens(newBalance);

            const savedPets = JSON.parse(localStorage.getItem("myPets")) || [];
            savedPets.push(pet);
            localStorage.setItem("myPets", JSON.stringify(savedPets));

            alert(`${pet.name} has been added to your collection!`);
        } catch (error) {
            console.error("Error updating tokens:", error);
        }
    };

    const spinWheel = async () => {
        if (spinning) return;

        setSpinning(true);
        const randomIndex = Math.floor(Math.random() * rewards.length);
        const offset = segmentAngle / 2; // Offset to center the selection
        const newRotation = rotation + (360 * 5) + (randomIndex * segmentAngle) + offset;

        setRotation(newRotation);

        setTimeout(async () => {
            setSpinning(false);
            setPrize(rewards[randomIndex]);

            if (rewards[randomIndex].includes("Tokens")) {
                const earnedTokens = parseInt(rewards[randomIndex].split(" ")[0]);
                const newBalance = tokens + earnedTokens;
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, "users", user.uid);
                    await updateDoc(userDocRef, { tokens: newBalance });
                    setTokens(newBalance);
                }
            } else {
                const savedPets = JSON.parse(localStorage.getItem("myPets")) || [];
                savedPets.push(pet);
                localStorage.setItem("myPets", JSON.stringify(savedPets));
                alert("You won a Mystic Fox!");
            }
        }, 3000);
    };

    return (
        <div className="shop-container">
            <TopBar />
            <MenuBar />
            <div className="shop-content">
                <div className="merchant-area">
                    <img src={rpgMerchant} alt="Merchant" className="merchant-img" />
                    <div className="speech-box">
                        <p>“Ah, a fine traveler! Would you like to buy a pet?”</p>
                    </div>
                </div>

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

                <motion.div 
                    className="wheel-icon" 
                    onClick={() => setShowWheel(!showWheel)}
                    whileTap={{ scale: 0.9 }}
                >
                    🎡
                </motion.div>
                
                {showWheel && (
                    <motion.div 
                        className="wheel-container"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* 🎯 Pointer Indicator */}
                        <div className="wheel-pointer">▼</div>

                        {/* 🛞 Spinning Wheel */}
                        <motion.div 
                            className="wheel"
                            animate={{ rotate: rotation }}
                            transition={{ duration: 3, ease: "easeOut" }}
                        >
                            {rewards.map((reward, index) => (
                                <div 
                                    key={index} 
                                    className="wheel-segment"
                                    style={{ transform: `rotate(${index * segmentAngle}deg)` }}
                                >
                                    {reward}
                                </div>
                            ))}
                        </motion.div>

                        <button onClick={spinWheel} disabled={spinning}>
                            {spinning ? "Spinning..." : "Spin the Wheel"}
                        </button>
                        {prize && <p>You won: {prize}!</p>}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Shop;
