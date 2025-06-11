import React, { useState, useEffect } from 'react';
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import { Link } from "react-router-dom"; 


const levels = [
  { id: 1, x: 50, y: 50 },  
  { id: 2, x: 200, y: 50 },  
  { id: 3, x: 200, y: 100 },  
  { id: 4, x: 300, y: 100 }, 
  { id: 5, x: 300, y: 250 },  
  { id: 6, x: 150, y: 250 },  
  { id: 7, x: 150, y: 150 },
  { id: 8, x: 50, y: 150 },   
  { id: 9, x: 50, y: 300 },   
  { id: 10, x: 450, y: 300 }, 
  { id: 11, x: 450, y: 50 },  
  { id: 12, x: 350, y: 50 },  
];

const LevelPathMap = () => {
  const levelSize = 30; 
  const charSize = 70; 

  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [characterPosition, setCharacterPosition] = useState({
    x: levels[0].x - charSize / 2, 
    y: levels[0].y - charSize / 2  
  });

  useEffect(() => {
    const targetLevel = levels.find(level => level.id === currentLevelId);
    if (targetLevel) {
      setCharacterPosition({
        x: targetLevel.x - charSize / 2, 
        y: targetLevel.y - charSize / 2  
      });
    }
  }, [currentLevelId]);

  const handleLevelClick = (levelId) => {
    setCurrentLevelId(levelId);
  };

  return (
    <div className="level-path-map-container">
      <TopBar />
      <MenuBar />
      <style>{    
        `
        
         /* Overall container for the map */
        .level-path-map-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: "Press Start 2P", cursive;
          background-image: url("/background5.jpg");
          background-repeat:no-repeat;
          background-size:cover;

        }

        /* Wrapper for the map, defining its visual properties */
        .map-wrapper {          
          position: relative;
          width: 100vw;
          height: 100vh;
        }

        /* SVG element acting as the canvas for the map */
        .map-svg {
          position: absolute;
          top:120px;
          left: 250px;
          width: 80%;
          height: 80%;
        }

        .path-line {
          stroke:rgb(44, 161, 72); 
          stroke-width: 15px; 
          stroke-linecap: round; 
        }

        .level-group {
          cursor: pointer; 

        }

        /* Hover effect for level groups */
        .level-group:hover {
            background-color:green;
        }

        .level-square {
          fill: #fcd34d; 
          stroke: #D97706; 
          stroke-width: 2px; 
        }

        .level-text {
          font-size: 10px; 
          font-weight: bold; 
          fill: #374151; 
          user-select: none; 
        }


        .character-image { 
          transition: all 1s ease-in-out;
        }

        .battle-button{
            position:absolute;
            top:85%;
            left:50%;
            color:white;
            background-color:rgb(63, 45, 12);
            font-family: "Press Start 2P", cursive;
            padding:20px;
            font-size:2em;
            border: solid 2px black;
            border-radius:5px; 
            transition: 0.2s ease-in-out;
        }
        
        .battle-button:hover{
            transform:scale(1.1);
            cursor:pointer;
        }
        
        `}
      </style>
      <div className="map-wrapper">
        <svg className="map-svg" viewBox="0 0 500 400">
          {levels.slice(0, -1).map((level, index) => {
            const nextLevel = levels[index + 1];
            return (
              <line
                key={`path-${level.id}-${nextLevel.id}`} 
                x1={level.x}
                y1={level.y}
                x2={nextLevel.x}
                y2={nextLevel.y}
                className="path-line" 
              />
            );
          })}

          {levels.map((level) => (
            <g
              key={`level-${level.id}`}
              className="level-group" 
              onClick={() => handleLevelClick(level.id)} 
            >
              <rect
                x={level.x - levelSize / 2} 
                y={level.y - levelSize / 2} 
                width={levelSize}
                height={levelSize}
                className="level-square" 
              />
              <text
                x={level.x}
                y={level.y + 6} 
                textAnchor="middle" 
                className="level-text"
              >
                {level.id}
              </text>
            </g>
          ))}

        <image // Changed from rect to image
            href="/CrystalTurtle.png" 
            x={characterPosition.x}
            y={characterPosition.y}
            width={charSize}
            height={charSize}
            className="character-image" 
          />
        </svg>
        <Link to={`/battle/${currentLevelId}`}>
            <div className='battle-button'>Battle</div>
        </Link>
      </div>
    </div>
  );
};

export default LevelPathMap;
