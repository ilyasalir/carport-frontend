"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/interface/cn";
import { BoldIcon, Italic as ItalicIcon, LucideImage, LucideYoutube } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import "../app/globals.css"
import Youtube from '@tiptap/extension-youtube'
import { IoLogoYoutube } from "react-icons/io";
import Image from '@tiptap/extension-image'
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import { FaListOl, FaListUl } from "react-icons/fa";


function MenuBar({ editor }: { editor: any }) {
    const [clicked, setClicked] = useState<boolean>(false);

  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 'full',
        height: "auto",
      })
    }
  }

  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
        editor.commands.setImage({
          src: url
        })
      }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 ">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1",
          editor.isActive("bold") ? "bg-black text-white" : ""
        )}
      >
        <BoldIcon className="w-4 h-4" />
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1",
          editor.isActive("italic") ? "bg-black text-white" : ""
        )}
      >
        <ItalicIcon className="w-4 h-4" />
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
            "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1",
            editor.isActive("heading", { level: 1 }) ? "bg-black text-white" : ""
          )}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
            "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1",
            editor.isActive("heading", { level: 2 }) ? "bg-black text-white" : ""
          )}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
            "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1",
            editor.isActive("heading", { level: 3 }) ? "bg-black text-white" : ""
          )}
      >
        H3
      </button>
      <button
        onClick={() => addYoutubeVideo()}
        className={cn(
            "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1 active:bg-black active:text-white",
          )}
      >
        <IoLogoYoutube/>
      </button>
      <button
        onClick={() => addImage()}
        className={cn(
            "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1 active:bg-black active:text-white",
          )}
      >
        <LucideImage/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
            "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1",
            editor.isActive("bulletList") ? "bg-black text-white" : ""
          )}
      >
        <FaListUl/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
            "flex gap-2 border-black border items-center justify-center rounded-lg px-2 py-1",
            editor.isActive("orderedList") ? "bg-black text-white" : ""
          )}
      >
        <FaListOl/>
      </button>
    </div>
    
  );
}

export const TextEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
        StarterKit.configure({
            heading: {
              levels: [1, 2, 3], // Specify the heading levels
            },
          }),
        Bold,
        Italic,
        Youtube,
        Image.configure({
            HTMLAttributes: {
              style: "max-width: 90%; height: auto; margin: 0 auto;", // Set max width and auto height
            },
          }),
        BulletList,
        OrderedList,
        ListItem
      
      ], // Ensure StarterKit is included
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "object-fit min-h-[30vw] border border-gray-subtext p-4 font-poppins prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none rounded-[12px]",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-2 bg-white rounded-[12px] mt-1 md:mt-2 p-2 shadow-sm border-gray-subtext hover:border-black focus-within:border-black">
      {/* Align the MenuBar to be centered */}
      <div className="flex flex-col items-center">
        <MenuBar editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
