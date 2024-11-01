import { useEffect, useMemo, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

import * as random from 'lib0/random'

const usercolors = [
  { color: '#6200ea', light: '#6200ea33' },  // Deep Purple
  { color: '#03dac6', light: '#03dac633' },  // Teal
  { color: '#ff9800', light: '#ff980033' },  // Orange
  { color: '#f44336', light: '#f4433633' },  // Red
  { color: '#4caf50', light: '#4caf5033' },  // Green
  { color: '#2196f3', light: '#2196f333' },  // Blue
  { color: '#9c27b0', light: '#9c27b033' },  // Purple
  { color: '#ffeb3b', light: '#ffeb3b33' }   // Yellow
];

// select a random color for this user
const userColor = usercolors[random.uint32() % usercolors.length]

interface CodeEditorProps {
  roomId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId }) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [view, setView] = useState<EditorView | null>(null);

  useEffect(() => {
    // Set up the WebSocket provider
    const providerInstance = new WebrtcProvider(roomId, ydoc, {
      signaling: ["ws://localhost:4000/yjs"]
    });
    setProvider(providerInstance);

    // Clean up on component unmount
    return () => {
      providerInstance?.destroy();
      ydoc.destroy();
    };
  }, [roomId, ydoc]);

  useEffect(() => {
    if (!provider) return;

    // Create the Yjs text type
    const yText = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(yText)

    const username = sessionStorage.getItem("username") || "Guest";

    provider.awareness.setLocalStateField('user', {
      name: username,
      color: userColor.color,
      colorLight: userColor.light
    })

    // Set up the editor state with yCollab for collaborative editing
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        oneDark,
        javascript(), // Syntax highlighting for JavaScript
        yCollab(yText, provider.awareness, {undoManager}),
      ],
    });

    // Initialize the editor view
    const editorView = new EditorView({
      state,
      parent: document.getElementById("editor")!,
    });
    setView(editorView);

    // Clean up on unmount
    return () => {
      editorView.destroy();
    };
  }, [provider, ydoc]);

  return <div id="editor" style={{ height: "90vh", backgroundColor: "#2e2e2e" }} />;
};

export default CodeEditor;
