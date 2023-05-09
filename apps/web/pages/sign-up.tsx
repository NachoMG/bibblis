import Head from 'next/head';

import MainLayout from '../layouts/MainLayout';
import Link from 'next/link';

const SignUp = () => {
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
          <form className="row">
            <div className="col-12 my-2">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <input
                type="text" id="name" name="name"
                className="form-control" placeholder="Nombre" required
              />
            </div>
            <div className="col-12 my-2">
              <label htmlFor="surname" className="form-label">
                Apellidos
              </label>
              <input
                type="surname" id="surname" name="surname"
                className="form-control" placeholder="Apellidos" required
              />
            </div>
            <div className="col-12 my-2">
              <label htmlFor="birthDate" className="form-label">
                Fecha de nacimiento
              </label>
              <input
                type="date" id="birthDate" name="birthDate"
                className="form-control" placeholder="Fecha de nacimiento"
                required
              />
            </div>
            <div className="col-12 my-2">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email" id="email" name="email" className="form-control"
                placeholder="Email" required
              />
            </div>
            <div className="col-12 my-2">
              <label htmlFor="emailConfirm" className="form-label">
                Reintroduce tu email
              </label>
              <input
                type="email" id="emailConfirm" name="emailConfirm"
                className="form-control" placeholder="Reintroduce tu email"
                required
              />
            </div>
            <div className="col-12 my-2">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password" id="password" name="password"
                className="form-control" placeholder="Contraseña"
                required
              />
            </div>
            <div className="col-12 my-2">
              <label htmlFor="passwordConfirm" className="form-label">
                Reintroduce tu contraseña
              </label>
              <input
                type="email" id="passwordConfirm" name="passwordConfirm"
                className="form-control"
                placeholder="Reintroduce tu contraseña"
                required
              />
            </div>
            <div className="col-12 my-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="termsAndConditions" name="termsAndConditions"
                  className="form-check-input" required
                />
                <label
                  className="form-check-label"
                  htmlFor="termsAndConditions"
                >
                  Acepto los <Link href="/terms-and-conditions">
                    términos y condiciones
                  </Link>
                </label>
              </div>
            </div>
            <div className="col-12 my-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="acceptedMarketing" name="acceptedMarketing"
                  className="form-check-input" required
                />
                <label
                  className="form-check-label"
                  htmlFor="acceptedMarketing"
                >
                  Deseo mantenerme informado de las novedades en mi correo
                </label>
              </div>
            </div>
            <div className="col-12 mt-2">
              <input
                type="submit" value="Registrarme"
                className="btn btn-primary w-100 text-white"
              />
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignUp;
