import Editor from "@monaco-editor/react";

const CodeEditor = () => {

  const code = "print('Hello World')";

  return (
    <Editor
      
      language="python"
      theme="vs-dark"
      value={code}
      options={{
        fontSize: 16,
        formatOnType: true,
        minimap: { enabled: false }
      }}
    />
  );
};
export default CodeEditor;