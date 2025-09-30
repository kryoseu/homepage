import { createContext, useCallback, useContext } from "react";
import { SettingsContext } from "utils/contexts/settings";
import { highlightProps } from "utils/widgets/highlight-rules";

import Error from "./error";

const ALIASED_WIDGETS = {
  pialert: "netalertx",
  hoarder: "karakeep",
};

export const HighlightContext = createContext();

export default function Container({ error = false, children, service }) {
  const { settings } = useContext(SettingsContext);
  const highlightRules = service?.widget?.highlight_rules;

  if (error) {
    if (settings.hideErrors || service.widget.hide_errors) {
      return null;
    }

    return <Error service={service} error={error} />;
  }

  const childrenArray = Array.isArray(children) ? children : [children];

  let visibleChildren = childrenArray;
  let fields = service?.widget?.fields;
  if (typeof fields === "string") fields = JSON.parse(service.widget.fields);
  const type = service?.widget?.type;
  if (fields && type) {
    // if the field contains a "." then it most likely contains a common loc value
    // logic now allows a fields array that can look like:
    // fields: [ "resources.cpu", "resources.mem", "field"]
    // or even
    // fields: [ "resources.cpu", "widget_type.field" ]
    visibleChildren = childrenArray?.filter((child) =>
      fields.some((field) => {
        let fullField = field;
        if (!field.includes(".")) {
          fullField = `${type}.${field}`;
        }
        let matches = fullField === (child?.props?.field || child?.props?.label);
        // check if the field is an 'alias'
        if (matches) {
          return true;
        } else if (ALIASED_WIDGETS[type]) {
          matches = fullField.replace(type, ALIASED_WIDGETS[type]) === (child?.props?.field || child?.props?.label);

          return matches;
        }
        // no match
        return false;
      }),
    );
  }

  const highlightFn = useCallback((field, value) => highlightProps(highlightRules, field, value), []);

  // Wrapping child in a context to avoid prop drilling
  return (
    <HighlightContext.Provider value={highlightFn}>
      <div className="relative flex flex-row w-full service-container">{visibleChildren}</div>
    </HighlightContext.Provider>
  );
}
