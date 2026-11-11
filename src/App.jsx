import React, { useEffect, useRef, useState } from "react";
import "./App.css";
const wordle = "JMROK";
const App = () => {
  const [tryies, setTryes] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(null)),
  );
  const [chance, setChance] = useState(0);
  const [index, setIndex] = useState(0);
  const [charStatus, setCharStatus] = useState(
    Array.from({ length: 6 }, () => Array(5).fill("")),
  );
  const [isEnterPressed, setIsEnterPressed] = useState(false);
  const focus = useRef(null);

  useEffect(() => {
    window.addEventListener('load',()=>focus.current.focus())
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      if (!/^[a-zA-Z]$/.test(key) && key !== "BACKSPACE" && key !== "ENTER") {
        alert("Only Letters ");
        return;
      }

      if (key === "BACKSPACE") {
        const tem = [...tryies];
        tem[chance][index] = null;
        setIndex((pre) => (pre > 0 ? pre - 1 : 0));
        setTryes([...tem]);
        const status = [...charStatus];
        status[chance][index] = "";
        setCharStatus(status);
        return;
      }

      if (key === "ENTER") {
        if (chance === 6) {
          alert("Game End");
          return;
        }
        if (index === 5) {
          setIsEnterPressed(true);
          if (finishGame(tryies[chance])) {
            alert("You Win");
            return;
          }
          setChance((pre) => pre + 1);
          setIndex((pre) => pre - 5);
          return;
        }
        alert("Complete your spell");
        return;
      }

      if (index === 5) {
        return;
      }
      const status = [...charStatus];
      status[chance][index] = checkCharStatus(key, index);
      setCharStatus(status);
      setIsEnterPressed(false);
      console.log(status);
      const tem = [...tryies];
      tem[chance][index] = key;
      setTryes(tem);
      setIndex((pre) => pre + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, chance]);

  return (
    <>
      <h1 className=" ">
        {" "}
        Wordle Game <input type="hidden" ref={focus} />
      </h1>
      <section className="grid grid-cols-5  gap-1 mx-auto ">
        {tryies.map((element, rowIndex) =>
          element.map((ch, colIndex) => (
            <Square
              value={ch}
              key={`${rowIndex}-${colIndex}`}
              status={charStatus[rowIndex][colIndex]}
              finish={isEnterPressed || rowIndex < chance}
            />
          )),
        )}
      </section>
    </>
  );
};

const Square = ({ value, status, finish }) => {
  return (
    <div
      className={`w-15 h-15 ${finish ? status : ""} ${value && finish ? "transition  " : ""} `}
    >
      <button
        className={`w-full h-full border-2 text-gray-950 uppercase text-3xl font-bold border-gray-300 ${finish ? "text-white" : ""} `}
      >
        {value}
      </button>
    </div>
  );
};

function finishGame(word) {
  const guessedWord = word.join("").replaceAll(",", "").toUpperCase();
  return guessedWord === wordle;
}

function checkCharStatus(key, index) {
  const found = wordle.includes(key);
  if (found) {
    const position = wordle.indexOf(key) === index;
    if (position) {
      return "bg-green-500 ";
    }
    return "bg-yellow-500 ";
  }
  return "bg-gray-600";
}
export default App;
