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
                setResponses(new Array(data.Questions.length).fill({ x: 0, y: 0, z: 0 }));
            });
    }, []);

    useEffect(() => {
        if (currentQuestion === Math.floor(questions.length / 2)) {
            setShowPopup(true);
        }
    }, [currentQuestion, questions.length]);

    const handleAnswer = (answer: Answer) => {
        setResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            const questionType = questions[currentQuestion].QuestionType;

            switch (questionType) {
                case "L":
                    updatedResponses[currentQuestion] = {
                        ...updatedResponses[currentQuestion],
                        y: answer.AnswerValue * answer.AnswerSign
                    };
                    break;
                case "E":
                    updatedResponses[currentQuestion] = {
                        ...updatedResponses[currentQuestion],
                        x: answer.AnswerValue * answer.AnswerSign
                    };
                    break;
                case "Z":
                    updatedResponses[currentQuestion] = {
                        ...updatedResponses[currentQuestion],
                        z: answer.AnswerValue * answer.AnswerSign
                    };
                    break;
            }
            return updatedResponses;
        });

        setCurrentQuestion((prev) => prev + 1);
    };

    const navigateToResults = (fromMidTest: boolean) => {
        const totalX = responses.reduce((acc, r) => acc + r.x, 0);
        const totalY = responses.reduce((acc, r) => acc + r.y, 0);
        const totalZ = responses.reduce((acc, r) => acc + r.z, 0);

        router.push(`/result?x=${totalX}&y=${totalY}&z=${totalZ}&fromMidTest=${fromMidTest}`);
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