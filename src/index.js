import {
  error,
  json,
  missing,
  StatusError,
  text,
  ThrowableRouter,
  withParams,
} from 'itty-router-extras'
import { withDurables } from 'itty-durable'

// export durable object class, per spec
export { Counter } from './Counter'
const faviconSvg=`<svg version="1.1"
baseProfile="full"
width="72" height="72"
xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="red" />
<circle cx="48" cy="48" r="24" fill="green" />
<text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
</svg>`
// create a basic router
/** @type {import('itty-router').Router} counterRouter */
const counterRouter = ThrowableRouter({ base: '/simple-counter', stack: true })

counterRouter
  // add upstream middleware

  .get('*', async (...args) => {
    let reswithDurables = await withDurables()(...args)
    console.log({ reswithDurables })
    return reswithDurables;
  })
  .get('/favicon.ico', () => {
    return new Response(faviconSvg, { headers: { 'Content-Type': 'image/svg+xml' } })
  })

  // get get the durable itself... returns JSON Response, so no need to wrap
  .get('/', async ({ Counter }) => {
    let res = await Counter.get('test').toJSON()
    console.log(res)
    return res
  })

  // example route with multiple calls to DO
  .get('/do-stuff',
    async ({ Counter }) => {
      const counter = Counter.get('test')

      // then we fire some methods on the durable... these could all be done separately.
      await Promise.all([
        counter.increment(),
        counter.increment(),
        counter.increment(),
      ])

      // all instance calls return a promise to a JSON-formatted Response
      // unless withDurables({ parse: true }) is used
      return counter.toJSON()
    }
  )

  // will pass on requests to the durable... (e.g. /add/3/4 => 7)
  .get('/:action/:a?/:b?', withParams,
    ({ Counter, action, a, b }) => Counter.get('test')[action](a, b)
  )

  // all else gets a 404
  .all('*', () => {
    let res = missing('counter router: 404 not found wtf')
    console.log(res)
    return res
  })


const parentRouter = ThrowableRouter()

parentRouter
  .get('/', async (...args) => {
    return new Response('Yo dawg');
  })
  .get('/favicon.ico', () => {
    return new Response(faviconSvg, { headers: { 'Content-Type': 'image/svg+xml' } })
  }).all('/simple-counter/*', counterRouter.handle)
  .all('*', () => {
    let res = missing('parent router: 404 not found wtf')
    console.log(res)
    return res
  })
// CF ES6 module syntax
export default {
  fetch: parentRouter.handle
}

/*

Example Usage:

GET simple-counter/reset        --> { counter: 0 }
GET simple-counter/increment    --> { counter: 1 }
GET simple-counter/do-stuff     --> { counter: 4 }
GET simple-counter/do-stuff     --> { counter: 7 }
GET simple-counter/set/foo/bar  --> { counter: 7, foo: 'bar' }
GET simple-counter/increment    --> { counter: 8, foo: 'bar' }
GET simple-counter/add/40/2     --> 42

*/

