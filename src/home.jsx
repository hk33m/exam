import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Home(){
const navigate =useNavigate();
const [name,setname]=useState(()=>{
    const n=localStorage.getItem("name");
    return n!==null ? JSON.parse(n) : "" 
});

  const handelbutton = ()=>{
        localStorage.setItem("name",JSON.stringify(name));
        navigate("/question");
   }
const chick = localStorage.getItem("currentIndex")!==null ? localStorage.getItem("currentIndex") : 0 ;
    return(
        <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-slate-900 " dir="rtl">
             <div className="w-[400px] md:w-[600px] bg-white dark:bg-slate-800 shadow-2xl p-8 rounded-2xl text-center">
         <AnimatePresence>
                     <motion.div
                       initial={{ opacity: 0, x: 30 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -30 }}
                       className="space-y-6"
                     >
                <div className="flex flex-col justify-center items-center">
                <img src="/image/logo.png" width={"200px"}></img>
                  <div className=" text-right text-emerald-900 dark:text-emerald-500 ">
                    <p>إعداد :</p>
                    <p>الاستاذة / رقية بنت حسين أحمد حامظي</p>
                    <p>ماجستير قياس وتقويم - بكالوريوس كيمياء</p>
                    <p>إدارة تعليم جازان - المملكة العربية السعودية</p>
                    </div>
                
                </div>
        <div>
            <h1 className="text-xl dark:text-white">العلوم الفيزيائية والكيميائية </h1>
            <h1 className="text-gray-500 dark:text-gray-400">المادة وتفاعلاتها </h1>
        </div>
        <div>
            <input
            value={name}
            onChange={(event)=>{
              setname(event.target.value);
            }}  
            className=" w-full px-2 py-3 text-center dark:text-white rounded-lg shadow-lg outline-0 outline-blue-600" placeholder="اسم الطالبة"></input>
        </div>
        <motion.button
         whileTap={{ scale: 0.9 }}
         onClick={handelbutton}
         disabled={name==""}
        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed">{ chick==0 ? "إكمال الاسئلة" : "بدء الاسئلة"} </motion.button>
        </motion.div>
        </AnimatePresence>
        </div>

        </div>

    )
}
