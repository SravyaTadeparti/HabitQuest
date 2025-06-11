import "./Home.css";
import logo from "./assets/logo.png";
import character from "./assets/welcome_char.png";
import menuBox from "./assets/menu-box2.png"; 
import speechBubble from "./assets/speech-bubble.png"
import tokenIcon from "./assets/token.png";
import { Link } from "react-router-dom"; 
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import TopBar from "./TopBar";  
import MenuBar from "./MenuBar";




function Home() {

    const [tokens, setTokens] = useState(0);

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
  return (
    <div className="home-container">

        <TopBar />
        <MenuBar />

        <div className="main-content">


        <div className="character-container">
            <div className="speech-bubble-container">
                <img src={speechBubble} alt="Speech Bubble" className="speech-bubble" />
            </div>
            <motion.img
                src={character}
                alt="Pixel Character"
                className="character"
                animate={{
                    y: [0, -5, 0], 
                }}
                transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                }}
            />
        </div>
      </div>
    </div>
  );
}

export default Home;

