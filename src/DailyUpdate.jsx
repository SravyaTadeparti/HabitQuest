import { Link } from "react-router-dom";
import "./DailyUpdate.css";
import button2 from "./assets/woodenbutton2.png";
import sign from "./assets/woodensign.png";
import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import checkIcon from "./assets/check.png";
import tokenIcon from "./assets/token.png";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";

function DailyUpdate() {
    const [habits, setHabits] = useState([]);
    const [checkedHabits, setCheckedHabits] = useState({});
    const [tokens, setTokens] = useState(0);
    const [lastReset, setLastReset] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                setHabits(data.habits || []);
                setCheckedHabits(data.checkedHabits || {});
                setTokens(data.tokens || 0);
                setLastReset(data.lastReset || null);

                checkAndResetHabits(user.uid, data.lastReset);
            }
        };

        fetchUserData();
    }, []);

    // 🔹 Check if we need to reset habits for a new day
    const checkAndResetHabits = async (userId, lastResetDate) => {
        const now = new Date();
        const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

        // ✅ If last reset is null OR last reset was before today, reset checkmarks
        if (!lastResetDate || lastResetDate < currentDate) {
            console.log("Resetting habits for a new day!");

            const updatedCheckedHabits = {};
            Object.keys(checkedHabits).forEach((habitId) => {
                updatedCheckedHabits[habitId] = false; // ✅ Reset all to false
            });

            // ✅ Save reset checkmarks and update last reset date
            const userDocRef = doc(db, "users", userId);
            await setDoc(userDocRef, { checkedHabits: updatedCheckedHabits, lastReset: currentDate }, { merge: true });

            setCheckedHabits(updatedCheckedHabits);
            setLastReset(currentDate);
        }
    };

    // 🔹 Save checked habits and tokens to Firestore
    const saveToFirestore = async (updatedChecked, updatedTokens) => {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { checkedHabits: updatedChecked, tokens: updatedTokens }, { merge: true });
    };

    // const toggleCheck = (habitId, habitTokens) => {
    //     setCheckedHabits((prevChecked) => {
    //         const updatedChecked = {
    //             ...prevChecked,
    //             [habitId]: !prevChecked[habitId], 
    //         };
    
    //         let updatedTokens = tokens;
    
    //         if (!prevChecked[habitId]) {
    //             updatedTokens += habitTokens;
    //         } 
    //         else if (lastReset === new Date().toISOString().split("T")[0]) {
    //             updatedTokens -= habitTokens;
    //         }
    
    //         setTokens(updatedTokens);
    //         saveToFirestore(updatedChecked, updatedTokens);
    
    //         return updatedChecked;
    //     });
    // };

    const toggleCheck = (habitId, habitTokens) => {
        setCheckedHabits((prevChecked) => {
            const updatedChecked = {
                ...prevChecked,
                [habitId]: !prevChecked[habitId], 
            };
    
            let updatedTokens = tokens;
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    
            if (!prevChecked[habitId]) {
                updatedTokens += habitTokens;
                updateHabitCompletion(habitId, today, true); // ✅ Mark as completed
            } else {
                updatedTokens -= habitTokens;
                updateHabitCompletion(habitId, today, false); // ❌ Remove if unchecked
            }
    
            setTokens(updatedTokens);
            saveToFirestore(updatedChecked, updatedTokens);
    
            return updatedChecked;
        });
    };
    
    // 🔹 Function to update completion history (Add or Remove Date)
    const updateHabitCompletion = async (habitId, date, isCompleted) => {
        const user = auth.currentUser;
        if (!user) return;
    
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
    
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedHabits = userData.habits.map((habit) => {
                if (habit.id === habitId) {
                    if (!habit.completedDates) {
                        habit.completedDates = [];
                    }
                    
                    if (isCompleted) {
                        // ✅ Add today's date if not already added
                        if (!habit.completedDates.includes(date)) {
                            habit.completedDates.push(date);
                        }
                    } else {
                        // ❌ Remove today's date if it exists
                        habit.completedDates = habit.completedDates.filter(d => d !== date);
                    }
                }
                return habit;
            });
    
            // ✅ Save updated habits to Firestore
            await setDoc(userDocRef, { habits: updatedHabits }, { merge: true });
        }
    };
    
    
    

    return (
        <div className="DailyUpdate-container">
            <TopBar />
            <MenuBar />
            <div className="update-habits-button">
                <Link to="/habits">
                    <img src={button2} alt="button" className="button-image" />
                    <div className="button-name">Modify Habits</div>
                </Link>
            </div>

            {/* ✅ Display habits on signs */}
            <div className="habit-update-container">
                {habits.map((habit) => (
                    <div key={habit.id} className="habit-sign-container">
                        {/* ✅ Clickable check circle */}
                        <div className="check-circle" onClick={() => toggleCheck(habit.id, habit.tokens)}>
                            {checkedHabits[habit.id] && <img src={checkIcon} alt="Checked" className="check-icon" />}
                        </div>

                        {/* ✅ Habit sign */}
                        <img src={sign} alt="habit sign" className="habit-sign" />
                        <div className="habit-text">{habit.name} </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DailyUpdate;
