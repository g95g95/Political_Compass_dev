"use client"; // Abilita lo stato client-side
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const [name, setName] = useState("");
    const router = useRouter();

    return (
        <div style={{ maxWidth: "600px", margin: "auto", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
            {/* Titolo principale */}
            <h1 style={{ textAlign: "center", fontSize: "32px" }}>Test Politico</h1>

            {/* Form iniziale */}
            <form onSubmit={(e) => { e.preventDefault(); alert(`Benvenuto, ${name}!`); }}>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                    Inserisci il tuo nome per iniziare:
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Es. Mario Rossi"
                    style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "15px" }}
                />
                <button onClick={() => router.push("/test")} type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Inizia il test
                </button>
            </form>
        </div>
    );
}
