import { useState } from "react";
import "./QuestDetailView.css";

function QuestDetailView(props) {
    const quest = props.activeQuests[props.questIdOnFocus];

    return (
        <div className="QuestDetailView">
            <div className="Title">
                <textarea
                    placeholder="Title"
                    value={quest.title}
                    style={{ "font-weight": "bold" }}
                ></textarea>
            </div>
            <div className="Description">
                <textarea
                    placeholder="Description"
                    value={quest.description}
                ></textarea>
            </div>
            <div className="Note">
                <textarea placeholder="Note" value={quest.note}></textarea>
            </div>
        </div>
    );
}

export default QuestDetailView;
