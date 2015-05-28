function getStack() {
  return (new Error()).stack;
}

function error(message) {
  console.error(message, "\n", getStack());
}
