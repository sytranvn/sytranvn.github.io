async function task() {
  let x = Math.random();
  for (let i = 0; i < 1000_000; i++) {
    x = x + Math.random() * i;
  }
  return x;
}

export default task;
