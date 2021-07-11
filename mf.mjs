import { ConsoleLog, Miniflare } from "miniflare";

let workerPath = '.'
/**
 * This script triggers the cron schedule, so one can inspect the updating routine.
 * (in this case it's the router updating cron. It just updates the main ETF list)
 */
const mf = new Miniflare({
    scriptPath: `${workerPath}/dist/index.mjs`,
    // Some options omitted, see src/options/index.ts for the full list
    sourceMap: true,
    log: new ConsoleLog(true), // Defaults to no-op logger
    wranglerConfigPath: `${workerPath}/wrangler.toml`,
    watch: true,
    port: 8787,
    //upstream: "https://example.site.com",
    //crons: ["*/5 * * * *"],
    //kvNamespaces: ["TEST_NAMESPACE"],
    kvPersist: `${workerPath}/.mf`,
    cachePersist: false,
    
    envPath: ".env",
    durableObjects: {
        Counter: { /*scriptPath: `${workerPath}/src/Counter.js`,*/ className: 'Counter' }
    },
    "buildCommand":"yarn build",
    buildBasePath: workerPath,
    buildWatchPath:`${workerPath}/src`
});




// Start HTTP server
mf.createServer().listen(8787);
