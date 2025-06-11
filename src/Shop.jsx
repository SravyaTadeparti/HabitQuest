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
import petData from './PetData.json';
import { arrayUnion } from "firebase/firestore";

function Shop() {
    const [tokens, setTokens] = useState(0);
    const [boughtpets, setBoughtpets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);



    const petList = Object.entries(petData).map(([name, data]) => ({
        name,
        image: data.image,
        characteristics: data.characteristics,
        category: data.category,
        price: Math.floor(Math.random() * 100 + 50)
    }));

    const categoryColors = {
        strength: 'border-red',
        speed: 'border-blue',
        healing: 'border-green',
        helping: 'border-orange'
    };



    const [showWheel, setShowWheel] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState(null);
    const [rotation, setRotation] = useState(0);


    const rewards = ["5 Tokens", "10 Tokens", "15 Tokens", "Mystic Fox"];
    const segmentAngle = 360 / rewards.length;

    useEffect(() => {
        const fetchPets = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log(userData.pets)
                setBoughtpets(userData.pets || []);
            }
        };

        fetchPets();
    }, []);

    useEffect(() => {
        const fetchSelectedPet = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                setSelectedPet(userData.selectedPet || null);
            }
        };

        fetchSelectedPet();
    }, []);

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
            // Update tokens and add pet to "pets" array in Firestore
            await updateDoc(userDocRef, {
                tokens: newBalance,
                pets: arrayUnion(pet)
            });

            boughtpets.push(pet)

            setTokens(newBalance);
            alert(`${pet.name} has been added to your collection!`);
        } catch (error) {
            console.error("Error updating tokens or pets:", error);
        }
    };

const handlePetSelect = async (pet) => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    try {
        await updateDoc(userDocRef, {
            selectedPet: pet
        });
        setSelectedPet(pet); // ✅ Update local state immediately
    } catch (error) {
        console.error("Error setting selected pet:", error);
    }
};


    const spinWheel = async () => {
        if (spinning) return;

        setSpinning(true);
        const randomIndex = Math.floor(Math.random() * rewards.length);
        const offset = segmentAngle / 2;
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
                {/* <div className="merchant-area">
                    <img src={rpgMerchant} alt="Merchant" className="merchant-img" />
                    <div className="speech-box">
                        <p>“Ah, a fine traveler! Would you like to buy a pet?”</p>
                    </div>
                </div> */}
                {/* <div className="pet-display-container">
                    {boughtpets.length === 0 ? (
                        <p>No pets yet!</p>
                    ) : (
                        boughtpets.map((pet, idx) => (
                        <div key={idx} className="pet-card" onClick={() => handlePetSelect(pet)}>
                            <img src={pet.image} alt={pet.name} className="pet-img" />
                        </div>
                        ))
                    )}
                </div> */}
                <div className="pet-display-container">
                    {boughtpets.map((pet, index) => (
                        <div key={index} className="pet-card-wrapper">
                        {selectedPet?.name === pet.name && (
                            <img src="/FrostMoth.png" alt="Selected" className="arrow-img" />
                        )}
                        <div className="pet-card" onClick={() => handlePetSelect(pet)}>
                            <img src={pet.image} alt={pet.name} />
                        </div>
                        </div>
                    ))}
                </div>


                <div className="pet-shop">
                    {petList.map((pet, index) => (
                    <div
                        key={index}
                        className={`pet-item ${pet.category}`}
                    >
                        <img src={pet.image} alt={pet.name} className="pet-img" />
                        <h4>{pet.name}</h4>
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
