import { useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import { IForgotPasswordData } from '../types/i-forgot-password-data';

import BibblisClientApi from '../utils/api/BibblisClientApi';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';

const ForgotPassword = () => {
  const forgotPasswordSchema = yup.object<IForgotPasswordData>().shape({
    email: yup
    .string()
    .required('Campo obligatorio')
    .email('Introduce un email válido')
    .max(255, 'La dirección de email es demasiado larga'),
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForgotPasswordData>({ resolver: yupResolver(forgotPasswordSchema) });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const onSubmit: SubmitHandler<IForgotPasswordData> = async (forgotPasswordData) => {
    setIsLoading(true);
    setError(false);
    setSuccess(false);
    const result = await BibblisClientApi.forgotPassword(forgotPasswordData);
    if (!result) {
      setError(true);
      reset();
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };
  
  return (
    <MainLayout>
      <Head>
        <title>Recuperar contraseña | Biblis</title>
        <meta
          name="description"
          content="¿Has olvidado tu contraseña? Introduce tu email y modifícala por una nueva"
        />
      </Head>
      <div className="row">
        <div className="d-none d-lg-block col-lg-6">
          <div className="h-100 books-bg"></div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="row mb-4">
            <div className="col">
              <h1>Recuperar contraseña</h1>
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
            <div className="col-12 mt-2">
              <input
                type="submit" value="Recuperar contraseña"
                disabled={isLoading} className="btn btn-primary w-100"
              />
            </div>
          </form>
          {error && 
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              ¡Ups! Ha ocurrido un error. Porfavor, vuelve a intentarlo.
            </div>
          }
          {success &&
            <div className="alert alert-success mt-3 mb-0" role="alert">
              Solicitud realizada con éxito. Recibirás un email con el
              enlace para modificar contraseña en caso de que estés
              registrado.
            </div>
          }
        </div>
      </div>
    </MainLayout>
  );
};
  
export default ForgotPassword;
