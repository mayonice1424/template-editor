import React, { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { jsPDF } from "jspdf";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";

// Import EditorJS Tools
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";

const CodeEditorEditorJS = () => {
  const [editors, setEditors] = useState([]); // Menyimpan daftar editor yang ditambahkan
  const [imageData, setImageData] = useState(""); // Menyimpan URL gambar yang di-upload
  const [pdfUrl, setPdfUrl] = useState(null); // Menyimpan URL PDF untuk preview
  const editorRefs = useRef({});
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
            url: reader.result,
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let currentY = 10;

    editors.forEach((editor) => {
      switch (editor.type) {
        case "editorjs":
          // Mengambil teks dari editor, pisahkan setiap baris dengan newline
          const editorText = editorRefs.current[editor.id].innerText;
          // Pastikan setiap baris teks dipisahkan
          const editorContent = editorText
            .split("\n")
            .map((line) => line.trim())
            .join("\n");

          // Menambahkan ke PDF dengan spasi yang lebih jelas
          doc.text(editorContent, 10, currentY);
          currentY += 20; // Update posisi vertikal
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
      default:
        return null;
    }
  };

  useEffect(() => {
    editors.forEach((editor) => {
      if (editor.type === "editorjs" && editorRefs.current[editor.id]) {
        new EditorJS({
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
      }
    });
  }, [editors]);

  return (
    <div className="w-full h-full px-10 bg-white flex justify-center flex-col">
      <div className="bg-green-500 w-full">
        <div className="w-100 md-w-50 bg-yellow-400 flex justify-between">
          <button onClick={() => addEditor("editorjs")}>Add EditorJS</button>
        </div>
      </div>
      {editors.map(renderEditor)}

      {/* Menampilkan gambar yang di-upload */}
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

export default CodeEditorEditorJS;
