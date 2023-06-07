
import { useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import { ISignInData } from '../types/i-sign-in-data';

import MainLayout from '../layouts/MainLayout';
import BibblisClientApi from '../utils/api/BibblisClientApi';
import Link from 'next/link';

const SignIn = () => {
  const signInSchema = yup.object<ISignInData>().shape({
    email: yup
      .string()
      .required('Campo obligatorio')
      .email('Introduce un email válido')
      .max(255, 'La dirección de email es demasiado larga'),
    password: yup.string()
      .required('Campo obligatorio')
      .min(8, 'La contraseña es demasiado corta'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISignInData>({ resolver: yupResolver(signInSchema) });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit: SubmitHandler<ISignInData> = async (signInData) => {
    setIsLoading(true);
    const result = await BibblisClientApi.signIn(signInData);
    if (!result) {
      setError('Email o contraseña incorrectos');
      reset();
    } else {
      router.push('/my-library');
    }
    setIsLoading(false);
  };

  return (
    <MainLayout>
      <Head>
        <title>Inicia sesión | Biblis</title>
        <meta
          name="description"
          content="¡Inicia sesión y empieza a organizar tu biblioteca 📚!"
        />
      </Head>
      <div className="row">
        <div className="d-none d-lg-block col-lg-6">
          <div className="h-100 books-bg"></div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="row mb-4">
            <div className="col">
              <h1>Iniciar sesión</h1>
            </div>
          </div>
          <form className="row" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="col-12 my-2">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email" id="email" {...register('email')}
                className={`form-control ${errors.email && 'is-invalid'}`}
                placeholder="Email"
              />
              <div className="invalid-feedback">
              </div>
            </div>
            <div className="col-12 my-2">
              <label htmlFor="passwordConfirm" className="form-label">
                Contraseña
              </label>
              <input
                type="password" id="password" {...register('password')}
                className={`form-control ${errors.password && 'is-invalid'}`}
                placeholder="Contraseña"
              />
              <div className="invalid-feedback">
              </div>
            </div>
            <div className="col-12 mt-2">
              <input
                type="submit" value="Iniciar sesión" disabled={isLoading}
                className="btn btn-primary w-100"
              />
            </div>
          </form>
          {error && 
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {error}
            </div>
          }
          <div className="row">
            <div className="col">
              <p className="mt-3 mb-0">
                ¿Has olvidado tu contraseña? Haz click
                <Link href="/forgot-password"> aquí</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SignIn;
