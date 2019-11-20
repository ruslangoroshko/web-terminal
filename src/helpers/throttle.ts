const throttle = (func: (args: any) => any, limit: number) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  return function(...args: [any]) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
export default throttle;
