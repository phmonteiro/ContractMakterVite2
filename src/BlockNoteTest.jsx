import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
// import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote  } from "@blocknote/react";
import { useMemo, useState, useEffect } from "react";
import demoData from "./demoData.json";
import { BlockNoteEditor } from "@blocknote/core";

export const BlockNoteTest = () => {
  
  const editor = useCreateBlockNote();
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {
    // Load data from your DB on component mount
    async function loadEditorContent() {
      const savedData = await fetch('http://localhost:5000/api/testText').then((res) => res.json());
      if (savedData && savedData.content) {
        editor?.setContent(JSON.parse(savedData.content));
      }
      setLoading(false);
    }

    loadEditorContent();
  }, [editor]);

  const saveContent = async () => {
    if (editor) {
      const blocksJson = editor.getJSON();
      await fetch('/api/updateTest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id:1, text: JSON.stringify(blocksJson) }),
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div ref={editor?.ref} />
      <button onClick={saveContent}>Save</button>
    </div>
  );

};
