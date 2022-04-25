import "./App.css";
import { useState, useEffect } from "react";
import { auth } from "./auth";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { questTypes } from "./appMeta";
import QuestPanel from "./QuestPanel";
import Navbar from "./Navbar";
import QuestDetailView from "./QuestDetailView";

function App() {
    // load logged in user
    const [user, setUser] = useState(auth.currentUser);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
        return unsubscribe;
    }, []);

    // get all active quests
    const [activeQuests, setActiveQuests] = useState({});
    useEffect(() => {
        if (user) {
            const unsubscribe = onSnapshot(
                query(collection(db, "active")),
                (querySnapshot) => {
                    const allDocs = {};
                    querySnapshot.forEach((doc) => {
                        allDocs[doc.id] = doc.data();
                    });
                    setActiveQuests(allDocs);
                }
            );
            return unsubscribe;
        }
    }, [user]);

    // assign quests to quest panels
    const questPanels = () => {
        const questIdByType = {};
        questTypes.forEach((type) => {
            questIdByType[type] = [];
        });
        for (var id in activeQuests) {
            const quest = activeQuests[id];
            questIdByType[quest.type].push(id);
        }
        return questTypes.map((type) => (
            <li key={type}>
                <QuestPanel
                    type={type}
                    activeQuests={activeQuests}
                    questIds={questIdByType[type]}
                    questIdOnFocus={questIdOnFocus}
                    setQuestIdOnFocus={setQuestIdOnFocus}
                />
            </li>
        ));
    };

    // store and pass the focusing quest id to detailed view
    const [questIdOnFocus, setQuestIdOnFocus] = useState(null);

    return (
        <div className="App">
            <Navbar user={user} />
            {user ? (
                <div className="QuestContainer">
                    <div className="QuestOverview">
                        <ul>{questPanels()}</ul>
                    </div>
                    {questIdOnFocus ? (
                        <QuestDetailView
                            activeQuests={activeQuests}
                            questIdOnFocus={questIdOnFocus}
                            setQuestIdOnFocus={setQuestIdOnFocus}
                        />
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

export default App;
