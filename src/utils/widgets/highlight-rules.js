/**
 * Validates a single highlight rule.
 * Ensures the rule has a valid fieldType, operator, and field name.
 * Throws an error if the rule is invalid.
 */
export function isValid(rule) {
  const validTypes = ["number", "percent", "text"];
  const validOperators = ["equals", "notEquals", "greaterThan", "lesserThan"];

  if (!validTypes.includes(rule.format)) return false;
  if (!validOperators.includes(rule.operator)) return false;
  if (!rule.field) return false;
  return true;
}

function parseValue(value, type) {
  if (type === "number") return Number(value);
  if (type === "percent") return Number(String(value).replace("%", ""));
  return String(value);
}

/**
 * Returns highlight properties for a field/value if a rule matches, otherwise null
 */
export function highlightProps(rules, field, value) {
  if (!Array.isArray(rules)) return null;

  for (const rule of rules) {
    if (!isValid(rule)) continue;

    if (rule.field !== field) continue;

    const fieldValue = parseValue(value, rule.format);
    const ruleValue = parseValue(rule.value, rule.format);

    if ((rule.format === "number" || rule.format === "percent") && (isNaN(fieldValue) || isNaN(ruleValue))) continue;

    let matches = false;
    switch (rule.operator) {
      case "greaterThan":
        matches = fieldValue > ruleValue;
        break;
      case "lesserThan":
        matches = fieldValue < ruleValue;
        break;
      case "equals":
        matches = fieldValue === ruleValue;
        break;
      case "notEquals":
        matches = fieldValue !== ruleValue;
        break;
    }

    if (matches) {
      return { color: rule.color, animationStyle: rule.animation };
    }
  }

  return null;
}
