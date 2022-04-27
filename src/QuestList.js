import { questTypeNames } from "./appMeta";
import { addDoc, collection, Timestamp } from "@firebase/firestore";
import { db } from "./firebase";
import { userPath } from "./auth";
import { useState } from "react";

function QuestList(props) {
    const questListItems = props.questIds.map((id) => (
        <button
            key={id}
            className={id === props.questIdOnFocus ? "active" : null}
            onClick={() => props.setQuestIdOnFocus(id)}
        >
            {props.activeQuests[id].title
                ? props.activeQuests[id].title
                : "New Quest"}
        </button>
    ));

    const addEmptyQuest = () => {
        const currentTime = Timestamp.now();
        addDoc(collection(db, userPath(), "active"), {
            type: props.type,
            title: "",
            description: "",
            note: "",
            dateAdded: currentTime,
            dateModified: currentTime,
            dateActive: currentTime,
            dateExpire: null,
            prerequisite: [],
        }).then((docRef) => props.setQuestIdOnFocus(docRef.id));
    };

    const [fold, setFold] = useState(false);
    const toggleFold = () => {
        setFold(!fold);
    };

    return (
        <div className="QuestList">
            <div className="QuestListTitleBar">
                <div className="QuestListTitle">
                    <button onClick={toggleFold}>
                        <div className="title">
                            {questTypeNames[props.type]}
                        </div>
                    </button>
                </div>
                <div className="QuestListTools">
                    {!fold && (
                        <button onClick={addEmptyQuest}>&nbsp;+&nbsp;</button>
                    )}
                </div>
            </div>
            <div className="QuestListItems">{!fold && questListItems}</div>
        </div>
    );
}

export default QuestList;
