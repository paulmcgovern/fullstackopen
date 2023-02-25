
const StatisticsLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({good, neutral, bad, naMsg}) => {

    let total = good + neutral + bad

    if(total > 0){

        let goodPct = (good / total * 100).toFixed(2)

        return ( 
            <table>
                <tbody>
                    <StatisticsLine text="good" value={good} />
                    <StatisticsLine text="neutral" value={neutral} />
                    <StatisticsLine text="bad" value={bad} />
                    <StatisticsLine text="all" value={total} />
                    <StatisticsLine text="average" value={total} />
                    <StatisticsLine text="positive" value={goodPct + " %"} />
                </tbody>
            </table>
        )
    } 
    
    return (<p>{naMsg}</p>)
}

export default Statistics
