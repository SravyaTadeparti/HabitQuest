import logo from "./assets/logo.png";
import menuBox from "./assets/menu-box2.png"; 
import { Link } from "react-router-dom"; 
import "./MenuBar.css";

function MenuBar(){
    return(
    <div className="menu-container">
        <Link to="/" className="menu-link">
            <div className="menu-box">
                <img src={menuBox} alt="Menu Box" />
                <p>Profile</p>
            </div>
        </Link>
        <Link to="/dailyupdate" className="menu-link">
            <div className="menu-box">
                <img src={menuBox} alt="Menu Box" />
                <p>Habits</p>
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
        <Link to="/levelpathmap" className="menu-link">
            <div className="menu-box">
                <img src={menuBox} alt="Menu Box" />
                <p>Battle</p>
            </div>
        </Link>
    </div>
    );
}

export default MenuBar;