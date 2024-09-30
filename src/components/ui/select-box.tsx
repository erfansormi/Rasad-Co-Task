import React, { useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "../../libs/utils";

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

  let timeout: ReturnType<typeof setTimeout>;

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
      return <div className="py-2 text-neutral-500">{placeholder}</div>;
    }
    if (multiple) {
      return (
        <div className="flex items-center gap-2 flex-wrap py-2 text-neutral-500">
          {values.map((value) => (
            <span
              key={value}
              onClick={stopPropagation}
              className="text-blue-500 font-semibold capitalize bg-neutral-200 relative px-2 py-1 flex items-center gap-2 rounded-lg text-sm"
            >
              <span>{value}</span>
              <span data-value={value} onClick={onDeleteOption} className="cursor-pointer">
                <X size={16} />
              </span>
            </span>
          ))}
        </div>
      );
    }
    return <div className="capitalize">{values[0]}</div>;
  };

  const renderOptions = () => {
    if (!isOpen) return null;
    return (
      <div className="absolute z-30 top-[110%] max-h-72 overflow-y-auto overflow-x-hidden inset-x-0 rounded-lg py-1 border bg-white">
        {options.map((option, index) => renderOption(option, index))}
      </div>
    );
  };

  const renderOption = (option: Option, index: number) => {
    const selected = values.includes(option.value);
    const className = `px-4 border-b cursor-pointer capitalize py-1 ${
      selected ? "border bg-neutral-100 border-blue-500 -mt-px -mr-px" : ""
    } ${index === focusedValue ? "bg-neutral-50" : ""}`;

    return (
      <div
        key={option.value}
        data-value={option.value}
        className={className}
        onMouseOver={onHoverOption}
        onClick={onClickOption}
      >
        {multiple && (
          <span
            className={cn(
              "inline-flex me-2 border items-center justify-center size-4 text-white rounded-sm",
              selected && "border border-blue-500 bg-blue-400"
            )}
          >
            {selected ? <Check size={16} /> : null}
          </span>
        )}
        {option.value}
      </div>
    );
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="flex flex-col relative w-full focus:outline-none group"
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <label className="font-semibold mb-1 text-sm">{label}</label>
      <div
        className="group-focus:ring-2 group-focus:ring-blue-500 group-focus:ring-offset-1 transition-all duration-200 relative flex items-center border bg-neutral-100 rounded-md min-h-9 justify-between px-3"
        onClick={onClick}
      >
        <span>{renderValues()}</span>
        <span>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </div>
      {renderOptions()}
    </div>
  );
};

export default Select;
