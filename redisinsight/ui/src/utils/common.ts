import { IpcInvokeEvent } from 'uiSrc/electron/constants'

const isDevelopment = window.riConfig.app.env === 'development'
const isWebApp = window.riConfig.app.type === 'web'
const { apiPort } = window.app?.config || { apiPort: window.riConfig.api.port }
const hostedApiBaseUrl = window.riConfig.api.hostedBaseUrl

export const getBaseApiUrl = () => {
  if (hostedApiBaseUrl) {
    return hostedApiBaseUrl
  }

  return (!isDevelopment && isWebApp
    ? window.location.origin
    : `${window.riConfig.api.baseUrl}:${apiPort}`)
}

export const getProxyPath = () => {
  if (window.__RI_PROXY_PATH__) {
    return `/${window.__RI_PROXY_PATH__}/socket.io`
  }

  if (window.riConfig.api.hostedSocketProxyPath) {
    return window.riConfig.api.hostedSocketProxyPath
  }

  return '/socket.io'
}

type Node = number | string | JSX.Element

export const getNodeText = (node: Node | Node[]): string => {
  if (['string', 'number'].includes(typeof node)) return node?.toString()
  if (node instanceof Array) return node.map(getNodeText).join('')
  if (typeof node === 'object' && node) return getNodeText(node.props.children)
  return ''
}

export const removeSymbolsFromStart = (str = '', symbol = ''): string => {
  if (str.startsWith(symbol)) {
    return str.slice(symbol.length)
  }
  return str
}

export const openNewWindowDatabase = (location: string) => {
  if (isWebApp) {
    window.open(window.location.origin + location)
    return
  }

  window.app?.ipc?.invoke(
    IpcInvokeEvent.windowOpen,
    { location },
  )
}
