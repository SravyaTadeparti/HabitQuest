import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import LevelPathMap from "./LevelPathMap"
import { useParams } from 'react-router-dom';
import BossData from "./BossData.json";
import "./Battle.css";




function Battle() {
    const { levelId } = useParams();
    const Boss = BossData[parseInt(levelId) - 1];
    return(
        <div className="battle-page">
            <img className="boss-img" src={Boss.image} alt={Boss.name} />  
            <img className="pet-fight" src="/CelestialTiger.png"/>  
        </div>
    );
}

export default Battle;