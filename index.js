const Koa = require("koa");

const loadEnvironment = require("./load-environment");

loadEnvironment();

// We instance the Koa thus we have a http server.
const app = new Koa();

const __DEV__ = process.env.NODE_ENV !== "production";

if (__DEV__) {
  app.use(async ({ method, url, response }, next) => {
    await next();

    // We use the context.body to get the response body and find the response time.
    // Koa docs itself recommends to use this way to log the HTTP requests. It's
    // nearly the same data we have logged with morgan('dev') in an express app.
    const responseTime = response.get("X-Response-Time");
    console.log(`${method} ${url} - ${responseTime}`);
  });

  app.use(async (context, next) => {
    const startTime = Date.now();
    await next();
    const responseTime = Date.now() - startTime;

    // We use the context.set() to set the response time.
    context.set("X-Response-Time", responseTime); // This is set in milliseconds.
  });

  app.on("error", (err) => {
    // We should log it somewhere else like a .log file, database or reporting
    // systems like sentry.
    console.error("server error", err);
  });
}

app.listen(process.env.PORT || 8080);
