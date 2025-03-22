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
        {/* <header className="top-bar">
            <div className="logo-title">
                <img src={logo} alt="HabitQuest Logo" />
                <h1>HabitQuest</h1>
            </div>
            <div className="token-display">
                <img src={tokenIcon} alt="Token" className="token-icon" />
                <span className="token-count">{tokens}</span>
            </div>
        </header> */}
        <TopBar />


      <div className="main-content">
        <MenuBar />
        {/* <div className="menu-container">
            <Link to="/dailyupdate" className="menu-link">
                <div className="menu-box">
                    <img src={menuBox} alt="Menu Box" />
                    <p>Habits</p>
                </div>
            </Link>
            <Link to="/profile" className="menu-link">
                <div className="menu-box">
                    <img src={menuBox} alt="Menu Box" />
                    <p>Profile</p>
                </div>
            </Link>
            <Link to="/calendar" className="menu-link">
                <div className="menu-box">
                    <img src={menuBox} alt="Menu Box" />
                    <p>Calendar</p>
                </div>
            </Link>
            <Link to="/shop" className="menu-link">
                <div className="menu-box">
                    <img src={menuBox} alt="Menu Box" />
                        <p data-text="Shop">Shop</p>
                </div>
            </Link>
            <Link to="/pets" className="menu-link">
                <div className="menu-box">
                    <img src={menuBox} alt="Menu Box" />
                    <p>Pets</p>
                </div>
            </Link>

        </div> */}

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

