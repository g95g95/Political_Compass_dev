"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import * as THREE from "three";

export default function Sphere3D() {
    const mountRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!mountRef.current || mountRef.current.childNodes.length > 0) return;

        // Creazione della scena
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);
        camera.position.z = 3;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 500);
        mountRef.current.appendChild(renderer.domElement);

        // Luci
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Sfera principale
        const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: "#4d8ab5",
            metalness: 0.3,
            roughness: 0.2,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        // Ruotiamo la sfera di 90° sull'asse Y
        sphere.rotation.y = Math.PI / 2;

        // **Punto sulla sfera con alta emissività**
        const pointGeometry = new THREE.SphereGeometry(0.07, 32, 32);
        const pointMaterial = new THREE.MeshBasicMaterial({ depthTest: false });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        scene.add(point);

        // Recuperiamo i parametri dalla query string
        let x = Number(searchParams.get("x")) || 0;
        let y = Number(searchParams.get("y")) || 0;
        let z = Number(searchParams.get("z")) || 0;

        // **Normalizzazione per garantire che il punto sia sempre sulla superficie**
        const magnitude = Math.sqrt(x * x + y * y + z * z) || 1;
        x /= magnitude;
        y /= magnitude;
        z /= magnitude;

        // Calcolo degli angoli sferici
        const theta = Math.acos(Math.max(-1, Math.min(1, y))); // Angolo verticale
        const phi = Math.atan2(z, x); // Angolo orizzontale

        // Coordinate cartesiane sulla sfera (raggio = 1)
        const posX = Math.sin(theta) * Math.cos(phi);
        const posY = Math.cos(theta);
        const posZ = Math.sin(theta) * Math.sin(phi);

        point.position.set(posX, posY, posZ);

        // **CALCOLO DEL COLORE IN BASE ALLA VISIBILITÀ**
        const pointVector = new THREE.Vector3(posX, posY, posZ).normalize(); // Direzione del punto
        const cameraVector = new THREE.Vector3(0, 0, 1).normalize(); // Direzione della telecamera

        // Dot product tra direzione del punto e direzione della camera
        const visibilityFactor = pointVector.dot(cameraVector);

        // **Mappiamo il valore tra bianco e rosso**
        // Se il punto è visibile, sarà rosso, altrimenti bianco
        const redAmount = Math.max(0, visibilityFactor); // Se è visibile, sarà rosso
        const whiteAmount = 1 - redAmount; // Se è dietro, sarà più bianco

        const mixedColor = new THREE.Color(
            redAmount * 1 + whiteAmount * 1, // R (Bianco + Rosso)
            whiteAmount * 1, // G (Solo Bianco)
            whiteAmount * 1  // B (Solo Bianco)
        );

        pointMaterial.color = mixedColor;

        // **ANIMAZIONE**
        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup per evitare il doppio rendering
        return () => {
            while (mountRef.current?.firstChild) {
                mountRef.current.removeChild(mountRef.current.firstChild);
            }
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>Visualizzazione della Sfera</h2>
            <div ref={mountRef} style={{ width: "500px", height: "500px" }} />
        </div>
    );
}
