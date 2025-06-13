import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";
import LevelPathMap from "./LevelPathMap"
import { useParams } from 'react-router-dom';
import BossData from "./BossData.json";
import "./Battle.css";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; 
import { useRef } from 'react';
import HPBar from './HPBar';
import { useNavigate } from 'react-router-dom';



function Battle() {
    const { levelId } = useParams();
    const Boss = BossData[parseInt(levelId) - 1];
    const [selectedPet, setSelectedPet] = useState(null);
    const [petHP, setPetHP] = useState(100);
    const [monsterHP, setMonsterHP] = useState(Boss.hp);
    const [projectiles, setProjectiles] = useState([]);
    const [charX, setCharX] = useState(100); // horizontal
    const [charY, setCharY] = useState(600); // vertical (ground level)
    const [isJumping, setIsJumping] = useState(false);
    const [monsterProjectiles, setMonsterProjectiles] = useState([]);
    const bossRef = useRef(null);
    const monsterX = 800; // Example position
    const monsterY = 600;
    const [result, setResult] = useState(null);

    const navigate = useNavigate();




    useEffect(() => {
        const fetchSelectedPet = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
            const data = userDoc.data();
            setSelectedPet(data.selectedPet || null);
            }
        };

        fetchSelectedPet();
        }, []);

        const lastAttackRef = useRef(0);


        const handleAttack = (e) => {


            if (!selectedPet) return;

            const now = Date.now();
            const cooldown = 1500 / (selectedPet?.speed || 2); // higher speed = shorter cooldown

            if (now - lastAttackRef.current < cooldown) return; // Too soon to attack again

            lastAttackRef.current = now; // update last attack time

            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            const petX = charX + 30; 
            const petY = charY + 30;

            const dx = clickX - petX;
            const dy = clickY - petY;

            const id = Date.now();
            const projectile = {
                id,
                top: petY,
                left: petX,
                dx,
                dy,
            };

            setProjectiles(prev => [...prev, projectile]);

            setTimeout(() => {
                setProjectiles(prev => prev.filter(p => p.id !== id));

                // Detect if projectile hit monster (simple box hit test)
                const monsterBox = document.querySelector('.boss-img').getBoundingClientRect();
                const targetX = petX + dx;
                const targetY = petY + dy;

                if (
                    targetX >= monsterBox.left - rect.left &&
                    targetX <= monsterBox.right - rect.left &&
                    targetY >= monsterBox.top - rect.top &&
                    targetY <= monsterBox.bottom - rect.top
                ) {
                    const damage = selectedPet.strength/2;
                    setMonsterHP(prev => Math.max(prev - damage, 0));
                }
            }, 500);
        };


        const canJumpRef = useRef(true);

        useEffect(() => {

const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
        setCharX(x => Math.max(0, x - 20));
    } else if (e.key === 'ArrowRight') {
        setCharX(x => Math.min(x + 20, 800));
    } else if ((e.key === ' ' || e.key === 'ArrowUp') && !isJumping && canJumpRef.current) {
        setIsJumping(true);
        canJumpRef.current = false; // disable jump

        setCharY(y => y - 200);

        setTimeout(() => {
            setCharY(600);
            setIsJumping(false);
        }, 600);

        setTimeout(() => {
            canJumpRef.current = true;
        }, 700);
    }
};


        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isJumping]);


            // const petX = charX + 30;
            // const petY = charY + 30;


        useEffect(() => {
            const interval = setInterval(() => {
                if (!selectedPet) return;

                const projectile = {
                    id: Date.now(),
                    x: monsterX + 400, 
                    y: monsterY + 100,
                    dx: -1000, 
                    dy: 0    
                };

                setMonsterProjectiles(prev => [...prev, projectile]);
            }, 1000);

            return () => clearInterval(interval);
        }, [selectedPet]);

        useEffect(() => {
            const interval = setInterval(() => {
                setMonsterProjectiles(prev =>
                    prev.filter(p => {
                        const petBox = {
                            left: charX,
                            right: charX + 100,
                            top: charY,
                            bottom: charY + 300,
                        };

                        const projectileCenterX = p.x + 15; // Half of 30px width
                        const projectileCenterY = p.y + 15; // Half of 30px height

                        const hit =
                            projectileCenterX >= petBox.left &&
                            projectileCenterX <= petBox.right &&
                            projectileCenterY >= petBox.top &&
                            projectileCenterY <= petBox.bottom;


                        if (hit) {
                            setPetHP(prev => Math.max(prev - (Boss.attack/2 || 10), 0));
                            return false; 
                        }

                        return true; 
                    })
                );
            }, 100); 

            return () => clearInterval(interval);
        }, [charX, charY, Boss.attack]);




        useEffect(() => {
            const interval = setInterval(() => {
                setMonsterProjectiles(prev =>
                    prev
                        .map(p => ({
                            ...p,
                            x: p.x + p.dx * 0.02, 
                            y: p.y + p.dy * 0.02,
                        }))
                        .filter(p => p.x > 0) 
                );
            }, 20);

            return () => clearInterval(interval);
        }, []);
        

useEffect(() => {
    const user = auth.currentUser;

    const handleVictory = async () => {
        setResult("Victory");

        if (user) {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                const currentLevel = parseInt(levelId);
                const highestLevel = data.highestLevel || 1;

                if (currentLevel >= highestLevel) {
                    await setDoc(userRef, { highestLevel: currentLevel }, { merge: true });
                }
            }
        }

        setTimeout(() => navigate('/levelpathmap'), 2000);
    };

    if (petHP <= 0 && monsterHP>0 && result!="Victory") {
        setResult("Defeat");
        setTimeout(() => navigate('/levelpathmap'), 3000);
    } else if (monsterHP <= 0 && petHP>0 && result!="Defeat") {
        handleVictory();
    }
}, [petHP, monsterHP, navigate, levelId]);



    useEffect(() => {
        if (!selectedPet) return;

        const interval = setInterval(() => {
            setPetHP(prev => {
                if (prev >= 100) return 100; // cap HP at 100
                const healing = selectedPet.healing || 3;
                return Math.min(prev + healing, 100);
            });
        }, 2000); 

        return () => clearInterval(interval);
    }, [selectedPet]);


    return(
        <div className="battle-page" onClick={handleAttack}>

            <img ref={bossRef} className="boss-img" src={Boss.image} alt={Boss.name} />  

            <div style={{ position: 'absolute', left: `${monsterX+500}px`, top: `${monsterY - 400}px` }}>
                <HPBar current={monsterHP} max={Boss.hp} />
            </div>

            {selectedPet && (
                <div style={{ position: 'absolute', left: `${charX}px`, top: `${charY - 20}px` }}>
                    <HPBar current={petHP} max={100} />
                </div>
            )}

            {selectedPet && (
            <img
                className="pet-fight"
                src={selectedPet.image}
                alt={selectedPet.name}
                style={{
                position: 'absolute',
                left: `${charX}px`,
                top: `${charY}px`,
                width: '60px'
                }}
            />
            )}

            {projectiles.map(p => (
            <div
                key={p.id}
                className="projectile"
                style={{
                top: p.top,
                left: p.left,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`
                }}
            />
            ))}

            {monsterProjectiles.map(p => (  
                <div
                    key={p.id}
                    className="monster-projectile"
                    style={{
                        position: 'absolute',
                        top: p.y,
                        left: p.x,
                        width: '30px',
                        height: '30px',
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        animation: `moveProjectile 0.5s linear forwards`,
                        '--dx': `${p.dx}px`,
                        '--dy': `${p.dy}px`,
                    }}
                />
            ))}

            {result && (
                <div className="battle-result">
                    {result}
                </div>
            )}

        </div>
    );
}

export default Battle;