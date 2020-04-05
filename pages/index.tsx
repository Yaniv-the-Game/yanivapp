import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Card from '../components/card'
import { useYaniv } from '../hooks/yaniv'

export default function IndexPage({ eventsUri }) {
  const { counter, increment } = useYaniv({ eventsUri })

  return (
    <div className='index'>
      <h1>Hello Yaniv</h1>
      <p>Connected to {eventsUri}...</p>
      <p>Counter is {counter}</p>
      <p><button onClick={increment}>Increment counter here</button></p>

      <Card type="CA" />

      <style jsx>{`
        .index {
          color: #333;
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const eventsUri = process.env.PUSHPIN_REALM_URI || 'ws://localhost:8999/api/events'

  return {
    props: {
      eventsUri,
    }
  }
}
