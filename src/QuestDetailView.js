import "./QuestDetailView.css";

function QuestDetailView(props) {
    const quest = props.activeQuests[props.questIdOnFocus];

    return (
        <div className="QuestDetailView">
            <h3>{quest.title}</h3>
            <p>{quest.description}</p>
        </div>
    );
}

export default QuestDetailView;
