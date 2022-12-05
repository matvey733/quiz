import { formUpdate } from "../components/functions";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

export default function StartScreen(props) {
    const { numberOfQuestions, category, difficulty, type } = props.formData
    
    return (
        <>
            <h1>Quiz</h1>
            <form className="settings">
                <div className="setting">
                    <label htmlFor="numberOfQuestions">Number of Questions</label>
                    <input
                        type="number"
                        className="form-control"
                        name="numberOfQuestions"
                        value={numberOfQuestions}
                        onChange={ev => formUpdate(ev, props.setFormData)}
                        placeholder="10"
                        max="50"
                        min="1"
                    />
                </div>

                <div className="setting">
                    <label htmlFor="category">Category</label>
                    <select
                        className="form-select"
                        name="category"
                        onChange={ev => formUpdate(ev, props.setFormData)}
                        value={category}
                    >
                        <option value="any">Any category</option>
                        <option value="9">General knowledge</option>
                        <option value="17">Science and nature</option>
                        <option value="18">Computers</option>
                        <option value="28">Vehicles</option>
                    </select>
                </div>

                <div className="setting">
                    <label htmlFor="difficulty">Difficulty</label>
                    <select
                        className="form-select"
                        name="difficulty"
                        onChange={ev => formUpdate(ev, props.setFormData)}
                        value={difficulty}
                    >
                        <option value="any">Any difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div className="setting">
                    <label htmlFor="type">Type</label>
                    <select
                        className="form-select"
                        name="type"
                        onChange={ev => formUpdate(ev, props.setFormData)}
                        value={type}
                    >
                        <option value="any">Any type</option>
                        <option value="multiple">Multiple choice</option>
                        <option value="boolean">True/False</option>
                    </select>
                </div>
            </form>
            <Link to="/quiz">
                <button
                    className="btn btn-primary fullwidth"
                >
                    Start
                </button>
            </Link>
        </>
    )
}