const delay = (time) => {
    return new Promise((resolve) => {
      let timers = setInterval(() => {
        clearInterval(timers);
        resolve();
      }, time);
    })
  };

const catchError = async (ctx, next) => {
  const body = ctx.request.body
  await delay(2000);
  await next();
}


module.exports = catchError;