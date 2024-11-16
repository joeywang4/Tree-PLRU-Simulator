import * as React from "react";
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './tailwind.config'

const toInt = (obj) => {
  const output = {};
  for (const [key, value] of Object.entries(obj)) {
    output[key] = parseInt(value.substring(0, value.length - 2))
  }
  return output
}

const screens = toInt(resolveConfig(tailwindConfig).theme.screens);
// {sm: '640px', md: '768px', lg: '1024px', xl: '1280px', 2xl: '1536px'}

/**
 * Return the current breakpoint if values are not provided. 
 * Otherwise, return the value of current size or larger in values.
 * @param {Object} values - values chosen by the current breakpoint:
 * {default: val, min: val, sm: val, md: val, ... }
 * 
 * @returns {} current breakpoint or the chosen value
 */
const useBreakpoints = (values = null) => {  
  const initSize = typeof window !== 'undefined' ? window.innerWidth : 0;
  const [size, setSize] = React.useState(initSize);

  React.useLayoutEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (values === null) {
    // return the current breakpoint
    let current = "min";
    for (const [key, value] of Object.entries(screens)) {
      if (size >= value) current = key;
      else return current;
    }
    return current;
  }
  else {
    let current = values["default"];
    for (const [key, value] of Object.entries(values)) {
      if (key in screens && screens[key] <= size) current = value;
    }
    return current;
  }
}

export default useBreakpoints;
