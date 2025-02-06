import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it">
            <head>
                <title>Test Politico</title>
            </head>
            <body className={inter.className}>
                <header style={{ padding: "15px", backgroundColor: "#333", color: "white", textAlign: "center" }}>
                    <nav style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        <a href="/spiegazioni" style={{ color: "white", textDecoration: "none" }}>Spiegazioni</a>
                        <a href="/informazioni" style={{ color: "white", textDecoration: "none" }}>Informazioni</a>
                        <a href="/risultati-medi" style={{ color: "white", textDecoration: "none" }}>Risultati Medi</a>
                    </nav>
                </header>
                <main style={{ padding: "20px", textAlign: "center" }}>
                    {children}
                </main>
            </body>
        </html>
    );
}
