import React, { useState, useEffect, KeyboardEvent, MouseEvent } from "react";

interface Option {
  value: string;
}

interface SelectProps {
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  placeholder: string;
  options: Option[];
  multiple?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder,
  options,
  multiple,
  setValues,
  values,
}) => {
  const [focusedValue, setFocusedValue] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [typed, setTyped] = useState<string>("");

  let timeout: NodeJS.Timeout;

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const onFocus = () => setIsFocused(true);

  const onBlur = () => {
    setIsFocused(false);
    setIsOpen(false);
    if (!multiple) {
      const value = values[0];
      const focusedIndex = value ? options.findIndex((option) => option.value === value) : -1;
      setFocusedValue(focusedIndex);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case " ":
        e.preventDefault();
        if (isOpen) {
          if (multiple && focusedValue !== -1) {
            const newValues = [...values];
            const value = options[focusedValue].value;
            const index = newValues.indexOf(value);
            if (index === -1) {
              newValues.push(value);
            } else {
              newValues.splice(index, 1);
            }
            setValues(newValues);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
      case "Tab":
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
        }
        break;
      case "Enter":
        setIsOpen((prev) => !prev);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedValue((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedValue((prev) => Math.max(prev - 1, 0));
        break;
      default:
        if (/^[a-z0-9]$/i.test(e.key)) {
          const char = e.key;
          clearTimeout(timeout);
          timeout = setTimeout(() => setTyped(""), 1000);
          setTyped((prevTyped) => {
            const newTyped = prevTyped + char;
            const index = options.findIndex((option) =>
              new RegExp(`^${newTyped}`, "i").test(option.value)
            );
            if (index !== -1) {
              if (multiple) {
                setFocusedValue(index);
              } else {
                setValues([options[index].value]);
                setFocusedValue(index);
              }
            }
            return newTyped;
          });
        }
        break;
    }
  };

  const onClick = () => setIsOpen((prev) => !prev);

  const onDeleteOption = (e: MouseEvent<HTMLSpanElement>) => {
    const value = e.currentTarget.dataset.value!;
    setValues((prevValues) => prevValues.filter((v) => v !== value));
  };

  const onHoverOption = (e: MouseEvent<HTMLDivElement>) => {
    const value = e.currentTarget.dataset.value!;
    const index = options.findIndex((option) => option.value === value);
    setFocusedValue(index);
  };

  const onClickOption = (e: MouseEvent<HTMLDivElement>) => {
    const value = e.currentTarget.dataset.value!;
    if (!multiple) {
      setValues([value]);
      setIsOpen(false);
    } else {
      setValues((prevValues) => {
        const newValues = [...prevValues];
        const index = newValues.indexOf(value);
        if (index === -1) {
          newValues.push(value);
        } else {
          newValues.splice(index, 1);
        }
        return newValues;
      });
    }
  };

  const renderValues = () => {
    if (values.length === 0) {
      return <div className="placeholder">{placeholder}</div>;
    }
    if (multiple) {
      return values.map((value) => (
        <span key={value} onClick={stopPropagation} className="multiple value">
          {value}
          <span data-value={value} onClick={onDeleteOption} className="delete">
            <X />
          </span>
        </span>
      ));
    }
    return <div className="value">{values[0]}</div>;
  };

  const renderOptions = () => {
    if (!isOpen) return null;
    return (
      <div className="options">{options.map((option, index) => renderOption(option, index))}</div>
    );
  };

  const renderOption = (option: Option, index: number) => {
    const selected = values.includes(option.value);
    const className = `option ${selected ? "selected" : ""} ${
      index === focusedValue ? "focused" : ""
    }`;

    return (
      <div
        key={option.value}
        data-value={option.value}
        className={className}
        onMouseOver={onHoverOption}
        onClick={onClickOption}
      >
        {multiple && <span className="checkbox">{selected ? <Check /> : null}</span>}
        {option.value}
      </div>
    );
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="select" tabIndex={0} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}>
      <label className="label">{label}</label>
      <div className="selection" onClick={onClick}>
        {renderValues()}
        <span className="arrow">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
      </div>
      {renderOptions()}
    </div>
  );
};

// Icons as functional components
const ChevronDown = () => (
  <svg viewBox="0 0 10 7">
    <path
      d="M2.08578644,6.5 C1.69526215,6.89052429 1.69526215,7.52368927 2.08578644,7.91421356 C2.47631073,8.30473785 3.10947571,8.30473785 3.5,7.91421356 L8.20710678,3.20710678 L3.5,-1.5 C3.10947571,-1.89052429 2.47631073,-1.89052429 2.08578644,-1.5 C1.69526215,-1.10947571 1.69526215,-0.476310729 2.08578644,-0.0857864376 L5.37867966,3.20710678 L2.08578644,6.5 Z"
      transform="translate(5.000000, 3.207107) rotate(90.000000) translate(-5.000000, -3.207107)"
    />
  </svg>
);

const ChevronUp = () => (
  <svg viewBox="0 0 10 8">
    <path
      d="M2.08578644,7.29289322 C1.69526215,7.68341751 1.69526215,8.31658249 2.08578644,8.70710678 C2.47631073,9.09763107 3.10947571,9.09763107 3.5,8.70710678 L8.20710678,4 L3.5,-0.707106781 C3.10947571,-1.09763107 2.47631073,-1.09763107 2.08578644,-0.707106781 C1.69526215,-0.316582489 1.69526215,0.316582489 2.08578644,0.707106781 L5.37867966,4 L2.08578644,7.29289322 Z"
      transform="translate(5.000000, 4.000000) rotate(-90.000000) translate(-5.000000, -4.000000)"
    />
  </svg>
);

const X = () => (
  <svg viewBox="0 0 16 16">
    <path d="M2 .594l-1.406 1.406.688.719 5.281 5.281-5.281 5.281-.688.719 1.406 1.406.719-.688 5.281-5.281 5.281 5.281.719.688 1.406-1.406-.688-.719-5.281-5.281 5.281-5.281.688-.719-1.406-1.406-.719.688-5.281 5.281-5.281-5.281-.719-.688z" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 16 16">
    <path
      d="M13 .156l-1.406 1.438-5.594 5.594-1.594-1.594-1.406-1.438-2.844 2.844 1.438 1.406 3 3 1.406 1.438 1.406-1.438 7-7 1.438-1.406-2.844-2.844z"
      transform="translate(0 1)"
    />
  </svg>
);

// Render example

export default Select;
