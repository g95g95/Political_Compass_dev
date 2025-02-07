"use client";
import React from "react";
import ReactMarkdown from "react-markdown";

const markdownContent = `
# Benvenuto nel Test Politico
Questo test politico ti aiuterà a capire la tua posizione su vari temi economici e sociali.

## Come Funziona?
- Ti verranno presentate una serie di domande.
- Le tue risposte determineranno la tua posizione su **tre assi politici**.
- Alla fine, potrai visualizzare il tuo **posizionamento grafico**.

## Cosa rappresentano gli assi?
1. **Asse X (Economia)** → Controllo statale vs. Mercato libero.
2. **Asse Y (Libertà/Indignazione)** → Progressismo vs. Tradizionalismo.
3. **Asse Z (Autoritarismo)** → Controllo statale vs. Libertà individuale.

---

## 📌 Nota
Questo test non è scientifico, ma offre una **buona panoramica delle tue inclinazioni politiche**.
`;

export default function Spiegazioni() {
    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", textAlign: "left" }}>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
    );
}
