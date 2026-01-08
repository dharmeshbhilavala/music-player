import React, { createContext, useContext, useState, useEffect } from 'react';

const ColorContext = createContext();

export const useColor = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
  const colorSequences = [
    ["bg-pink-500", "bg-pink-600", "bg-pink-700", "bg-pink-800", "bg-pink-950"],
    ["bg-red-500", "bg-red-600", "bg-red-700", "bg-red-800", "bg-red-900"],
    ["bg-orange-500", "bg-orange-600", "bg-orange-700", "bg-orange-800", "bg-orange-900"],
    ["bg-amber-500", "bg-amber-600", "bg-amber-700", "bg-amber-800", "bg-amber-900"],
    ["bg-yellow-500", "bg-yellow-600", "bg-yellow-700", "bg-yellow-800", "bg-yellow-900"],
    ["bg-lime-500", "bg-lime-600", "bg-lime-700", "bg-lime-800", "bg-lime-900"],
    ["bg-green-500", "bg-green-600", "bg-green-700", "bg-green-800", "bg-green-900"],
    ["bg-emerald-500", "bg-emerald-600", "bg-emerald-700", "bg-emerald-800", "bg-emerald-900"],
    ["bg-teal-500", "bg-teal-600", "bg-teal-700", "bg-teal-800", "bg-teal-900"],
    ["bg-cyan-500", "bg-cyan-600", "bg-cyan-700", "bg-cyan-800", "bg-cyan-900"],
    ["bg-sky-500", "bg-sky-600", "bg-sky-700", "bg-sky-800", "bg-sky-900"],
    ["bg-blue-500", "bg-blue-600", "bg-blue-700", "bg-blue-800", "bg-blue-900"],
  ];

  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [currentColorSequence, setCurrentColorSequence] = useState(colorSequences[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSequenceIndex((prevIndex) => (prevIndex + 1) % colorSequences.length);
    }, 5000); // Change color sequence every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentColorSequence(colorSequences[currentSequenceIndex]);
  }, [currentSequenceIndex]);

  return (
    <ColorContext.Provider value={{ currentColorSequence }}>
      {children}
    </ColorContext.Provider>
  );
};
