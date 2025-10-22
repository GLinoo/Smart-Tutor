// src/components/FormComponents.tsx
import React from "react";

export const RadioGroup = ({ label, name, options, value, setter }: any) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-2">
      {label}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt: string) => (
        <button
          key={opt}
          type="button"
          onClick={() => setter(opt)}
          className={`px-4 py-2 text-sm rounded-full border transition-colors ${
            value === opt
              ? "bg-emerald-500 text-white border-emerald-500"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export const TextInput = ({
  label,
  name,
  value,
  setter,
  placeholder,
  required = false,
}: any) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-600 mb-1"
    >
      {label} {required && "*"}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={(e) => setter(e.target.value)}
      className="w-full p-3 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export const Slider = ({ label, name, value, setter }: any) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-600 mb-1"
    >
      {label}: <span className="font-bold text-emerald-600">{value}</span>
    </label>
    <input
      type="range"
      id={name}
      name={name}
      min="1"
      max="5"
      value={value}
      onChange={(e) => setter(parseInt(e.target.value, 10))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
    />
  </div>
);
