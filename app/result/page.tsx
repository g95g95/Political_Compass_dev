"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Result() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);
    const [fromMidTest, setFromMidTest] = useState(false);

    useEffect(() => {
        const totalX = Number(searchParams.get("x")) || 0;
        const totalY = Number(searchParams.get("y")) || 0;
        const totalZ = Number(searchParams.get("z")) || 0;
        const maxValue = Math.max(Math.abs(totalX), Math.abs(totalY));

        setX(maxValue !== 0 ? parseFloat((totalX / maxValue).toFixed(2)) : 0);
        setY(maxValue !== 0 ? parseFloat((totalY / maxValue).toFixed(2)) : 0);
        setZ(parseFloat(totalZ.toFixed(2)));
        setFromMidTest(searchParams.get("fromMidTest") === "true");
    }, [searchParams]);

    // Dati per il grafico cartesiano
    const data = [{ x, y }];

    return (
        <div style={{ maxWidth: "700px", margin: "auto", textAlign: "center", padding: "20px" }}>
            <h2>Risultati del Test Politico</h2>
            <p>Coordinate normalizzate:</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
                <li><strong>Socialismo / Capitalismo (X):</strong> {x}</li>
                <li><strong>Liberalismo / Autoritarismo (Y):</strong> {y}</li>
                <li><strong>Relazione con l'Establishment (Z):</strong> {z}</li>
            </ul>

            {/* Grafico cartesiano */}
            <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="x" domain={[-1, 1]} label={{ value: "Socialismo (-) ↔ Capitalismo (+)", position: "bottom" }} />
                        <YAxis type="number" dataKey="y" domain={[-1, 1]} label={{ value: "Liberalismo (+) ↔ Autoritarismo (-)", angle: -90, position: "left" }} />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter name="Posizione Politica" data={data} fill="red" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Bottone per visualizzare il grafico in coordinate polari */}
            <button
                onClick={() => router.push(`/result/sphere?x=${x}&y=${y}&z=${z}`)}
                style={{
                    marginTop: "20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Visualizza in Coordinate Polari
            </button>

            {fromMidTest && (
                <button
                    onClick={() => router.push("/test")}
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
                    Torna al Test
                </button>
            )}
        </div>
    );
}
