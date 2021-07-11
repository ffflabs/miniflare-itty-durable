# itty-durable Example

An attempt to run the example shown on  [itty-durable's repo](https://github.com/kwhitley/itty-durable/tree/v0.x/examples/counters).

(it works when deployed, sure enough, but things would be so much nicer if I could leverage [Miniflare's DO capabitlies](https://miniflare.dev/durable-objects.html) to debug without hating my life)

Problems I've found:

Pointing miniflare to the source entrypoint complains about `itty-router-extras`

```bash
miniflare src/index.js -c ./wrangler.toml -w -e .env -d --cache-persist false -o Counter=Counter

[mf:err]  Unable to resolve "src/index.js" dependency "itty-router-extras": no matching module rules 
```

Pointing it to the built version does show a result on the browser, though it's still erroring in the console:

[mf:err] TypeError: Cannot set property 'waitUntil' of undefined
    at EventsModule.dispatchFetch (~/simple-counter/node_modules/miniflare/src/modules/events.ts:150:29)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
    at Miniflare._Miniflare_httpRequestListener (~/simple-counter/node_modules/miniflare/src/index.ts:388:20)


Last discovery: it seems it was complaining because no route was handling the absence of a favicon :(