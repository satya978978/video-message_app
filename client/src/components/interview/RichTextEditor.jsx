import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import highlight from "@tiptap/extension-highlight";
import underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";

import {
  Bold, Italic, Underline, Highlighter, List, ListOrdered, Heading1, Heading2, Heading3, Undo2, Redo2, Code2, ChevronDown,
} from "lucide-react";
import * as Y from 'yjs';


import { WebsocketProvider } from "y-websocket";
import { useFetcher, useParams } from "react-router-dom";
export default function RichTextEditor({ content, onChange, Question }) {
  const [aiQuestion, setaiQuestion] = useState("")


  

  const { sessionId } = useParams();

  const [ydoc] = useState(() => new Y.Doc())
 

  useEffect(() => {

    const update = new WebsocketProvider("ws://localhost:5000/yjs", sessionId, ydoc)

    return () => {
      update.destroy()
      ydoc.destroy()
    }
  }, [ydoc])

  if (!ydoc) return

  const editor = useEditor(

    {
      extensions: [
        StarterKit,
        highlight,
        underline,
        Collaboration.configure({ document: ydoc })

      ],
      content: content,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });

  useEffect(() => {

    const editortext= editor.getText()

    if (!editortext.includes(Question)) {
      setaiQuestion(Question)
    }
  }, [editor])


   useEffect(() => {
    if (editor && aiQuestion) {


      editor.commands.setContent(aiQuestion);
      setaiQuestion("")
      console.log(`after clear ${aiQuestion}`)

  
}
   }, [aiQuestion,editor])
   





  return (
    <div className="w-full  focus:outline-none">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-2 bg-gray-800 p-1 rounded items-center">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded transition ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded transition ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded transition ${editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
          <Underline className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1 rounded transition ${editor.isActive('highlight') ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
          <Highlighter className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded transition ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded transition ${editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 rounded transition ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded transition ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
          <Heading2 className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg- p-3 rounded text-white min-h-[200px] max-h-[480px] overflow-auto focus:outline-none"
      />
    </div>
  );
}
