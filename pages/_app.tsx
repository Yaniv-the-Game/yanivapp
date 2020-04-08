import { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          margin: 0;
          font-size: 18px;
          background:rgba(240,240,240,1);
          font-family: 'Gloria Hallelujah', cursive;
        }
      `}</style>
    </>
  )
}

export default MyApp
