import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import WordleList from "./words";
import "./App.css";
const WordList = WordleList();
const wordle = WordList[20].toUpperCase();
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
  const notify = (message, status = "error") =>
    toast(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      type: status,
    });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      if (!/^[a-zA-Z]$/.test(key) && key !== "BACKSPACE" && key !== "ENTER") {
        notify("Only Letters ");
        return;
      }

      if (key === "BACKSPACE") {
        const tem = [...tryies];
        tem[chance][index - 1] = null;
        setIndex((pre) => (pre > 0 ? pre - 1 : 0));
        setTryes([...tem]);
        const status = [...charStatus];
        status[chance][index] = "";
        setCharStatus(status);
        return;
      }

      if (key === "ENTER") {
        if (chance === 6) {
          notify("Game End", "success");
          return;
        }
        if (index === 5) {
          if (!isInList(tryies[chance])) {
            const tem = [...tryies];
            const th = [...tryies[chance]];
            tem[chance] = th.map((item) => null && item);
            setTryes(tem);
            setIndex(0);
            setChance((pre) => pre);
            notify("Word not in list " + chance);
            return;
          }
          setIsEnterPressed(true);
          if (finishGame(tryies[chance])) {
            setTimeout(() => notify("You Win", "success"), 400);
            return;
          }
          setChance((pre) => pre + 1);
          setIndex(0);
          return;
        }
        notify("Complete your spell");
        return;
      }

      if (index === 5) {
        return;
      }
      const status = [...charStatus];
      status[chance][index] = checkCharStatus(key, index);
      setCharStatus(status);
      setIsEnterPressed(false);
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
      <ToastContainer />
      <h1 className=" "> Wordle Game</h1>
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
      ref={focus}
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

function isInList(word) {
  const guessedWord = word.join("").replaceAll(",", "").toUpperCase();
  console.log(WordList);
  console.log(WordList.includes(guessedWord));
  console.log(guessedWord);
  return WordList.includes(guessedWord);
}

function checkCharStatus(key, index) {
  const found = wordle.includes(key);
  const indexes = [];
  if (found) {
    for (let i = 0; i < wordle.length; i++) {
      if (wordle[i] === key) {
        indexes.push(i);
      }
    }
    if (indexes.includes(index)) {
      return "bg-green-600 ";
    }
    return "bg-yellow-600 ";
  }
  return "bg-gray-600";
}
export default App;
