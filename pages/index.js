// out-domain.com/
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";

export default function HomePage(props) {
  return (
    <>
      <Head>
        <title>Meetups application</title>
        <meta
          name="description"
          content="Browse a huge list of highly active meetups! Find the meetup that suits you!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

// function will always run on the server
// export async function getServerSideProps(context) {
//   const { req, res } = context;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// function will run at build time
export async function getStaticProps() {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.zxzalz3.mongodb.net/meetups?retryWrites=true&w=majority`
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
      props: {
        meetups: meetups.map((meetup) => ({
          title: meetup.title,
          address: meetup.address,
          image: meetup.image,
          id: meetup._id.toString(),
        })),
      },
      // incremental static generation
      revalidate: 1, // number of seconds after which a page re-generation can occur if a request comes in for it
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        meetups: [],
      },
    };
  }
}
