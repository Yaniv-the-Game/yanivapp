import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          font-size: 18px;
        }
      `}</style>
    </>
  )
}

export default MyApp
