import "./Quest.css";
import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { questTypes } from "./appMeta";
import QuestList from "./QuestList";
import QuestDetailView from "./QuestDetailView";
import { userPath } from "./auth";

function QuestListView(props) {
    const questIdByType = {};
    questTypes.forEach((type) => {
        questIdByType[type] = [];
    });
    for (var id in props.activeQuests) {
        const quest = props.activeQuests[id];
        questIdByType[quest.type].push(id);
    }
    return (
        <div className="QuestListView">
            {questTypes.map((type) => (
                <QuestList
                    key={type}
                    type={type}
                    activeQuests={props.activeQuests}
                    questIds={questIdByType[type]}
                    questIdOnFocus={props.questIdOnFocus}
                    setQuestIdOnFocus={props.setQuestIdOnFocus}
                ></QuestList>
            ))}
        </div>
    );
}

function Quest() {
    // get all active quests
    const [activeQuests, setActiveQuests] = useState({});
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, userPath(), "active")),
            (querySnapshot) => {
                const allDocs = {};
                querySnapshot.forEach((doc) => {
                    allDocs[doc.id] = doc.data();
                });
                setActiveQuests(allDocs);
            }
        );
        return unsubscribe;
    }, []);

    // store and pass the focusing quest id to detailed view
    const [questIdOnFocus, setQuestIdOnFocus] = useState(null);

    return (
        <div className="Quest">
            <QuestListView
                activeQuests={activeQuests}
                questIdOnFocus={questIdOnFocus}
                setQuestIdOnFocus={setQuestIdOnFocus}
            ></QuestListView>
            {questIdOnFocus && (
                <QuestDetailView
                    activeQuests={activeQuests}
                    questIdOnFocus={questIdOnFocus}
                    setQuestIdOnFocus={setQuestIdOnFocus}
                ></QuestDetailView>
            )}
        </div>
    );
}

export default Quest;
