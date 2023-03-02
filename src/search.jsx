import {
  EditorState,
  Transaction,
  Plugin,
  PluginKey,
  TextSelection,
  Command,
} from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Node } from "prosemirror-model";

export const pluginKey = new PluginKey() < SearchData > "search-replace2";
function getSearch(editorState) {
  return pluginKey.getState(editorState);
}

function search(s, p) {
  if (!p.searchPattern) return [];
  const r = [];
  const sp = p.matchCase ? p.searchPattern : p.searchPattern.toLowerCase();
  const xx = p.matchCase ? s : s.toLowerCase();
  let idx = xx.indexOf(sp);

  while (idx !== -1) {
    r.push(new Match(idx, idx + p.searchPattern.length));
    idx = s.indexOf(p.searchPattern, idx + 1);
  }
  return r;
}
