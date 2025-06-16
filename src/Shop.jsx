import "./Shop.css";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import petData from './PetData.json';
import SpinWheel from "./SpinWheel";

function Shop() {
    const [tokens, setTokens] = useState(0);
    const [boughtpets, setBoughtpets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [showWheel, setShowWheel] = useState(false);

    const petList = Object.entries(petData).map(([name, data]) => ({
        ...data,
        name,
    }));

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                setTokens(userData.tokens || 0);
                setBoughtpets(userData.pets || []);
                setSelectedPet(userData.selectedPet || null);
            }
        };

        fetchUserData();
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
            await updateDoc(userDocRef, {
                tokens: newBalance,
                pets: arrayUnion(pet),
            });

            setTokens(newBalance);
            setBoughtpets([...boughtpets, pet]);
            alert(`${pet.name} has been added to your collection!`);
        } catch (error) {
            console.error("Error buying pet:", error);
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
            setSelectedPet(pet);
        } catch (error) {
            console.error("Error selecting pet:", error);
        }
    };

    return (
        <div className="shop-container">
            <TopBar />
            <MenuBar />

            <div className="shop-content">
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
                        <div key={index} className={`pet-item ${pet.category}`}>
                            <img src={pet.image} alt={pet.name} className="pet-img" />
                            <h4>{pet.name}</h4>
                            <p>{pet.price}</p>
                            <button onClick={() => buyPet(pet)}>Buy</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🎡 Spin the Wheel Button */}
            <div 
                className="wheel-icon" 
                onClick={() => setShowWheel(!showWheel)}
            >
                🎡
            </div>

            {/* ⬇️ Renders outside scrollable area */}
            {showWheel && (
            <div className="wheel-overlay">
                <SpinWheel tokens={tokens} setTokens={setTokens} onClose={() => setShowWheel(false)} />
            </div>
            )}

        </div>
    );
}

export default Shop;
