import React, { useState, useRef } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { jsPDF } from "jspdf";
import "./markdowncanvas.css";
import html2canvas from "html2canvas";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";

// Styling untuk editor markdown (optional)
import "@uiw/react-markdown-editor/markdown-editor.css";

const CodeEditorMarkDown = () => {
  const [editorContent, setEditorContent] = useState(""); // Menyimpan konten markdown
  const [previewContent, setPreviewContent] = useState(""); // Menyimpan konten yang akan ditampilkan di preview
  const previewRef = useRef(null); // Referensi untuk menampilkan preview markdown
  const [pdfUrl, setPdfUrl] = useState(null); // Menyimpan URL PDF untuk preview

  // Fungsi untuk menangkap preview dan mengonversinya menjadi PDF
  const downloadPDF = () => {
    html2canvas(previewRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF();
      doc.addImage(imgData, "PNG", 10, 10);
      doc.save("preview.pdf"); // Unduh PDF dengan nama "preview.pdf"
    });
  };

  // Fungsi untuk menampilkan konten markdown di preview setelah tombol "Show Preview" ditekan
  const showPreview = () => {
    setPreviewContent(editorContent); // Menetapkan konten markdown ke preview
  };

  return (
    <div
      style={{ height: "100vh" }}
      className="w-full   px-10  flex justify-center flex-col"
    >
      <div className="w-full h-full py-5 flex">
        {/* Editor Markdown di sebelah kiri */}
        <div className="px-5 h-full w-full border-2 border-amber-200  ">
          <MarkdownEditor
            value={editorContent}
            onChange={({ text }) => setEditorContent(text)} // Menyimpan konten markdown yang diubah
            enablePreview={true}
          />
        </div>

        {/* <div className="w-1/2 p-5 bg-white">
          <h3>Preview:</h3>
          <div
            ref={previewRef} 
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              backgroundColor: "#fff",
            }}
          >
            <h3
              dangerouslySetInnerHTML={{
                __html: previewContent,
              }}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CodeEditorMarkDown;
