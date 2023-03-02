import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { from } from "solid-js";
import { undo, redo, history } from "prosemirror-history";
import {
  baseKeymap,
  toggleMark,
  setBlockType,
  wrapIn,
} from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { Plugin } from "prosemirror-state";

function App() {
  let state = EditorState.create({
    schema,

    plugins: [
      history(),
      keymap({ "Mod-z": undo, "Mod-b": redo }),
      keymap(baseKeymap),
    ],
  });

  console.log(baseKeymap);

  let view = new EditorView(document.body, {
    state,

    dispatchTransaction(transaction) {
      console.log(
        "Document size went from",
        transaction.before.content.size,
        "to",
        transaction.doc.content.size
      );

      let newState = view.state.apply(transaction);
      view.updateState(newState);
    },
  });

  // let doc = schema.node("doc", null, [
  //   schema.node("paragraph", null, [schema.text("One.")]),
  //   schema.node("horizontal_rule"),
  //   schema.node("paragraph", null, [schema.text("Two!")]),
  // ]);

  // MENU

  function menuPlugin(items) {
    return new Plugin({
      view(editorView) {
        let menuView = new MenuView(items, editorView);
        editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
        return menuView;
      },
    });
  }

  function icon(text, name) {
    let span = document.createElement("span");
    span.className = "menuicon " + name;
    span.title = name;
    span.textContent = text;
    return span;
  }

  // Create an icon for a heading at the given level
  function heading(level) {
    return {
      command: setBlockType(schema.nodes.heading, { level }),
      dom: icon("H" + level, "heading"),
    };
  }

  let menu = menuPlugin([
    { command: toggleMark(schema.marks.strong), dom: icon("B", "strong") },
    { command: toggleMark(schema.marks.em), dom: icon("i", "em") },
    {
      command: setBlockType(schema.nodes.paragraph),
      dom: icon("p", "paragraph"),
    },
    heading(1),
    heading(2),
    heading(3),
    { command: wrapIn(schema.nodes.blockquote), dom: icon(">", "blockquote") },
  ]);

  return <div class="bg-gray-900"></div>;
}
export default App;
