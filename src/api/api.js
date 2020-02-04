import db from "components/Db/firebaseConnect"
import { endpoints, methods } from "./constants"

class QueryBuilder {
  constructor() {
    this.endpoint = ""
    this.path = ""
    this.method = methods.GET
    this.db = db
    this.callback = () => {}
  }

  setMethod = method => {
    if (!Object.values(methods).includes(method)) {
      throw new Error("Must be a valid method")
    }
    this.method = method
    return this
  }

  setEndpoint = endpoint => {
    if (!Object.values(endpoints).includes(endpoint)) {
      throw new Error("Must be a valid endpoint")
    }
    this.endpoint = endpoint
    return this
  }

  setId = id => {
    this.id = id
    return this
  }

  setParams = params => {
    this.params = params
    return this
  }

  setCallback = cb => {
    this.callback = cb
    return this
  }

  runQuery = async () => {
    switch (this.method) {
      case methods.GET:
        const snap = await db
          .ref(this.endpoint + "/" + this.id)
          .on("value", this.callback)
        return snap
      case methods.POST:
        const snapPost = await db
          .ref(this.endpoint + "/" + this.id)
          .set(this.params, this.callback)
        return snapPost
      default:
        throw new Error("Method not defined")
    }
  }
}

export default QueryBuilder
