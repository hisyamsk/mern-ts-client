import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, TypeOf } from 'zod';
import { useState } from 'react';

const createUserSchema = object({
  name: string().min(1, { message: 'Name is required' }),
  password: string().min(6, 'Password too short - should be 6 chars minimum'),
  passwordConfirmation: string().min(1, 'Password confirmation is required'),
  email: string().min(1, { message: 'Email is required' }).email({
    message: 'Invalid email address',
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Password does not match',
  path: ['passwordConfirmation'],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

function RegisterPage(): JSX.Element {
  const router = useRouter()
  const [registerError, setRegisterError] = useState<string>('');

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: CreateUserInput): Promise<void> {
    setRegisterError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`, values)
      router.push('/')
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
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your Name"
            {...register('name')}
          />
          <p>
            <>{errors.name?.message}</>
          </p>
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

        <div className="form-element">
          <label htmlFor="Password Confirmation">Password Confirmation</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="********"
            autoComplete="new-password"
            {...register('passwordConfirmation')}
          />
          <p>
            <>{errors.passwordConfirmation?.message}</>
          </p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}

export default RegisterPage;
