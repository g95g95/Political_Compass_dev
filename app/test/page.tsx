"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Answer {
    AnswerText: string;
    AnswerValue: number;
    AnswerSign: number;
}

interface Question {
    QuestionText: string;
    Answers: Answer[];
    QuestionType: string;
}

export default function Test() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState<{ x: number; y: number; z: number }[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("/PCQuestions.json")
            .then((res) => res.json())
            .then((data) => {
                setQuestions(data.Questions);
                setResponses(Array(data.Questions.length).fill({ x: 0, y: 0, z: 0 }));
            });
    }, []);

    useEffect(() => {
        if (currentQuestion === Math.floor(questions.length / 2)) {
            setShowPopup(true);
        }
    }, [currentQuestion, questions.length]);

    useEffect(() => {
        if (currentQuestion >= questions.length) {
            const timer = setTimeout(() => navigateToResults(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [currentQuestion, questions.length]);

    const handleAnswer = (answer: Answer) => {
        setResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            const questionType = questions[currentQuestion]?.QuestionType;

            if (questionType) {
                updatedResponses[currentQuestion] = {
                    ...updatedResponses[currentQuestion],
                    [questionType === "L" ? "y" : questionType === "E" ? "x" : "z"]:
                        answer.AnswerValue * answer.AnswerSign
                };
            }

            return updatedResponses;
        });

        setCurrentQuestion((prev) => prev + 1);
    };

    const navigateToResults = (fromMidTest: boolean) => {
        // Sommiamo i valori X, Y e Z
        const totalX = responses.map(r => r.x || 0).reduce((acc, x) => acc + x, 0);
        const totalY = responses.map(r => r.y || 0).reduce((acc, y) => acc + y, 0);
        const totalZ = responses.map(r => r.z || 0).reduce((acc, z) => acc + z, 0);

        // Contiamo quante domande appartengono a ogni asse
        const totalQuestionsX = questions.filter(q => q.QuestionType === "E").length || 1;
        const totalQuestionsY = questions.filter(q => q.QuestionType === "L").length || 1;
        const totalQuestionsZ = questions.filter(q => q.QuestionType === "Z").length || 1;

        // Normalizziamo ogni valore in base al numero di domande di quel tipo
        const normX = totalX / totalQuestionsX;
        const normY = totalY / totalQuestionsY;
        const normZ = totalZ / totalQuestionsZ;

        // Reindirizza ai risultati con i valori normalizzati
        router.push(`/result?x=${normX}&y=${normY}&z=${normZ}&fromMidTest=${fromMidTest}`);
    };

    if (questions.length === 0) return <p style={{ textAlign: "center", fontSize: "18px" }}>Caricamento...</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center", padding: "20px" }}>
            {currentQuestion < questions.length ? (
                <>
                    <h2>{questions[currentQuestion].QuestionText}</h2>

                    {questions[currentQuestion].Answers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(answer)}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                marginBottom: "5px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
                        >
                            {answer.AnswerText}
                        </button>
                    ))}

                    <div style={{ marginTop: "20px" }}>
                        {currentQuestion > 0 && (
                            <button
                                onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                                style={{
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginRight: "10px"
                                }}
                            >
                                ← Indietro
                            </button>
                        )}

                        {currentQuestion >= Math.floor(questions.length / 2) && (
                            <button
                                onClick={() => setShowPopup(true)}
                                style={{
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                Vai al risultato →
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div>
                    <h2>Test completato!</h2>
                    <p>Reindirizzamento ai risultati...</p>
                </div>
            )}

            {showPopup && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow: "0px 0px 20px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    textAlign: "center"
                }}>
                    <h3 style={{ marginBottom: "20px" }}>Vuoi vedere il risultato intermedio?</h3>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button
                            onClick={() => navigateToResults(true)}
                            style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            Mostra Risultato
                        </button>
                        <button
                            onClick={() => setShowPopup(false)}
                            style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            Continua Test
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
