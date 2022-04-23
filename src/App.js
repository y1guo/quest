import React from "react";
import "./App.css";
import { db } from "./init-fb";
import { logIn, logOut } from "./auth";
// import { fsAddDoc, fsGetDocs } from "./fb-demo";
import {
    collection,
    query,
    where,
    doc,
    addDoc,
    getDocs,
} from "firebase/firestore";
import { delay } from "q";

class Quest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quest: props.quest,
        };
    }

    render() {
        return <p>{this.state.quest.title}</p>;
    }
}

class QuestPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            type: props.type,
            quests: [],
        };
    }

    componentDidMount() {
        this.fetchQuest();
    }

    async fetchQuest() {
        const q = query(
            collection(db, "active"),
            where("type", "==", this.state.type)
        );

        const querySnapshot = await getDocs(q);

        const quests = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const quest = doc.data();
            quest.id = doc.id;
            quests.push(quest);
        });

        this.setState({
            quests: quests,
        });
    }

    render() {
        console.log("QuestPanel updated:", this.state);
        const listItems = this.state.quests.map((quest) => (
            <li key={quest.id}>
                <Quest quest={quest} />
            </li>
        ));
        return (
            <div className="QuestPanel">
                <h3>{this.state.title}</h3>
                <ol>{listItems}</ol>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };

        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleLogIn() {
        logIn((user) => {
            this.setState({
                user: user,
            });
        });
    }

    handleLogOut() {
        logOut(() => {
            this.setState({
                user: null,
            });
        });
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
                        <h1>Hello {this.state.user.displayName}!</h1>
                        <button onClick={this.handleLogOut}>log out</button>
                        <QuestPanel title="主线任务" type="main" />
                        <QuestPanel title="支线任务" type="side" />
                        <QuestPanel title="每日任务" type="daily" />
                        <QuestPanel title="可选任务" type="optional" />
                    </header>
                </div>
            );
        }
    }
}

export default App;
