import { createClient } from "@supabase/supabase-js";


//project url
const url="https://quzhlmiybuuspugsuyoy.supabase.co";

//public key

const key="sb_publishable_zg8BsGBk2xhCCcgIyE33KA_i_Q5x8om";

const supabase= createClient(url,key);



export default  function MediaUpload(file){

  const mediaUploadPromise=new Promise((resolve,reject)=>{
   if(file==null){
    reject("no file selected !");
    return ;


   }

   const timeStamp=new Date().getTime()
   const newName=timeStamp+file.name;

   supabase.storage.from("images").upload(newName,file,{
  upsert:false,
  cacheControl:"3600"

 }).then(()=>{
  const publicUrl=supabase.storage.from("images").getPublicUrl(newName).data.publicUrl ;
  resolve(publicUrl);



   



 }).catch(()=>{
  
  reject("error occured in supabse connection");

 })











  })


  return  mediaUploadPromise







}



