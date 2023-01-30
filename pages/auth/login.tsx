import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, TypeOf } from 'zod';
import { useState } from 'react';

export const createSessionSchema = object({
  email: string().min(1, { message: 'Email is required' }).email({
    message: 'Invalid email address',
  }),
  password: string().min(1, { message: 'Password is required' }),
});

type CreateUserInput = TypeOf<typeof createSessionSchema>;

function LoginPage(): JSX.Element {
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string>('');

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createSessionSchema),
  });

  async function onSubmit(values: CreateUserInput): Promise<void> {
    setRegisterError('');
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        { withCredentials: true }
      );
      router.push('/');
    } catch (err: any) {
      setRegisterError(err.message);
    }
  }

  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@email.com"
            {...register('email')}
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="Password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            autoComplete="new-password"
            {...register('password')}
          />
          <p>
            <>{errors.password?.message}</>
          </p>
        </div>

        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}

export default LoginPage;
