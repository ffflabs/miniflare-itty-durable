import { IttyDurable } from   'itty-durable'

export class Counter extends IttyDurable {
  constructor(state, env) {
    super(state, env)
    this.counter = 0
    console.log(Object.keys(env))
  }

  increment() {
    console.log({keys:this.keys,env:Object.keys(this.env),state:Object.keys(this.state)})
    this.counter++
  }

  set(prop, value) {
    this[prop] = value
  }

  add(a, b) {
    return Number(a) + Number(b)
  }
}
