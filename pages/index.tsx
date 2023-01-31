import { GetServerSideProps, NextPage } from 'next';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import getGoogleOAuthUrl from '../utils/getGoogleURL';

interface IUser {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  session: string;
  iat: number;
  exp: number;
}

const Home: NextPage<{ fallbackData: IUser }> = ({ fallbackData }) => {
  const { data } = useSWR<IUser | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData }
  );

  if (data) {
    return <div>Welcome! {data.name}</div>;
  }

  return (
    <div>
      <div>Please login</div>
      <br />
      <a href="/auth/login">Login</a>
      <br />
      <a href={getGoogleOAuthUrl()}>Login with Google</a>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher<IUser | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    context.req.headers
  );

  return {
    props: { fallbackData: data },
  };
};

export default Home;
