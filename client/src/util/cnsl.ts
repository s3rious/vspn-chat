// tslint:disable no-empty

const debugMode = (() => {
  if (document && document.location && document.location.search) {
    return /debug/.test(document.location.search)
  }

  return false
})()


let cnsl = {
  error: (...args: any[]) => {},
  log: (...args: any[]) => {}
}

if (debugMode) {
  cnsl = console
}

export default cnsl
