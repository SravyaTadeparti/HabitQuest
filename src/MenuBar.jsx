import logo from "./assets/logo.png";
import menuBox from "./assets/menu-box2.png"; 
import { Link } from "react-router-dom"; 


function MenuBar(){
    return(
    <div className="menu-container">
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
    </div>
    );
}

export default MenuBar;