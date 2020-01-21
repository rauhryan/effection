export function any(type) {
  if(type === "array") {
    return function anyMatcher(value) {
      return Array.isArray(value);
    };
  } else if(type) {
    return function anyMatcher(value) {
      return typeof(value) === type;
    };
  } else {
    return function anyMatcher() {
      return true;
    };
  }
}

export function compile(pattern) {
  return function match(target) {
    if(pattern === undefined) {
      return true;
    } else if(Array.isArray(pattern)) {
      return pattern.every((value, index) => compile(value)(target[index]));
    } else if(typeof(pattern) === "object") {
      return Object.entries(pattern).every(([key, value]) => compile(value)(target[key]));
    } else if(typeof(pattern) === "function") {
      return pattern(target);
    } else {
      return pattern === target;
    }
  };
}
