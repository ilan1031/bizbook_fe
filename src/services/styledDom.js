// For styled("input"), styled("div") and friends: props that callers pass the
// MUI way (fullWidth, error, ...) still reach the style function, but aren't
// forwarded to the HTML element, where React would warn about them.
const NON_DOM_PROPS = new Set([
  "ownerState",
  "theme",
  "sx",
  "as",
  "fullWidth",
  "error",
  "helperText",
  "multiline",
  "InputProps",
  "InputLabelProps",
]);

export const domProps = { shouldForwardProp: (prop) => !NON_DOM_PROPS.has(prop) };
