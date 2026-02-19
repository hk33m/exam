import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw,UserPen,X,Check,Download,Edit } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { questions } from "./data/questions";
import toast, { Toaster } from "react-hot-toast";
import { useRef } from "react";
import { getDateTime } from "./dateTime";
import { toPng } from 'html-to-image';
import jsPDF from "jspdf";




export default function Question(){
const correctRef = useRef(null);
const wrongRef = useRef(null);
const certRef = useRef(null);
 const navigate =useNavigate();

 const { day, time, date } = getDateTime();

 
 const [currentIndex, setCurrentIndex] = useState(() => {
  const saved = localStorage.getItem("currentIndex");
  return saved !== null ? parseInt(saved) : 0;
});



const downloadCertificate = () => {
  if (!certRef.current) return;

  toPng(certRef.current, { cacheBust: true })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'certificate.png';
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error('حدث خطأ أثناء حفظ الشهادة:', err);
    });
};

const downloadPDF = async () => {
  if (!certRef.current) return;

  try {
    const dataUrl = await toPng(certRef.current, {
      cacheBust: true,
      pixelRatio: 5, // جودة عالية
    });

    const pdf = new jsPDF({
      orientation: "landscape", // عرضي للشهادة
      unit: "mm",
      format: [certRef.current.offsetWidth, certRef.current.offsetHeight],
    });

    pdf.addImage(
      dataUrl,
      "PNG",
      0,
      0,
      certRef.current.offsetWidth,
      certRef.current.offsetHeight
    );

    pdf.save("شهادة تدريب اختبار العلوم الكيميائية.pdf");

  } catch (error) {
    console.error("خطأ في حفظ PDF:", error);
  }
};



const motivationMessages = [
  "ممتاز! استمر بنفس الحماس 🚀",
  "أداء جميل جدًا 👏 كمل!",
  "خطوة جديدة نحو النجاح 🌟",
  "تركيزك واضح، واصل 👌",
  "كل سؤال يقربك للإنجاز 💪",
  "رائع! السؤال التالي بانتظارك 🔥",
];

const [trueq,settrueq]=useState(() => {
  const saved = localStorage.getItem("trueq");
  return saved ? JSON.parse(saved) : 0;
});
 const [falseq,setfalseq]=useState(() => {
  const saved = localStorage.getItem("falseq");
  return saved ? JSON.parse(saved) : 0;
});

  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(() => {
  const saved = localStorage.getItem("score");
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
const [school,setSchool]=useState(()=>{
    const n=localStorage.getItem("school");
    return n!==null ? JSON.parse(n) : "" 
});

const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (currentIndex === 0 && !hasShownToast) {
      toast(
        '🌟هيا بنا نبدأ! خذ نفسًا عميقًا وركز أنت مستعد لتبدع 📝✨',
        {
          duration: 7000,
          position: 'top-center',
          style: {
            background: '#ffef5',
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          },
        }
      );
      setHasShownToast(true);
    }
  }, [currentIndex, hasShownToast]);


useEffect(() => {
  localStorage.setItem("isFinished", JSON.stringify(isFinished));
}, [isFinished]);

useEffect(() => {
  localStorage.setItem("trueq", JSON.stringify(trueq));
}, [trueq]);

useEffect(() => {
  localStorage.setItem("falseq", JSON.stringify(falseq));
}, [falseq]);

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
    duration: 2000,
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
    duration: 2000,
    icon:<X></X>,
    style: {
      borderRadius: '10px',
      background: 'red',
      color: '#fff',
    },
  }
);
    }

    if((currentIndex+1)%9==0 && currentIndex+1<questions.length && !isFinished){
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

     if (currentIndex+1 === questions.length - 1 && !isFinished) {
    toast.custom((t) => (
      <div className="bg-yellow-700 text-white p-4 rounded-xl shadow-lg w-[300px] text-center">
        <h2 className="font-bold text-lg mb-2">تنبيه ⚠️</h2>
        <p className="text-sm ">
          هذا هو السؤال الأخير<br />
          يرجى التأكد من كتابة الاسم الكامل<br />
          لأنه سيظهر في الشهادة 🎓
        </p>
        <p className="text-sm mb-3"> يمكن تعديل الاسم من هذه الايقونة <UserPen className="inline"></UserPen></p>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-white text-yellow-600 px-4 py-1 rounded-lg font-bold"
        >
          إغلاق
        </button>
      </div>
    ), {
      duration: Infinity,   // يبقى ظاهر
      position: "top-center"
    });
  }

  

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      const datash={
        day: day,
        time: time,
        date: date,
      }
      localStorage.setItem("datash", JSON.stringify(datash));
      setIsFinished(true);
    }
  };


  const resetQuiz = () => {
  localStorage.removeItem("currentIndex");
  setCurrentIndex(0);
  setHasShownToast(false);
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
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col justify-center pt-14 items-center  p-5" dir="rtl">
     <audio ref={correctRef} src="/correct.wav" preload="auto" />
     <audio ref={wrongRef} src="/wrong.wav" preload="auto" />

      {/* شريط التقدم */}
      <div onClick={()=>{navigate("/home");}} className="flex fixed gap-3 absolute top-[17px] right-4  bg-white dark:bg-slate-900 p-1 shadow-2xl rounded-md border-slate-900 dark:border-gray-100  cursor-pointer border text-slate-900 dark:text-white ">
        البيانات الاساسية
                <UserPen className="text-slate-900 dark:text-white" ></UserPen>
              </div>
<div className="w-[400px] md:w-[800px] mb-2 bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden ">
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
              <div className="flex gap-1 justify-between items-center">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                السؤال {currentIndex + 1} / {questions.length}
              </h1>
              
              <div className="flex gap-1 ">
               <h1 className="px-4 py-2 bg-green-800 text-white rounded-lg">صح  : {trueq}</h1>
                <h1 className="px-4 py-2 bg-red-800 text-white rounded-lg">خطأ  : {falseq}</h1>
               
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

            <div className="overflow-x-auto border mt-8 h-[300px]">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-blue-200 text-blue-900 sticky top-0">
                    <th className="p-2">#</th>
                    <th className="p-2">السؤال</th>
                    <th className="p-2">إجابتك</th>
                    {/* <th className="p-2">الصحيح</th> */}
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
                      {/* <td className="p-2 text-green-600">{showimage(a.id) ? (<img src={a.correctAnswer} width={"50px"}></img>) : a.correctAnswer}</td> */}
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

            
            {/* ===== الشهادة ===== */}
<div className="flex flex-col items-center gap-6 mt-5">

  <div
    ref={certRef}
   className="relative"
  >
  <img src="image/sh.png" className="shadow-lg border border-blue-800"></img>

  <div className="absolute top-8 md:top-19 text-center w-full">
    <h1 className="text-[11px] md:text-xl font-bold text-cyan-800">شهادة إتمام تدريب</h1>
    <h1  className="text-[10px] md:text-xl text-yellow-600">Certificate of Training Completion</h1>
    
    <div className="mt-1 md:mt-2 text-[9px] space-y-1 md:space-y-2  md:text-xl">
      <h1 className="">تشهد منصة تدريب اختبار نافس بأن  </h1>
      <h1 className="text-right mr-[32%] md:mr-[31%]">الطالب/ـة : <span className="text-cyan-700 font-bold">{name}</span> </h1>
      <h1>من مدرسة : {school}</h1>
      <h1>الصف : الثالث المتوسط</h1>
      <h1>قد أتم تدريب مادة العلوم بنجاح</h1>
      <h1>فرع : العلوم الكيميائية</h1>
     <h1 className="text-cyan-700 font-bold">
  الدرجة : {score} / {questions.length} بنسبة  (
    {(() => {
      const percentage = (Number(score) / Number(questions.length)) * 100;
      // إذا كان صحيح بدون كسور نرجع العدد كـ int، وإلا نحتفظ بكسور
      return Number.isInteger(percentage) ? percentage : percentage.toFixed(2);
    })()} %
  )
</h1>
      <div className="flex  px-8 gap-1 justify-center mt-1 pl-4 text-gray-600">
        <h1 className="bg-white shadow-sm px-2 py-1 rounded-md"> {JSON.parse(localStorage.getItem("datash")).day}  </h1>
        <h1 className="bg-white shadow-sm px-2 py-1 rounded-md"> {JSON.parse(localStorage.getItem("datash")).time}  </h1>
        <h1 className="bg-white shadow-sm px-2 py-1 rounded-md"> {JSON.parse(localStorage.getItem("datash")).date} م</h1>
      </div>
    </div>
  </div>
  
  </div>

<div className="flex flex-col gap-2">
  <button
    onClick={downloadCertificate}
    className="bg-green-600 hover:bg-green-700 text-white px-6 flex gap-2 justify-center items-center py-3 rounded-xl shadow-lg"
  >
    حفظ الشهادة في المعرض <Download></Download>
  </button>
  <button
    onClick={downloadPDF}
    className="bg-red-600 hover:bg-red-700 text-white px-6 flex gap-2 justify-center items-center py-3 rounded-xl shadow-lg"
  >
    حفظ   PDF <Download></Download>
  </button>

  
  </div>
  <button
              onClick={() =>resetQuiz()}
              className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-white px-6 py-3 rounded-xl shadow-lg mt-2"
            >
              إعادة الاختبار <RefreshCcw></RefreshCcw>
            </button>
</div>

          </motion.div>
          
        )}
      </div>
     <div className="text-center dark:text-white  p-3">جميع الحقوق محفوظة لدى المعلمة / رقية حسين حامظي <span className="text-[20px]">©</span> {new Date().getFullYear()}</div>
    </div>
  );
}
