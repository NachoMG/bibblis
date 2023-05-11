import Head from 'next/head';
import Link from 'next/link';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { subYears } from 'date-fns';

import * as yup from 'yup';

import MainLayout from '../layouts/MainLayout';

import { ISignUpData } from '../types/i-sign-up-data';
import { useState } from 'react';
import BibblisClientApi from '../utils/api/BibblisClientApi';

const SignUp = () => {
  const minBirthDate = subYears(new Date(), 100);
  const maxBirthDate = subYears(new Date(), 16);

  const signUpDataSchema = yup.object<ISignUpData>().shape({
    firstName: yup.string()
      .required('Campo obligatorio')
      .max(100, 'El nombre no puede superar los 100 caracteres'),
    lastName: yup.string()
      .required('Campo obligatorio')
      .max(100, 'Los apellidos no pueden superar los 100 cracteres'),
    birthDate: yup.date()
      .typeError('Introudce una fecha válida')
      .required('Campo obligatorio')
      .min(minBirthDate, 'Introduce una fecha válida')
      .max(maxBirthDate, 'Debes ser mayor de 16 años para usar Bibblis'),
    email: yup
      .string()
      .required('Campo obligatorio')
      .email('Introduce un email válido')
      .max(255, 'La dirección de email es demasiado larga'),
    emailConfirm: yup.string()
      .when('email', {
        is: (val: string) => val !== '',
        then: (schema) => schema.required('Campo obligatorio')
          .oneOf([yup.ref('email')], 'Los emails deben coincidir'),
      })
      .required('Campo obligatorio'),
    password: yup.string()
      .required('Campo obligatorio')
      .min(8, 'La contraseña debe tener un mínimo de 8 caracteres'),
    passwordConfirm: yup.string()
      .when('password', {
        is: (val: string) => val !== '',
        then: (schema) => schema.required('Campo obligatorio')
          .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir'),
      })
      .required('Campo obligatorio'),
    termsAndConditions: yup.boolean()
      .oneOf([true], 'Campo obligatorio')
      .required('Campo obligatorio'),
    acceptedMarketing: yup.boolean().required('Campo obligatorio'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ISignUpData>({
    resolver: yupResolver(signUpDataSchema)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);

  const onSubmit: SubmitHandler<ISignUpData> = async (signupData) => {
    setShowForm(false);
    setIsLoading(true);

    const result = await BibblisClientApi.signUp({ ...signupData, lang: 'es' });
    if (result.error) {
      setError(true);
      setErrorStatus(result.status);
    }
    setIsLoading(false);
  }

  const resetForm = () => {
    setError(false);
    setErrorStatus(0);
    setShowForm(true);
  }

  return (
    <MainLayout>
      <Head>
        <title>Regístrate | Biblis</title>
        <meta
          name="description"
          content="
            ¡Regístrate en Bibblis y empieza a organizar tu biblioteca 📚!
          "
        />
      </Head>
      <div className="row">
        <div className="d-none d-lg-block col-lg-6">
          <div className="h-100 books-bg"></div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="row mb-4">
            <div className="col">
              <h1>Regístrate</h1>
            </div>
          </div>
          {isLoading && ''}
          {showForm &&
            // TODO componetize when store is implemented
            <form className="row" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="col-12 my-2">
                <label htmlFor="firstName" className="form-label">
                  Nombre
                </label>
                <input
                  type="text" id="firstName" {...register('firstName')}
                  className={`form-control ${errors.firstName && 'is-invalid'}`}
                  placeholder="Nombre"
                />
                <div className="invalid-feedback">
                  {errors.firstName?.message}
                </div>
              </div>
              <div className="col-12 my-2">
                <label htmlFor="lastName" className="form-label">
                  Apellidos
                </label>
                <input
                  type="lastName" id="lastName" {...register('lastName')}
                  className={`form-control ${errors.lastName && 'is-invalid'}`}
                  placeholder="Apellidos"
                />
                <div className="invalid-feedback">
                  {errors.lastName?.message}
                </div>
              </div>
              <div className="col-12 my-2">
                <label htmlFor="birthDate" className="form-label">
                  Fecha de nacimiento
                </label>
                <input
                  type="date" id="birthDate" {...register('birthDate')}
                  className={`form-control ${errors.birthDate && 'is-invalid'}`}
                  placeholder="Fecha de nacimiento"
                />
                <div className="invalid-feedback">
                  {errors.birthDate?.message}
                </div>
              </div>
              <div className="col-12 my-2">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email" id="email" {...register('email')}
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  placeholder="Email"
                />
                <div className="invalid-feedback">
                  {errors.email?.message}
                </div>
              </div>
              <div className="col-12 my-2">
                <label htmlFor="emailConfirm" className="form-label">
                  Reintroduce tu email
                </label>
                <input
                  type="email" id="emailConfirm" {...register('emailConfirm')}
                  className={
                    `form-control ${errors.emailConfirm && 'is-invalid'}`
                  }
                  placeholder="Reintroduce tu email"
                />
                <div className="invalid-feedback">
                  {errors.emailConfirm?.message}
                </div>
              </div>
              <div className="col-12 my-2">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password" id="password" {...register('password')}
                  className={`form-control ${errors.password && 'is-invalid'}`}
                  placeholder="Contraseña"
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
              <div className="col-12 my-2">
                <label htmlFor="passwordConfirm" className="form-label">
                  Reintroduce tu contraseña
                </label>
                <input
                  type="password" id="passwordConfirm"
                  {...register('passwordConfirm')}
                  className={
                    `form-control ${errors.passwordConfirm && 'is-invalid'}`
                  }
                  placeholder="Reintroduce tu contraseña"
                />
                <div className="invalid-feedback">
                  {errors.passwordConfirm?.message}
                </div>
              </div>
              <div className="col-12 my-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="termsAndConditions" {...register('termsAndConditions')}
                    className={
                      `form-check-input ${errors.termsAndConditions && 'is-invalid'}`
                    }
                   
                  />
                  <label
                    className="form-check-label"
                    htmlFor="termsAndConditions"
                  >
                    Acepto los <Link href="/terms-and-conditions">
                      términos y condiciones
                    </Link>
                  </label>
                <div className="invalid-feedback">
                  {errors.termsAndConditions?.message}
                </div>
                </div>
              </div>
              <div className="col-12 my-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="acceptedMarketing" {...register('acceptedMarketing')}
                    className={
                      `form-check-input ${errors.acceptedMarketing && 'is-invalid'}`
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="acceptedMarketing"
                  >
                    Deseo mantenerme informado de las novedades en mi correo
                  </label>
                <div className="invalid-feedback">
                  {errors.acceptedMarketing?.message}
                </div>
                </div>
              </div>
              <div className="col-12 mt-2">
                <input
                  type="submit" value="Registrarme"
                  className="btn btn-primary w-100 text-white w-100"
                />
              </div>
            </form>
          }
          {!showForm && !isLoading &&
            <div className="row">
              <div className="col text-center">
                {error &&
                  <>
                    {errorStatus === 409 &&
                      <>
                        <p>
                          ¡El correo proporcionado ya está registrado en Bibblis!
                        </p>
                        <p>
                          <Link href="/sign-in" className="btn btn-secondary w-100">
                            Iniciar sesión
                          </Link>
                        </p>
                      </>
                    ||
                      <p>¡Ups! Ha ocurrido un error</p>
                    }
                    <button className="btn btn-primary text-white w-100" onClick={resetForm}>
                      Volver a intentarlo
                    </button>
                  </>
                ||
                  <>
                    <p>¡Registro relizado con éxito!</p>
                    <p>
                      Confirma tu dirección de correo haciendo click en el
                      enlace del email que te acabamos de enviar para empezar
                      a disfrutar de Bibblis.
                    </p>
                  </>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </MainLayout>
  );
};

export default SignUp;
