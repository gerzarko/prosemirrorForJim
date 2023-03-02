import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import "./index.css";

const editorContainer = document.getElementById("editor");
const insertButton = document.getElementById("insert");
const logStateButton = document.getElementById("log-state-button");
const stateLogContainer = document.getElementById("state-log");

let state = EditorState.create({
  schema,
  plugins: [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    keymap(baseKeymap),
  ],
});

let view = new EditorView(editorContainer, {
  state,

  dispatchTransaction(transaction) {
    const content = transaction.doc.content;

    let newState = view.state.apply(transaction);
    view.updateState(newState);
  },
});

insertButton.addEventListener("click", () => {
  console.log("insertion");
  const tr = view.state.tr.insertText("hi");
  view.dispatch(tr);
});

logStateButton.addEventListener("click", () => {
  const state = view.state;
  const doc = state.doc;
  const content = doc.textContent;
  const stateData = {
    content,
    doc,
    marks: doc.marks,
    storedMarks: state.storedMarks,
    json: JSON.stringify(doc.toJSON(), null, 2),
  };
  const stateLogHtml = Object.keys(stateData)
    .map(
      (key) =>
        `
    <div>
      <span>${key}:</span>
      <pre>
      ${stateData[key]}
      </pre>
    </div>
    `
    )
    .join("");
  stateLogContainer.innerHTML = stateLogHtml;
});

// ----------------------------------

function App() {
  return <div></div>;
}

export default App;
