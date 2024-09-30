import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...classesList: ClassValue[]) => {
  return twMerge(clsx(classesList));
};
