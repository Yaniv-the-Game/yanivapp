import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

export default function IndexPage({ eventsUri }) {
  return (
    <div className='index'>
      <h1>Hello Yaniv</h1>
      <p>Will connect to {eventsUri}...</p>
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
