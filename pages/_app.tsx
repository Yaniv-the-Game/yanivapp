import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          font-size: 18px;
          background:rgba(240,240,240,1);
          @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap');
          font-family: 'Gloria Hallelujah', cursive;
        }
      `}</style>
    </>
  )
}

export default MyApp
