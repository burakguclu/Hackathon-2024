import "../css/QuizApp.css";
import { useState, useRef } from "react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from "react-toastify";
import keys from "../config/keys.json"

const QuizApp = () => {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const genAI = new GoogleGenerativeAI(keys.googleapi);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const getResponseForGivenPrompt = async () => {
        setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(
            `Generate a 10-question quiz with 4 answer options each, in the format: [{"question": "...", "option1": "...", "option2": "...", "option3": "...", "option4": "...", ans: (1-4)}] for topic ${inputValue}. Be careful with JSON Format.`
        );
        setInputValue('');

        const responseText = await result.response.text();

        try {
            let formattedResponse = responseText
                .replace(/Quiz Data: \*\*.*\*\*\s*/g, '')
                .replace(/```json|```/g, '')
                .trim();

            const parsedData = JSON.parse(formattedResponse);

            setQuizData(parsedData);
        } catch (error) {
            toast.error("Quiz verisi alınırken bir hata oluştu. Lütfen tekrar deneyiniz.");
        }
        setLoading(false);
    };

    if (quizData) {
        return <Quiz quizData={quizData} />;
    }

    return (
        <div className="quiz-upload-body">
            <div className="quiz-upload">
                <h1>Konu Seçme</h1>
                <div className="input-box">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Çalışmak istediğiniz konu başlığını giriniz"
                        className="input-box"
                    />
                </div>
                <button onClick={getResponseForGivenPrompt} className="btn btn-primary" disabled={loading}>
                    {loading ? "Sınav Hazırlanıyor..." : "Sınav Hazırla"}
                </button>
                {loading && (
                    <div className="hidden-text">
                        <p>Yapay zeka sizin için sorular hazırlıyor...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Quiz = ({ quizData }) => {
    let [index, setIndex] = useState(0);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);
    let [question, setQuestion] = useState(quizData[index]);

    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_array = [Option1, Option2, Option3, Option4];

    const checkAnswer = (e, ans) => {
        if (lock === false) {
            if (question.ans === ans) {
                e.target.classList.add("Doğru");
                setLock(true);
                setScore((prev) => prev + 1);
            } else {
                e.target.classList.add("Yanlış");
                setLock(true);
                option_array[question.ans - 1].current.classList.add("Doğru");
            }
        }
    };

    const nextQuestion = () => {
        if (lock === true) {
            if (index === quizData.length - 1) {
                setResult(true);
                return 0;
            }
            setIndex(++index);
            setQuestion(quizData[index]);
            setLock(false);
            option_array.map((option) => {
                option.current.classList.remove("Doğru");
                option.current.classList.remove("Yanlış");
                return null;
            });
        }
    };

    const resetQuiz = () => {
        setIndex(0);
        setQuestion(quizData[0])
        setScore(0);
        setLock(false);
        setResult(false);
    };

    return (
        <div className="quiz-body">
            <div className="quiz">
                <h1>Kısa Sınav</h1>
                <hr />
                {result ? (
                    <>
                        <h2>{quizData.length} sorunun {score} tanesine doğru cevap verdiniz.</h2>
                        <button onClick={resetQuiz}>Tekrar başla</button>
                    </>
                ) : (
                    <>
                        <h2>
                            {index + 1}. {question.question}
                        </h2>
                        <ul>
                            <li ref={Option1} onClick={(e) => checkAnswer(e, 1)}>
                                {question.option1}
                            </li>
                            <li ref={Option2} onClick={(e) => checkAnswer(e, 2)}>
                                {question.option2}
                            </li>
                            <li ref={Option3} onClick={(e) => checkAnswer(e, 3)}>
                                {question.option3}
                            </li>
                            <li ref={Option4} onClick={(e) => checkAnswer(e, 4)}>
                                {question.option4}
                            </li>
                        </ul>
                        <button onClick={nextQuestion}>Sonraki soru</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizApp;
