import React, { useEffect, useState } from "react";

const RainComponent = ({ timing }) => {
  const boxCount = 15;
  const defaultColor = "bg-black";
  const colorSequence = ["bg-blue-500", "bg-blue-600", "bg-blue-700", "bg-blue-800", "bg-blue-900"];

  const [colors, setColors] = useState(Array(boxCount).fill(defaultColor));

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      setColors((prevColors) => {
        const newColors = [...prevColors];

        for (let i = 0; i < boxCount; i++) {
          if (i <= step && step - i < colorSequence.length) {
            newColors[i] = colorSequence[step - i];
          } else {
            newColors[i] = defaultColor;
          }
        }

        step = (step + 1) % (boxCount + colorSequence.length);
        return newColors;
      });
    }, timing ?? 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-600">
      <div className="grid grid-rows-15 gap-0.5 w-10 pr-0.5 h-screen">
        {colors.map((color, index) => (
          <div key={index} className={`w-full flex-grow ${color} transition-colors bo`}></div>
        ))}
      </div>
    </div>
  );
};

export default RainComponent;
