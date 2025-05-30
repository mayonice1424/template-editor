import React, { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import ReactMarkdown from "react-markdown";
import AceEditor from "react-ace";
import { jsPDF } from "jspdf";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";

// Import EditorJS Tools
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";

const CodeEditor = () => {
  const [editors, setEditors] = useState([]); // Menyimpan daftar editor yang ditambahkan
  const [imageData, setImageData] = useState(""); // Menyimpan URL gambar yang di-upload
  const [pdfUrl, setPdfUrl] = useState(null); // Menyimpan URL PDF untuk preview
  const [editorContent, setEditorContent] = useState({}); // Menyimpan konten semua editor

  const editorRefs = useRef({}); // Menyimpan referensi editor di dalam objek
  const markdownRefs = useRef({}); // Menyimpan referensi untuk ReactMarkdown
  const aceRefs = useRef({}); // Menyimpan referensi untuk AceEditor

  // Fungsi untuk menambahkan editor baru
  const addEditor = (type) => {
    setEditors((prevEditors) => [
      ...prevEditors,
      { type, id: prevEditors.length + 1 },
    ]);
  };

  // Fungsi untuk mengonversi gambar menjadi URL lokal
  const handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result); // Simpan hasil gambar di state
        resolve({
          success: 1,
          file: {
            url: reader.result, // Menggunakan URL gambar lokal
          },
        });
      };
      reader.readAsDataURL(file); // Baca gambar sebagai URL Data
    });
  };

  // Fungsi untuk generate PDF dan tampilkan preview
  const generatePDF = () => {
    const doc = new jsPDF();
    let currentY = 10; // Posisi awal Y untuk penambahan teks

    editors.forEach((editor) => {
      switch (editor.type) {
        case "editorjs":
          doc.text(editorContent[editor.id] || "", 10, currentY + 10);
          currentY += 20; // Update posisi vertikal untuk editor berikutnya
          break;
        case "react-markdown":
          doc.text(editorContent[editor.id] || "", 10, currentY + 10);
          currentY += 20;
          break;
        case "react-ace":
          doc.text(editorContent[editor.id] || "", 10, currentY + 10);
          currentY += 20;
          break;
        default:
          break;
      }
    });

    const pdfDataUrl = doc.output("datauristring");
    setPdfUrl(pdfDataUrl);
  };

  const renderEditor = (editor) => {
    switch (editor.type) {
      case "editorjs":
        return (
          <div
            key={editor.id}
            ref={(el) => (editorRefs.current[editor.id] = el)}
          ></div>
        );
      case "react-markdown":
        return (
          <div key={editor.id} className="w-full h-full flex flex-col">
            <textarea
              className="w-full"
              placeholder="Tulis markdown di sini"
              value={editorContent[editor.id] || ""}
              onChange={(e) =>
                setEditorContent((prevContent) => ({
                  ...prevContent,
                  [editor.id]: e.target.value,
                }))
              }
            />
            <div ref={(el) => (markdownRefs.current[editor.id] = el)}>
              <ReactMarkdown children={editorContent[editor.id] || ""} />
            </div>
          </div>
        );
      case "react-ace":
        return (
          <div
            className="bg-blue-500 w-full justify-center items-center"
            key={editor.id}
          >
            <AceEditor
              className="w-full flex"
              mode="markdown"
              theme="monokai"
              name={`react-ace-${editor.id}`}
              editorProps={{ $blockScrolling: true }}
              value={editorContent[editor.id] || ""}
              onChange={(value) =>
                setEditorContent((prevContent) => ({
                  ...prevContent,
                  [editor.id]: value,
                }))
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Menginisialisasi EditorJS dengan useEffect
  useEffect(() => {
    editors.forEach((editor) => {
      if (editor.type === "editorjs" && editorRefs.current[editor.id]) {
        const editorInstance = new EditorJS({
          holder: editorRefs.current[editor.id],
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
                  uploadByFile: handleImageUpload, // Ganti uploadByFile untuk menggunakan fungsi lokal
                },
              },
            },
          },
        });

        // Ambil output setelah editor selesai diinisialisasi
        editorInstance.isReady
          .then(() => {
            return editorInstance.save(); // Ini mengembalikan data editor
          })
          .then((outputData) => {
            const editorText = outputData.blocks
              .map((block) => block.text)
              .join("\n");
            setEditorContent((prevContent) => ({
              ...prevContent,
              [editor.id]: editorText,
            }));
          })
          .catch((err) => {
            console.error("EditorJS initialization failed", err);
          });
      }
    });
  }, [editors]);

  return (
    <div className="w-full h-full px-10 bg-white flex justify-center flex-col">
      <div className="bg-green-500 w-full">
        <div className="w-100 md-w-50 bg-yellow-400 flex justify-between">
          <button onClick={() => addEditor("editorjs")}>Add EditorJS</button>
          <button onClick={() => addEditor("react-markdown")}>
            Add React Markdown
          </button>
          <button onClick={() => addEditor("react-ace")}>Add React Ace</button>
        </div>
      </div>
      {editors.map(renderEditor)}

      {imageData && (
        <div className="mt-5">
          <h3>Uploaded Image Preview:</h3>
          <img src={imageData} alt="Uploaded" style={{ maxWidth: "100%" }} />
        </div>
      )}

      <button onClick={generatePDF} className="my-4 bg-blue-500 text-white p-2">
        Generate PDF Preview
      </button>

      {pdfUrl && (
        <div>
          <h3>PDF Preview:</h3>
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title="PDF Preview"
            style={{ border: "1px solid #ddd" }}
          />
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
