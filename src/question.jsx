import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw,UserPen,X,Check } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { questions } from "./data/questions";
import toast, { Toaster } from "react-hot-toast";
import { useRef } from "react";




export default function Question(){
const correctRef = useRef(null);
const wrongRef = useRef(null);

 const navigate =useNavigate();
 
 const [currentIndex, setCurrentIndex] = useState(() => {
  const saved = localStorage.getItem("currentIndex");
  return saved !== null ? parseInt(saved) : 0;
});

const motivationMessages = [
  "ممتاز! استمر بنفس الحماس 🚀",
  "أداء جميل جدًا 👏 كمل!",
  "خطوة جديدة نحو النجاح 🌟",
  "تركيزك واضح، واصل 👌",
  "كل سؤال يقربك للإنجاز 💪",
  "رائع! السؤال التالي بانتظارك 🔥",
];


  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(() => {
  const saved = localStorage.getItem("score");
  return saved ? JSON.parse(saved) : 0;
});

const [trueq,settrueq]=useState(() => {
  const saved = localStorage.getItem("trueq");
  return saved ? JSON.parse(saved) : 0;
});
 const [falseq,setfalseq]=useState(() => {
  const saved = localStorage.getItem("falseq");
  return saved ? JSON.parse(saved) : 0;
});
  const [isFinished, setIsFinished] = useState(() => {
  const saved = localStorage.getItem("isFinished");
  return saved ? JSON.parse(saved) : false;
});

  const [answers, setAnswers] = useState(() => {
  const saved = localStorage.getItem("answers");
  return saved ? JSON.parse(saved) : [];   // يبدأ بمصفوفة فارغة لو ما في بيانات
});
const [name,setname]=useState(()=>{
    const n=localStorage.getItem("name");
    return n!==null ? JSON.parse(n) : "" 
});

 useEffect(() => {
  localStorage.setItem("trueq", JSON.stringify(trueq));
}, [trueq]);

useEffect(() => {
  localStorage.setItem("falseq", JSON.stringify(falseq));
}, [falseq]);
useEffect(() => {
  localStorage.setItem("isFinished", JSON.stringify(isFinished));
}, [isFinished]);

useEffect(() => {
  localStorage.setItem("score",score);
}, [score]);

useEffect(() => {
  localStorage.setItem("currentIndex", currentIndex);
}, [currentIndex]);


useEffect(() => {
  localStorage.setItem("answers", JSON.stringify(answers));
}, [answers]);


  const handleNext = () => {

    if (selectedOption === questions[currentIndex].correct) {
      setScore(score + 1);
      settrueq(trueq=>trueq+1);
      correctRef.current.currentTime = 0;
      correctRef.current.play();
      toast("إجابة صحيحة! أحسنت ",
  {
    icon: <Check></Check>,
    style: {
      borderRadius: '10px',
      background: 'green',
      color: '#fff',
    },
  }
);
    }else{
      setfalseq(falseq=>falseq+1);
      wrongRef.current.currentTime = 0;
      wrongRef.current.play();
      toast(' إجابة خاطئة!حاول في السؤال التالي',
  {
    icon:<X></X>,
    style: {
      borderRadius: '10px',
      background: 'red',
      color: '#fff',
    },
  }
);
    }

    if((trueq)%9==0 && trueq!=0){
    const msg =
    motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
    toast(msg, { icon: "🌟" });
    }

    setAnswers((prev) => [
      ...prev,
      {
        index:currentIndex,
        id: questions[currentIndex].id,
        question: questions[currentIndex].question,
        options: questions[currentIndex].options,
        correctAnswer: questions[currentIndex].options[questions[currentIndex].correct],
        studentAnswer: questions[currentIndex].options[selectedOption],
        correctIndex: questions[currentIndex].correct,
        studentIndex: selectedOption,
      },
    ]);

    

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };


  const resetQuiz = () => {
  localStorage.removeItem("currentIndex");
  localStorage.removeItem("answers");
  setCurrentIndex(0);
  setAnswers([]);
  setScore(0);
  setIsFinished(false);
  setSelectedOption(null);
  settrueq(0);
  setfalseq(0);

};

    function showimage(id) {
  return [31,64,68,90].includes(id);
    }



  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col justify-center pt-14 items-center p-5" dir="rtl">
     <audio ref={correctRef} src="/correct.wav" preload="auto" />
     <audio ref={wrongRef} src="/wrong.wav" preload="auto" />

      {/* شريط التقدم */}
      <div className="flex gap-3 absolute top-3.5 right-4">
                <h1 className="px-4 py-2 bg-green-800 text-white rounded-lg">إجابة صحيحة : {trueq}</h1>
                <h1 className="px-4 py-2 bg-red-800 text-white rounded-lg">إجابة خاطئة : {falseq}</h1>
              </div>
<div className="w-[400px] md:w-[800px] mb-2 bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
  <div
    className="bg-blue-600 h-full transition-all duration-500"
    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
  />
</div>
      <div className=" w-[400px] md:w-[800px] bg-white dark:bg-slate-800 shadow-2xl py-8 px-6 rounded-2xl">
        <Toaster position="top-center" />
        
        {/* ===================== الأسئلة ===================== */}
        {!isFinished && (
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="flex gap-1 justify-between">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                السؤال {currentIndex + 1} / {questions.length}
              </h1>
              
              <div className="flex gap-2">
              {currentIndex>0 ?(
                <RefreshCcw className="text-slate-900 dark:text-white" onClick={()=>{
                if(confirm("هل تريد بالفعل بداء الاسئلة من جديد ؟")){
                  resetQuiz();
                }
               }}></RefreshCcw>
              ):(
                ""
              )}
              
                <UserPen className="text-slate-900 dark:text-white" onClick={()=>{navigate("/");}}></UserPen>
               </div>
                 </div>
                {questions[currentIndex].url !="" && (<div><img src={questions[currentIndex].url} width={"400px"}></img> </div>) }
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {questions[currentIndex].question}
              </p>

              <div className="space-y-3">
                {questions[currentIndex].options.map((option, idx) => (
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-right py-3 px-4 rounded-xl border
                      shadow-sm transition-all cursor-pointer dark:text-white
                      ${
                        selectedOption === idx
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-white dark:bg-slate-900 text-gray-800 hover:bg-blue-50 dark:hover:bg-slate-700 "
                      }`}
                  >
                    <span className="font-bold ml-3">{idx ==0 ? "أ" : idx==1 ? "ب" : idx==2 ? "ج" : "د" } -</span>
                    {showimage(questions[currentIndex].id) ? (<img src={option} width={"120px"}></img>) :  (<>{option}</>) }
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                disabled={selectedOption === null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                التالي
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ===================== صفحة النتيجة ===================== */}
        {isFinished && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6"
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-green-600"
            >
              {name}  نتيجتك هي : 
              <br></br>
              {score} من {questions.length}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-100 text-green-800 p-4 rounded-xl shadow-lg text-lg"
            >
              {score === questions.length
                ? "ممتاز! إجاباتك كلها صحيحة 👏"
                : score >= questions.length / 2
                ? "جيد جدًا! لكن يمكنك التحسن أكثر ✨"
                : "لا بأس! حاول من جديد وستتحسن 🔁"}
            </motion.div>

            <div className="overflow-x-auto mt-8 h-[300px]">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-blue-200 text-blue-900 sticky top-0">
                    <th className="p-2">#</th>
                    <th className="p-2">السؤال</th>
                    <th className="p-2">إجابتك</th>
                    <th className="p-2">الصحيح</th>
                    <th className="p-2">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((a, i) => (
                    <tr
                      key={i}
                      className="border hover:bg-gray-50 transition"
                    >
                      <td className="p-2 dark:text-white">{i + 1}</td>
                      <td className="p-2 dark:text-white">{a.question}</td>
                      <td className={`p-2 ${a.correctAnswer==a.studentAnswer ? "text-green-600" : "text-red-600"} `}>{showimage(a.id) ? (<img src={a.studentAnswer} width={"50px"}></img>) : a.studentAnswer}</td>
                      <td className="p-2 text-green-600">{showimage(a.id) ? (<img src={a.correctAnswer} width={"50px"}></img>) : a.correctAnswer}</td>
                      <td className="p-2">
                        {a.studentIndex === a.correctIndex ? (
                          <span className="text-green-600 text-xl">✔️</span>
                        ) : (
                          <span className="text-red-600 text-xl">❌</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() =>resetQuiz()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg mt-5"
            >
              إعادة الاختبار 🔄
            </button>
          </motion.div>
        )}
      </div>
     <div className="text-center dark:text-white  p-3">جميع الحقوق محفوظة لدى المعلمة / رقية حسين حامظي <span className="text-[20px]">©</span> {new Date().getFullYear()}</div>
    </div>
  );
}
