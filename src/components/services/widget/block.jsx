import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { HighlightContext } from "./container";

export default function Block({ value, label }) {
  const { t } = useTranslation();

  const field = label?.split(".").pop();
  const highlightForField = useContext(HighlightContext);
  const highlight = highlightForField(field, value);

  const color = highlight?.color || "red-500";
  const animationStyle = highlight?.animationStyle || "ping";
  const animationClass = `animate-${animationStyle}`;

  return (
    <div
      className={classNames(
        "relative bg-theme-200/50 dark:bg-theme-900/20 rounded-sm m-1 flex-1 flex flex-col items-center justify-center text-center p-1 service-block",
        value === undefined && "animate-pulse",
      )}
    >
      {highlight && (
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span
            className={classNames("absolute inline-flex h-full w-full rounded-full", animationClass, `bg-${color}`)}
          ></span>
          {animationStyle === "ping" && (
            <span className={classNames("relative inline-flex h-3 w-3 rounded-full", `bg-${color}`)}></span>
          )}
        </span>
      )}
      <div className="font-thin text-sm">{value ?? "-"}</div>
      <div className="font-bold text-xs uppercase">{t(label, { defaultValue: label })}</div>
    </div>
  );
}
