import React, { useState, useEffect, createContext } from "react";
import { Link } from "react-router-dom";
import { htmlDecode, endQuiz } from "../components/functions";
import Question from "../components/Question";
import "bootstrap/dist/css/bootstrap.min.css"

export const ShowAnswersContext = createContext();

export default function Quiz(props) {
    const [questionsData, setQuestionsData] = useState();
    const [showAnswers, setShowAnswers] = useState(false);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState({});
    const [didntAnswerAllPopupShow, setDidntAnswerAllPopupShow] = useState(false);

    let hasAnsweredAll;
    if (Object.values(answered).every(item => item === true)) {
        hasAnsweredAll = true
    }
    else hasAnsweredAll = false;

    useEffect(() => {
        if (questionsData) {
            // used to determine whether the user has answered all the questions
            // would look like:
            // {0: false, 1: false, 2: true, 3: false}
            let listOfAnswered = {}
            for (let i in questionsData) {
                listOfAnswered[i] = false
            }

            setAnswered(listOfAnswered);
        }
    }, [questionsData])

    useEffect(() => {
        // generate api url based on user input
        const {numberOfQuestions, category, difficulty, type} = props.formData
        let fetchUrl = "https://opentdb.com/api.php?"

        // number of questions
        if (numberOfQuestions) fetchUrl += `amount=${numberOfQuestions}`
        // if not provided, default to 10
        else fetchUrl += "amount=10"

        // category
        if (category !== "any") fetchUrl += `&category=${category}`

        // difficulty
        if (difficulty !== "any") fetchUrl += `&difficulty=${difficulty}`

        // type
        if (type !== "any") fetchUrl += `&type=${type}`

        fetch(fetchUrl)
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(data => {
                setQuestionsData(data.results.map(item => {
                    // create an array of all answers, where the correct answer is put at a random index
                    let allAnswers = item.incorrect_answers.map(item => ({
                        answer: item,
                        isCorrect: false,
                        isSelected: false
                    }));
                    const randomIndex = Math.floor(Math.random() * (allAnswers.length + 1));
                    allAnswers.splice(
                        randomIndex,
                        0,
                        {
                            answer: item.correct_answer,
                            isCorrect: true,
                            isSelected: false,
                        }
                    );

                    return {
                        question: htmlDecode(item.question),
                        allAnswers: allAnswers
                    }
                }))
            })
    }, [])

    

    let questionsNodes;
    let buttons;

    // if the questions data is received, fill questionsNodes with question components and fill buttonsAndScore with some data as well
    // otherwise, set questionsNodes to "Loading...", and leave buttonsAndScore undefined
    if (questionsData) {
        questionsNodes = questionsData.map((item, index) => (
            <Question 
                question={item.question}
                allAnswers={item.allAnswers}
                setAnswered={setAnswered}
                setScore={setScore}
                id={index}
                key={index}
            />
        ))
        questionsNodes = (
            <ShowAnswersContext.Provider value={showAnswers}>
                {questionsNodes}
            </ShowAnswersContext.Provider>
        )

        buttons = (
            <>
                {
                    showAnswers
                    ?
                    <>
                        <Link to="/">
                            <button
                                className={
                                    "btn btn-primary fullwidth"
                                }
                            >
                                New Quiz
                            </button>
                        </Link>
                    </>
                    :
                    <button
                        className={
                            "btn btn-primary fullwidth"
                            + (!hasAnsweredAll ? " disabled" : "")
                        }
                        onClick={
                            () => endQuiz(
                                setShowAnswers,
                                hasAnsweredAll,
                                setDidntAnswerAllPopupShow,
                                answered,
                                setScore
                            )
                        }
                    >
                        Check Answers
                    </button>
                }
            </>
        )
    }
    else {
        questionsNodes = <p>Loading...</p>
    }

    return (
        <>
            <div className={"popup" + (didntAnswerAllPopupShow ? " active" : "")}>
                <p>You have to answer all the questions first!</p>
            </div>

            <h1>Quiz</h1>

            <div className={"questions" + (showAnswers ? " answers-disabled" : "")}>
                {questionsNodes}
            </div>

            <div className="score">
                {
                    showAnswers
                    &&
                    <p>You scored {score}/{questionsData.length} correct answers!</p>
                }
            </div>

            <div className="buttons fullwidth">
                {buttons}
            </div>
        </>
    )
}