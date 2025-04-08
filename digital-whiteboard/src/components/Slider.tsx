// src/components/Slider.tsx
import React from "react";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  min = 1,
  max = 20,
  step = 1,
  value,
  onChange,
}) => {
  return (
    <input
      id={"slider"}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-blue-500"
    />
  );
};

export default Slider;
