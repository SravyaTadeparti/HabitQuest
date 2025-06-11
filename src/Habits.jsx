import { useState, useEffect, useRef } from "react";
import "./Habits.css";
import medievalPaper from "./assets/medieval_paper.png";
import trashIcon from "./assets/trash.png";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import button2 from "./assets/woodenbutton2.png";
import { Link } from "react-router-dom";



function Habits() {
  const [habits, setHabits] = useState([]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const difficultyRef = useRef(null);

  // 🔹 Load habits from Firestore when the component mounts
  useEffect(() => {
    const fetchHabits = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setHabits(userDoc.data().habits || []);
      }
    };

    fetchHabits();
  }, []);

  // 🔹 Save habits to Firestore
  const saveHabitsToFirestore = async (updatedHabits) => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, { habits: updatedHabits }, { merge: true });
  };

  const getTokenAmount = (difficulty) => {
    if (difficulty.toLowerCase() === "easy") {
      return Math.floor(Math.random() * 11); // 0 - 10 tokens
    } else if (difficulty.toLowerCase() === "medium") {
      return Math.floor(Math.random() * 11) + 10; // 10 - 20 tokens
    } else if (difficulty.toLowerCase() === "hard") {
      return Math.floor(Math.random() * 11) + 20; // 20 - 30 tokens
    } else {
      return Math.floor(Math.random() * 10) + 1; // Default: 1 - 10 tokens
    }
  };
  
  const addHabit = async () => {
    if (!newHabit.trim() || !difficulty.trim()) return;
  
    const tokenAmount = getTokenAmount(difficulty); 
  
    const newHabitObj = {
      id: Date.now(),
      name: newHabit,
      difficulty,
      tokens: tokenAmount, // ✅ Assign calculated tokens
    };
  
    const updatedHabits = [...habits, newHabitObj];
    setHabits(updatedHabits);
    await saveHabitsToFirestore(updatedHabits); // ✅ Save to Firestore
  
    setNewHabit("");
    setDifficulty("");
    setShowHabitForm(false);
  };


  // 🔹 Delete a habit
  const deleteHabit = async (habitId) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);
    setHabits(updatedHabits);
    await saveHabitsToFirestore(updatedHabits); // ✅ Save updated list to Firestore
  };

  // 🔹 Handle Enter key press
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents line break in editable field
      if (nextField) {
        nextField.current.focus(); // Move to next input
      } else {
        addHabit(); // If no next field, confirm habit
      }
    }
  };

  // 🔹 Cancel a new habit before confirming
  const cancelNewHabit = () => {
    setShowHabitForm(false);
    setNewHabit("");
    setDifficulty("");
  };

  return (
    <div className="habits-page">
      <TopBar />
      <MenuBar />

      <div className="update-habits-button">
        <Link to="/dailyupdate">
            <img src={button2} alt="button" className="button-image" />
            <div className="button-name">Update Habits</div>
        </Link>
      </div>

      <div className="habits-container">


        <button className="new-habit-button" onClick={() => setShowHabitForm(true)}>+</button>

        {showHabitForm && (
          <div className="habit-card">
            <img src={medievalPaper} alt="Habit Paper" className="habit-paper" />
            <div className="habit-content">
              <p>
                Habit:{" "}
                <span
                  className="editable"
                  contentEditable="true"
                  onInput={(e) => setNewHabit(e.target.textContent)}
                  onKeyDown={(e) => handleKeyPress(e, difficultyRef)}
                >
                  Click to type...
                </span>
              </p>
              <p>
                Difficulty:{" "}
                <span
                  className="editable"
                  ref={difficultyRef}
                  contentEditable="true"
                  onInput={(e) => setDifficulty(e.target.textContent)}
                  onKeyDown={(e) => handleKeyPress(e, null)}
                >
                  Click to type...
                </span>
              </p>
              <button onClick={addHabit}>Confirm</button>

              <button className="delete-button" onClick={cancelNewHabit}>
                <img src={trashIcon} alt="Delete" />
              </button>
            </div>
          </div>
        )}

        {/* Show all habits */}
        <div className="habit-list">
          {habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <img src={medievalPaper} alt="Habit Paper" className="habit-paper" />
              <div className="habit-content">
                <p>Habit: {habit.name}</p>
                <p>Difficulty: {habit.difficulty}</p>
                <p>Tokens: {habit.tokens}</p>
                <button className="delete-button" onClick={() => deleteHabit(habit.id)}>
                  <img src={trashIcon} alt="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Habits;
