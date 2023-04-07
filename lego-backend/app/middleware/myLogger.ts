import { Context } from 'egg';
import { appendFileSync } from 'fs';

export default (options:any,) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const startTime = Date.now();
    const requestTime = new Date().toLocaleString();
    await next();
    const ms = Date.now() - startTime;
    const logger = `${requestTime} -- ${ctx.method} -- ${ctx.url} == ${ms}ms`;
    if (options.method.includes(ctx.method)) {
      appendFileSync('./logs/log.txt', logger + '\n');
    }
  };
};
