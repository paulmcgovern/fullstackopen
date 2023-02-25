
const Button = ({handler, text}) => <button onClick={handler}>{text}</button>


const Buttons = ({good, neutral, bad}) => {

    return (
        <div>
            <Button handler={good} text="Good" />
            <Button handler={neutral} text="Neutral" />
            <Button handler={bad} text="Bad" />                        
        </div>)
}

export default Buttons
