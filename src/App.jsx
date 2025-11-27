
import { Routes,Route } from "react-router-dom";
import Question from "./question";
import Home from "./home";
import { useState, useEffect } from "react";
import { Sun,Moon } from "lucide-react";

function App() {
   const [theme, setTheme] = useState("light");
   

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
      document.documentElement.classList.toggle("dark", localTheme === "dark");
    } else {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemPrefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", systemPrefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const followSystemTheme = () => {
    localStorage.removeItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(systemPrefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", systemPrefersDark);
  };

  return(
    <div>
      <button onClick={toggleTheme}  className="flex fixed top-4 left-4 bg-white dark:bg-slate-900 p-1 shadow-2xl rounded-md border-slate-900 dark:border-gray-100 border text-slate-900 dark:text-white  ">
       {theme=="light"?(<Moon></Moon>):(<Sun></Sun>)}
      </button>
      <Routes>
        <Route path="/" element={<Home></Home>} ></Route>
        <Route path="/Question" element={<Question></Question>} ></Route>
        <Route path="/*" element={<Home></Home>} ></Route>
      </Routes>
    </div>
 
  )
 
}

export default App;
