import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';
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
  const router = useRouter();
  const { data, isValidating } = useSWR<IUser | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData }
  );
  return (
    <div className={styles.container}>
      {data && !isValidating ? (
        <div>Welcome {data.name}!</div>
      ) : (
        <div>
          <div>Please Login</div>
          <button onClick={() => router.push('/auth/login')}>Login</button>
          <div>or</div>
          <a href={getGoogleOAuthUrl()}>Login with Google</a>
        </div>
      )}
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
