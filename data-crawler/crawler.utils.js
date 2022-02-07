exports.threadPool = async (tasks = [async () => {}], maxThread = 5) => {
  let async = [];
  while (tasks.length !== 0) {
    const task = tasks.pop();
    async.push(task());
    if (async.length >= Math.min(maxThread, tasks.length)) {
      await Promise.all(async);
      async = [];
    }
  }
};
