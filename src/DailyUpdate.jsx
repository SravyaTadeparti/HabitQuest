import {Link} from "react-router-dom";
import "./DailyUpdate.css";
import button2 from "./assets/woodenbutton2.png";
import sign from "./assets/woodensign.png";
import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import checkIcon from "./assets/check2.png";
import tokenIcon from "./assets/token.png";


function DailyUpdate(){

    const [habits, setHabits] = useState([]);
    const [checkedHabits, setCheckedHabits] = useState({});
    const [tokens, setTokens] = useState(0);

    useEffect(() => {
        const fetchHabits = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                setHabits(data.habits || []);
                setCheckedHabits(data.checkedHabits || {}); 
                setTokens(data.tokens || 0); 
            }
        };

        fetchHabits();
    }, []);

    // 🔹 Save checked status to Firestore
    const saveCheckedToFirestore = async (updatedChecked, updatedTokens) => {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { checkedHabits: updatedChecked, tokens: updatedTokens }, { merge: true });
    };

    // 🔹 Toggle checkmark and save to Firestore
    const toggleCheck = (habitId, habitTokens) => {
        setCheckedHabits((prevChecked) => {
            const updatedChecked = {
                ...prevChecked,
                [habitId]: !prevChecked[habitId], 
            };
            const updatedTokens = prevChecked[habitId] ? tokens - habitTokens : tokens + habitTokens;
            setTokens(updatedTokens);

            saveCheckedToFirestore(updatedChecked, updatedTokens); 
            return updatedChecked;
        });
    };

    return(
        <div className="DailyUpdate-container">
            <div className="token-display">
                <img src={tokenIcon} alt="Token" className="token-icon" />
                <span className="token-count">{tokens}</span>
            </div>
            <div className="update-habits-button">
                <Link to="/habits">
                    <img src={button2} alt="button" className="button-image"/>
                    <div className="button-name">Update Habits</div>
                </Link>
            </div>
            <div className="habit-update-container">
                {habits.map((habit) => (
                    <div key={habit.id} className="habit-sign-container">
                            <div className="check-circle" onClick={() => toggleCheck(habit.id, habit.tokens)}>
                                {checkedHabits[habit.id] && <img src={checkIcon} alt="Checked" className="check-icon" />}
                            </div>
                        <img src={sign} alt="habit sign"className="habit-sign"/>
                        <div className="habit-text">{habit.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default DailyUpdate;