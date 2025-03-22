import logo from "./assets/logo.png";
import tokenIcon from "./assets/token.png";
import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

function TopBar() {
    const [tokens, setTokens] = useState(0);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, "users", user.uid);

        // 🔹 Listen for real-time token updates
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setTokens(docSnap.data().tokens || 0);
            }
        });

        return () => unsubscribe(); // Cleanup listener when unmounting
    }, []);

    return (
        <header className="top-bar">
            <div className="logo-title">
                <img src={logo} alt="HabitQuest Logo" />
                <h1>HabitQuest</h1>
            </div>
            <div className="token-display">
                <img src={tokenIcon} alt="Token" className="token-icon" />
                <span className="token-count">{tokens}</span>
            </div>
        </header>
    );
}

export default TopBar;
