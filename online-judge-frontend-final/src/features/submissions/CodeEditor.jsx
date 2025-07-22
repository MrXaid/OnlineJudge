import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, value, onChange }) => {
  const handleEditorChange = (newValue) => {
    if (onChange) onChange(newValue);
  };

  return (
    <div className="border rounded shadow" style={{ height: '400px' }}>
      <Editor
        theme="vs-dark"
        language={language}
        value={value}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: 'off', // ✅ allow horizontal scrolling
          scrollBeyondLastLine: false,
          scrollbar: {
            horizontal: 'visible',
            vertical: 'visible',
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;
