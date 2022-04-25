import { useState, useEffect } from "react";

function Clock(props) {
    //Here we reference our custom hook
    const date = useNewDate(new Date());

    return (
        <div className="Clock">
            <h2>
                {date.toDateString()} {date.toLocaleTimeString()}
            </h2>
        </div>
    );
}

///////////////////////////////////////////////
//Below we've created a custom reusable hook
//////////////////////////////////////////////

function useNewDate(currentDate) {
    const [date, setDate] = useState(currentDate);

    useEffect(() => {
        var timerID = setInterval(() => tick(), 1000);
        return function cleanup() {
            clearInterval(timerID);
        };
    });

    function tick() {
        setDate(new Date());
    }

    return date;
}

export default Clock;
