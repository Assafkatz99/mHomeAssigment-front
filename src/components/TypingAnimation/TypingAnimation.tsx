import { useState, useEffect } from "react";

interface IProps {
  words: string[];
  letterDelay?: number;
  wordDelay?: number;
}

const TypingAnimation = ({
  words,
  letterDelay = 100,
  wordDelay = 8000,
}: IProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsDeleting(true);
    }, wordDelay);

    return () => clearInterval(interval);
  }, [wordDelay]);

  useEffect(() => {
    const currentWordChars = words[currentWordIndex].split("");
    let i = isDeleting ? currentWordChars.length : 0;
    let direction = isDeleting ? -1 : 1;
    let timeout = isDeleting ? letterDelay / 2 : wordDelay;

    const interval = setInterval(() => {
      if (isDeleting && i === 0) {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        clearInterval(interval);
      } else if (!isDeleting && i === currentWordChars.length) {
        setTimeout(() => setIsDeleting(true), timeout);
        clearInterval(interval);
      } else {
        setCurrentWord((prev) => {
          const newWord = currentWordChars.slice(0, i).join("");
          return newWord;
        });
        i += direction;
      }
    }, letterDelay);

    return () => clearInterval(interval);
  }, [currentWordIndex, isDeleting, words, letterDelay, wordDelay]);

  return <span style={{ color: "rgb(255, 159, 159)" }}>{currentWord}.</span>;
};

export default TypingAnimation;
