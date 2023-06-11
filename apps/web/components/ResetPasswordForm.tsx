import { useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import { IResetPasswordData } from '../types/i-reset-password-data';

import BibblisClientApi from '../utils/api/BibblisClientApi';
import Loader from './Loader';
import Link from 'next/link';

interface IResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: IResetPasswordFormProps) => {
  const resetPasswordDataSchema = yup.object<IResetPasswordData>().shape({
    newPassword: yup.string()
      .required('Campo obligatorio')
      .min(8, 'La contraseña debe tener un mínimo de 8 caracteres'),
    newPasswordConfirm: yup.string()
      .when('password', {
        is: (val: string) => val !== '',
        then: (schema) => schema.required('Campo obligatorio')
          .oneOf([yup.ref('newPassword')], 'Las contraseñas deben coincidir'),
      })
      .required('Campo obligatorio'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<IResetPasswordData>({
    resolver: yupResolver(resetPasswordDataSchema)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit: SubmitHandler<IResetPasswordData> = async (resetPasswordData) => {
    setIsLoading(true);
    setSent(true);
    setError(false);
    try {
      BibblisClientApi.resetPassword(token, resetPasswordData);
    } catch (e) {
      setError(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading &&
        <div className="row">
          <div className="col">
            <Loader />
          </div>
        </div>
      ||
      (
        <>
          {sent &&
            <div className="row text-center">
              <div className="col">
                {error &&
                  <p>
                    ¡Ups! Ha ocurrido un error, porfavor, vuelve a intentarlo
                    más adelante.
                  </p>
                ||
                  <>
                    <p>
                      Contraseña modificada con éxito
                    </p>
                    <Link href="/sign-in" className="btn btn-secondary">
                      Iniciar sesión
                    </Link>
                  </>
                }
              </div>
            </div>
          ||
            <form className="row" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="col-12 my-2">
                <label htmlFor="newPassword" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password" id="newPassword" {...register('newPassword')}
                  className={`form-control ${errors.newPassword && 'is-invalid'}`}
                  placeholder="Contraseña"
                />
                <div className="invalid-feedback">
                  {errors.newPassword?.message}
                </div>
              </div>
              <div className="col-12 my-2">
                <label htmlFor="newPasswordConfirm" className="form-label">
                  Reintroduce tu contraseña
                </label>
                <input
                  type="password" id="newPasswordConfirm"
                  {...register('newPasswordConfirm')}
                  className={
                    `form-control ${errors.newPasswordConfirm && 'is-invalid'}`
                  }
                  placeholder="Reintroduce tu contraseña"
                />
                <div className="invalid-feedback">
                  {errors.newPasswordConfirm?.message}
                </div>
              </div>
              <div className="col-12 mt-2">
                <input
                  type="submit" value="Recuperar contraseña"
                  disabled={isLoading} className="btn btn-primary w-100"
                />
              </div>
            </form>
          }
        </>
      )

      }
    </>
  );
};

export default ResetPasswordForm;