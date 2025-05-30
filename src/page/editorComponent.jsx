import React, { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import ReactMarkdown from "react-markdown";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";

// Import EditorJS Tools
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";

const CodeEditor = () => {
  const [editors, setEditors] = useState([]); // Menyimpan daftar editor yang ditambahkan
  const editorRefs = useRef({}); // Menyimpan referensi editor di dalam objek

  // Fungsi untuk menambahkan editor baru
  const addEditor = (type) => {
    setEditors((prevEditors) => [
      ...prevEditors,
      { type, id: prevEditors.length + 1 },
    ]);
  };

  // Fungsi untuk render editor sesuai tipe
  const renderEditor = (editor) => {
    switch (editor.type) {
      case "editorjs":
        return (
          <div key={editor.id} ref={(el) => (editorRefs.current[editor.id] = el)}>
            {/* EditorJS akan diinisialisasi dalam useEffect */}
          </div>
        );
      case "react-markdown":
        return (
          <div key={editor.id}>
            <textarea placeholder="Tulis markdown di sini" />
            <ReactMarkdown children={`# Markdown editor`} />
          </div>
        );
      case "react-ace":
        return (
          <div key={editor.id}>
            <AceEditor
              mode="markdown"
              theme="monokai"
              name={`react-ace-${editor.id}`}
              editorProps={{ $blockScrolling: true }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Inisialisasi EditorJS ketika editor baru ditambahkan
  useEffect(() => {
    editors.forEach((editor) => {
      if (editor.type === "editorjs" && editorRefs.current[editor.id]) {
        // Inisialisasi EditorJS
        new EditorJS({
          holder: editorRefs.current[editor.id], // Gunakan referensi dari DOM
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: (file) => {
                    return new Promise((resolve) => {
                      resolve({
                        success: 1,
                        file: { url: "path/to/image" },
                      });
                    });
                  },
                },
              },
            },
          },
        });
      }
    });
  }, [editors]); // Jalankan efek saat editors berubah

  return (
    <div>
      <button onClick={() => addEditor("editorjs")}>Add EditorJS</button>
      <button onClick={() => addEditor("react-markdown")}>
        Add React Markdown
      </button>
      <button onClick={() => addEditor("react-ace")}>Add React Ace</button>

      {editors.map(renderEditor)}
    </div>
  );
};

export default CodeEditor;
