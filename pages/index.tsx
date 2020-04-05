import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

export default function IndexPage() {
  return (
    <h1>Hello Yaniv</h1>
  )
}

// export const getStaticProps: GetStaticProps = async context => {
//   // ...
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   // ...
// }

// export const getServerSideProps: GetServerSideProps = async context => {
//   // ...
// }
