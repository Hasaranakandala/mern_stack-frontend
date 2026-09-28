import mediaUpload from "../utils/mediaUpload";
import { useState } from "react";


export default function TestPage() {

  const [image,setImage]=useState(null);


function fileUpload(){


  mediaUpload(image).then((res)=>{

console.log(res);

  }).catch((res)=>{
    console.log(res)
  })
}


  return (
    <div className="w-full h-screen flex justify-center items-center gap-4">
      
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
      
      onChange={(e)=>{
        setImage(e.target.files[0])

      }}/>

      <button onClick={fileUpload} className="bg-green-500 text-white font-bold px-4 py-2 rounded">
        Upload
      </button>

    </div>
  );
}