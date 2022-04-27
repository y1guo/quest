import { deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { userPath } from "./auth";
import { useEffect, useState } from "react";
import { questFieldNames } from "./appMeta";

function copyQuest(quest) {
    return {
        ...quest,
        prerequisite: [...quest.prerequisite],
    };
}

function Textarea(props) {
    const onChange = (event) => {
        const newQuest = copyQuest(props.quest);
        newQuest[props.field] = event.target.value;
        props.setQuest(newQuest);
    };

    return (
        <div className="Textarea textarea-wrapper">
            <textarea
                className={props.field}
                placeholder={questFieldNames[props.field]}
                value={props.quest[props.field]}
                onChange={onChange}
                onInput={(e) => {
                    e.target.style.height = "inherit";
                    e.target.style.height =
                        e.target.scrollHeight.toString() + "px";
                }}
            ></textarea>
        </div>
    );
}
// 'this.style.height = "";this.style.height = this.scrollHeight + "px"'

function QuestDetailView(props) {
    const [quest, setQuest] = useState(
        copyQuest(props.activeQuests[props.questIdOnFocus])
    );
    useEffect(() => {
        setQuest(copyQuest(props.activeQuests[props.questIdOnFocus]));
    }, [props.questIdOnFocus, props.activeQuests]);

    const onClickSave = () => {
        const newQuest = copyQuest(quest);
        newQuest.dateModified = Timestamp.now();
        setDoc(doc(db, userPath(), "active", props.questIdOnFocus), newQuest);
    };

    const onClickCancel = () => {
        setQuest(copyQuest(props.activeQuests[props.questIdOnFocus]));
    };

    const onClickTrash = () => {
        setDoc(
            doc(db, userPath(), "trash", props.questIdOnFocus),
            props.activeQuests[props.questIdOnFocus]
        )
            .then(() => {
                deleteDoc(doc(db, userPath(), "active", props.questIdOnFocus));
            })
            .then(() => {
                props.setQuestIdOnFocus(null);
            });
    };

    const onClickClose = () => {
        props.setQuestIdOnFocus(null);
    };

    return (
        <div className="QuestDetailView">
            <div className="QuestDetailTools">
                <button onClick={onClickSave}>Save</button>
                <button onClick={onClickCancel}>Cancel</button>
                <button onClick={onClickTrash}>Del</button>
                <button onClick={onClickClose}>&nbsp;X&nbsp;</button>
            </div>
            <div className="QuestDetail">
                <div className="Title">
                    <Textarea
                        quest={quest}
                        setQuest={setQuest}
                        field="title"
                    ></Textarea>
                </div>
                {/* <div className="Description"> */}
                <Textarea
                    quest={quest}
                    setQuest={setQuest}
                    field="description"
                ></Textarea>
                {/* </div> */}
                <div className="Note">
                    <Textarea
                        quest={quest}
                        setQuest={setQuest}
                        field="note"
                    ></Textarea>
                </div>
            </div>
        </div>
    );
}

export default QuestDetailView;
