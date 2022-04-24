import React from "react";
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

class NewQuest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick() {
        const currentTime = Timestamp.now();
        try {
            const docRef = await addDoc(collection(db, "active"), {
                id: null,
                type: this.state.type,
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

    render() {
        return (
            <div className="newQuest">
                <button onClick={this.handleClick}>+</button>
            </div>
        );
    }
}

class Quest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quest: props.quest,
            questsId: props.questsId,
            modify: false,
        };

        this.handleModify = this.handleModify.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleModify() {
        this.setState({
            modify: true,
        });
    }

    async handleSave() {
        const quest = this.state.quest;
        quest.dateModified = Timestamp.now();
        try {
            await setDoc(doc(db, "active", quest.id), quest);
            this.setState({
                modify: false,
            });
            console.log("Document saved with ID: ", quest.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    handleCancel() {
        this.props.reload();
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    textarea(key) {
        const handleChange = (event) => {
            const quest = this.state.quest;
            quest[key] = event.target.value;
            this.setState(quest);
        };
        return (
            <textarea
                type="text"
                name={key}
                value={this.state.quest[key]}
                onChange={handleChange}
            ></textarea>
        );
    }

    select(key) {
        const handleChange = (event) => {
            const quest = this.state.quest;
            quest[key] = event.target.value;
            this.setState(quest);
        };
        return (
            <select
                multiple={true}
                value={this.state.quest[key]}
                onChange={handleChange}
            >
                <option value="grapefruit">Grapefruit</option>
                <option value="lime">Lime</option>
                <option value="coconut">Coconut</option>
                <option value="mango">Mango</option>
            </select>
        );
    }

    render() {
        if (this.state.modify) {
            return (
                <div className="quest">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Title:
                            {this.textarea("title")}
                        </label>
                        <label>
                            Description:
                            {this.textarea("description")}
                        </label>
                        <label>
                            Dependency:
                            {this.select("dependency")}
                        </label>
                    </form>
                    <button onClick={this.handleCancel}>cancel</button>
                    <button onClick={this.handleSave}>save</button>
                </div>
            );
        } else {
            return (
                <div className="quest">
                    <h5>{this.state.quest.title}</h5>
                    <p>{this.state.quest.description}</p>
                    <p>Depending on:{this.state.quest.dependency}</p>
                    <p>
                        {this.state.quest.dateModified
                            .toDate()
                            .toLocaleString()}
                    </p>
                    <button onClick={this.handleModify}>mod</button>
                </div>
            );
        }
    }
}

class QuestPanel extends React.Component {
    render() {
        const questsId = this.props.quests.map((quest) => quest.id);
        const listItems = this.props.quests
            .filter((quest) => {
                return quest.type === this.props.type;
            })
            .map((quest) => (
                <li key={quest.id}>
                    <Quest
                        quest={quest}
                        reload={this.props.reload}
                        questsId={questsId}
                    />
                </li>
            ));
        // console.log(this.state.type, listItems);
        return (
            <div className="QuestPanel">
                <h3>{this.props.title}</h3>
                <ol>{listItems}</ol>
                <NewQuest type={this.props.type} />
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            quests: [],
            unsubscribe: null,
            updatedTime: Timestamp.now(),
        };

        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.fetchQuest = this.fetchQuest.bind(this);
    }

    handleLogIn() {
        logIn((user) => {
            this.setState({
                user: user,
            });
            this.fetchQuest();
        });
    }

    handleLogOut() {
        this.state.unsubscribe();
        logOut(() => {
            this.setState({
                user: null,
            });
        });
    }

    async fetchQuest() {
        if (this.state.unsubscribe) {
            this.state.unsubscribe();
        }

        try {
            const q = query(collection(db, "active"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const quests = [];
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const quest = doc.data();
                    quest.id = doc.id;
                    quests.push(quest);
                });
                this.setState({
                    quests: [...quests],
                });
            });

            this.setState({
                unsubscribe: unsubscribe,
                updatedTime: Timestamp.now(),
            });

            console.log("reloaded");
        } catch (e) {
            console.error("Error fetchQuest! ", e);
        }
    }

    render() {
        if (!this.state.user) {
            return (
                <div className="App">
                    <header className="App-header">
                        <button onClick={this.handleLogIn}>log in</button>
                    </header>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <header className="App-header">
                        <p>
                            Last Update:{" "}
                            {this.state.updatedTime.toDate().toLocaleString()}
                        </p>
                        <button onClick={this.handleLogOut}>log out</button>
                        <QuestPanel
                            title="main quests"
                            type="main"
                            quests={this.state.quests}
                            reload={this.fetchQuest}
                        />
                        <QuestPanel
                            title="side quests"
                            type="side"
                            quests={this.state.quests}
                            reload={this.fetchQuest}
                        />
                        <QuestPanel
                            title="daily quests"
                            type="daily"
                            quests={this.state.quests}
                            reload={this.fetchQuest}
                        />
                        <QuestPanel
                            title="optional quests"
                            type="optional"
                            quests={this.state.quests}
                            reload={this.fetchQuest}
                        />
                    </header>
                </div>
            );
        }
    }
}

export default App;
