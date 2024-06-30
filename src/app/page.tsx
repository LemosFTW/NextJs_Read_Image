"use client";
import Image from "next/image";
import { PickerOverlay } from "filestack-react";
import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Tesseract from "tesseract.js";

export default function Home() {
  const [showPicker, setShowPicker] = useState(false);
  const [uploadedFileHandle, setUploadedFileHandle] = useState('');
  const [content, setContent] = useState('');


  const notify = () => toast.success('File Uploaded', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });


    const readImageContent = async () => {
      const {data} = await Tesseract.recognize(`https://cdn.filestackcontent.com/${uploadedFileHandle}`, 'por');
    
      setContent(data.text);
    }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {showPicker && (
        <PickerOverlay
          apikey={process.env.NEXT_PUBLIC_FILESTACK_API_KEY as string}
          pickerOptions={{
            accept: ["image/*"],
            maxFiles: 1,
            maxSize: 1024 * 1024 * 10,
            onClose: () => setShowPicker(false),
            onUploadDone: (res) => {
              setUploadedFileHandle(res.filesUploaded[0].handle);
              notify();
              readImageContent();
              setShowPicker(false);
            },
          }}
        />
      )}

      <button
        className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowPicker(true)}
      >
        Upload Image
      </button>


      <div className="flex gap-x-[30px] mt-20">Result Image

        {uploadedFileHandle && (
          <Image
            src={`https://cdn.filestackcontent.com/${uploadedFileHandle}`}
            alt="Uploaded Image"
            width={350}
            height={350}
          />
        )}
      </div>

      <div className="flex gap-x-[30px] mt-20" > Content in the image

        {content && (<p>{content}</p>)}
      </div>

      <ToastContainer/>
    </main>
  );
}
