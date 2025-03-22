import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // ✅ Import calendar styles
import "./Calendar.css"; // ✅ Add custom styles
import TopBar from "./TopBar";
import MenuBar from "./Menubar";


function HabitCalendar({ habit }) {
  const [completedDates, setCompletedDates] = useState([]);

  useEffect(() => {
      setCompletedDates(habit.completedDates || []);
  }, [habit]);

  // ✅ Function to get YYYY-MM-DD format in **local time**
  const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // ✅ Ensure 2 digits
      const day = String(date.getDate()).padStart(2, "0"); // ✅ Ensure 2 digits
      return `${year}-${month}-${day}`;
  };

  return (
      <div className="habit-calendar">
          <h2>{habit.name}</h2>
          <Calendar
              tileClassName={({ date }) => 
                  completedDates.includes(formatDate(date)) ? "completed-day" : ""
              }
          />
      </div>
  );
}


function CalendarPage() {
    const [habits, setHabits] = useState([]);

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

    return (
      <div className="calendar-page">
        <TopBar />
        <MenuBar />

        <div className="calendar-container">
              {habits.map((habit) => (
                <HabitCalendar key={habit.id} habit={habit} />
            ))}
        </div>
      </div>
    );
}

export default CalendarPage;
