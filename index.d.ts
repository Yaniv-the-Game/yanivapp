// inline-react-svg makes it possible to import svg files
declare module '*.svg'

// Pushpin adds a Connection-Id header to its requests
declare module 'http' {
  interface IncomingHttpHeaders {
    'connection-id'?: string
  }
}
