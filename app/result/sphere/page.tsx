"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import { AmbientLight } from "three";

export default function Sphere3D() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);

    useEffect(() => {
        const totalX = Number(searchParams.get("x")) || 0;
        const totalY = Number(searchParams.get("y")) || 0;
        const totalZ = Number(searchParams.get("z")) || 0;
        const maxValue = Math.max(Math.abs(totalX), Math.abs(totalY), Math.abs(totalZ));

        setX(maxValue !== 0 ? parseFloat((totalX / maxValue).toFixed(2)) : 0);
        setY(maxValue !== 0 ? parseFloat((totalY / maxValue).toFixed(2)) : 0);
        setZ(maxValue !== 0 ? parseFloat((totalZ / maxValue).toFixed(2)) : 0);
    }, [searchParams]);

    // Convertiamo (x, y, z) in coordinate polari (r, theta, phi)
    const r = 1; // Raggio della sfera
    const theta = Math.acos(y); // Angolo tra il punto e l'asse Y
    const phi = Math.atan2(z, x); // Angolo tra il punto e il piano XY

    // Convertiamo le coordinate polari in coordinate cartesiane per la posizione del punto
    const posX = r * Math.sin(theta) * Math.cos(phi);
    const posY = r * Math.cos(theta);
    const posZ = r * Math.sin(theta) * Math.sin(phi);

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h2>Visualizzazione in Coordinate Polari</h2>

            {/* Sfera 3D con il punto */}
            <Canvas style={{ width: "500px", height: "500px" }}>
                <AmbientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} />
                <OrbitControls enableZoom={false} />

                {/* Sfera principale */}
                <Sphere args={[1, 32, 32]}>
                    <meshStandardMaterial color="lightblue" wireframe />
                </Sphere>

                {/* Punto sulla sfera */}
                <Sphere args={[0.05, 16, 16]} position={[posX, posY, posZ]}>
                    <meshStandardMaterial color="red" />
                </Sphere>
            </Canvas>


            <button
                onClick={() => router.push("/result")}
                style={{
                    marginTop: "20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Torna ai Risultati
            </button>
        </div>
    );
}
