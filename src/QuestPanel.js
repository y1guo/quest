import "./QuestPanel.css";
import { questTypeNames } from "./appMeta";
import { addDoc, collection, Timestamp } from "@firebase/firestore";
import { db } from "./firebase";
import { useState } from "react";

function QuestPanel(props) {
    const questList = () => {
        return props.questIds.map((id) => (
            <li key={id}>
                <button
                    className={id === props.questIdOnFocus ? "active" : null}
                    onClick={() => props.setQuestIdOnFocus(id)}
                >
                    {props.activeQuests[id].title}
                </button>
            </li>
        ));
    };

    const addEmptyQuest = () => {
        const currentTime = Timestamp.now();
        addDoc(collection(db, "active"), {
            type: props.type,
            title: "new quest",
            description: "",
            note: "",
            dateAdded: currentTime,
            dateModified: currentTime,
            dateActive: currentTime,
            dateExpire: null,
            dependency: [],
        });
    };

    const [fold, setFold] = useState(false);
    const toggleFold = () => {
        setFold(!fold);
    };

    return (
        <div className="QuestPanel">
            <ul className="QuestPanelTitle">
                <li>
                    <button onClick={toggleFold}>
                        <h3>{questTypeNames[props.type]}</h3>
                    </button>
                </li>
                {fold ? null : (
                    <li>
                        <button onClick={addEmptyQuest}>&nbsp;+&nbsp;</button>
                    </li>
                )}
            </ul>
            {fold ? null : <ol>{questList()}</ol>}
        </div>
    );
}

export default QuestPanel;
