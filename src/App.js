import React, { useEffect, useState } from "react";
import "./App.css";
import { db } from "./init-fb";
import { logIn, logOut } from "./auth";
// import { fsAddDoc, fsGetDocs } from "./fb-demo";
import {
    collection,
    query,
    doc,
    addDoc,
    setDoc,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";

function NewQuest(props) {
    async function handleClick() {
        const currentTime = Timestamp.now();
        try {
            const docRef = await addDoc(collection(db, "active"), {
                id: null,
                type: props.type,
                title: "",
                description: "",
                note: "",
                dateAdded: currentTime,
                dateModified: currentTime,
                dateActive: currentTime,
                dateExpire: null,
                dependency: [],
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <div className="newQuest">
            <button onClick={handleClick}>+</button>
        </div>
    );
}

function Quest(props) {
    const [quest, setQuest] = useState(questCopy(props.quest));
    const [activeQuest, setActiveQuest] = useState(
        questListCopy(props.activeQuest)
    );
    const [modify, setModify] = useState(false);

    useEffect(() => {
        setQuest(questCopy(props.quest));
    }, [props.quest]);

    useEffect(() => {
        setActiveQuest(questListCopy(props.activeQuest));
    }, [props.activeQuest]);

    function handleModify() {
        setModify(true);
    }

    async function handleSave() {
        quest.dateModified = Timestamp.now();

        await setDoc(doc(db, "active", quest.id), quest);
        setModify(false);
        console.log("Document saved with ID: ", quest.id);
    }

    function handleCancel() {
        setModify(false);
        setQuest(questCopy(props.quest));
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    function questCopy(q) {
        return {
            id: q.id,
            type: q.type,
            title: q.title,
            description: q.description,
            note: q.note,
            dateAdded: q.dateAdded,
            dateModified: q.dateModified,
            dateActive: q.dateActive,
            dateExpire: q.dateExpire,
            dependency: [...q.dependency],
        };
    }

    function questListCopy(questList) {
        return questList.map((q) => questCopy(q));
    }

    function textarea(key) {
        const handleChange = (event) => {
            const newQuest = questCopy(quest);
            newQuest[key] = event.target.value;
            setQuest(newQuest);
        };
        return (
            <textarea
                type="text"
                name={key}
                value={quest[key]}
                onChange={handleChange}
            ></textarea>
        );
    }

    function select(key) {
        const handleChange = (event) => {
            const newQuest = questCopy(quest);
            newQuest[key] = event.target.value;
            setQuest(newQuest);
        };
        return (
            <select multiple={true} value={quest[key]} onChange={handleChange}>
                <option value="grapefruit">Grapefruit</option>
                <option value="lime">Lime</option>
                <option value="coconut">Coconut</option>
                <option value="mango">Mango</option>
            </select>
        );
    }

    if (modify) {
        return (
            <div className="quest">
                <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        {textarea("title")}
                    </label>
                    <label>
                        Description:
                        {textarea("description")}
                    </label>
                    <label>
                        Dependency:
                        {select("dependency")}
                    </label>
                </form>
                <button onClick={handleCancel}>cancel</button>
                <button onClick={handleSave}>save</button>
            </div>
        );
    } else {
        return (
            <div className="quest">
                <h5>{quest.title}</h5>
                <p>{quest.description}</p>
                <p>Depending on:{quest.dependency}</p>
                <p>{quest.dateModified.toDate().toLocaleString()}</p>
                <button onClick={handleModify}>mod</button>
            </div>
        );
    }
}

function QuestPanel(props) {
    const listItems = props.quests
        .filter((quest) => {
            return quest.type === props.type;
        })
        .map((quest) => (
            <li key={quest.id}>
                <Quest quest={quest} activeQuest={props.quests} />
            </li>
        ));
    // console.log(this.state.type, listItems);
    return (
        <div className="QuestPanel">
            <h3>{props.title}</h3>
            <ol>{listItems}</ol>
            <NewQuest type={props.type} />
        </div>
    );
}

function App() {
    const [user, setUser] = useState(null);
    const [quests, setQuests] = useState([]);
    const [updatedTime, setUpdateTime] = useState(Timestamp.now());
    var unsubscribe = null;

    function handleLogIn() {
        logIn((user) => {
            setUser(user);
            fetchQuest();
        });
    }

    function handleLogOut() {
        unsubscribe();
        logOut(() => {
            setUser(null);
        });
    }

    function fetchQuest() {
        if (unsubscribe) {
            unsubscribe();
        }

        const q = query(collection(db, "active"));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newQuests = [];
            console.log("in onsnapshot");
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const quest = doc.data();
                quest.id = doc.id;
                newQuests.push(quest);
            });
            setQuests([...newQuests]);
        });

        setUpdateTime(Timestamp.now());

        console.log("reloaded");
    }

    console.log("unsubscribe: ", unsubscribe);

    if (!user) {
        return (
            <div className="App">
                <header className="App-header">
                    <button onClick={handleLogIn}>log in</button>
                </header>
            </div>
        );
    } else {
        return (
            <div className="App">
                <header className="App-header">
                    <p>Last Update: {updatedTime.toDate().toLocaleString()}</p>
                    <button onClick={handleLogOut}>log out</button>
                    <QuestPanel
                        title="main quests"
                        type="main"
                        quests={quests}
                    />
                    <QuestPanel
                        title="side quests"
                        type="side"
                        quests={quests}
                    />
                    <QuestPanel
                        title="daily quests"
                        type="daily"
                        quests={quests}
                    />
                    <QuestPanel
                        title="optional quests"
                        type="optional"
                        quests={quests}
                    />
                </header>
            </div>
        );
    }
}

export default App;
