import Head from 'next/head';

import MainLayout from '../layouts/MainLayout';

const TermsAndConditionsPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Cookies | Biblis</title>
        <meta
          name="description"
          content="Información sobre la política de cookies"
        />
      </Head>
      <h1>Cookies</h1>
      <h2>Qué es una Cookie</h2>
      <p>
        Una cookie es un fichero de texto que se envía al navegador web de tu
        ordenador, móvil o tablet y que sirve para almacenar y recuperar
        información sobre la navegación realizada. Por ejemplo, recordar tu
        nombre de usuario y contraseña o las preferencias de tu perfil.
      </p>
      <h2>Tipos y usos</h2>
      <p>
        Bibblis usa cookies propias para proporcionar el servicio.
      </p>
      <h2>Cookies usadas por Bibblis</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Origen</th>
            <th>Finalidad</th>
            <th>Tipo</th>
            <th>Caducidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>refresh</td>
            <td>.bibblis.com</td>
            <td>Técnica</td>
            <td>Propia</td>
            <td>2 años</td>
          </tr>
        </tbody>
      </table>
      <h2>Revisión</h2>
      <p>
        Estas listas se actualizarán con la mayor celeridad posible a medida que
        cambien o evolucionen los servicios del sitio web ofrecidos en el mismo.
        Sin embargo, ocasionalmente durante esta actualización puede ser que la
        lista no incluya ya una cookie, aunque siempre se referirá a cookies con
        propósitos idénticos a los registrados en estas listas.
      </p>
    </MainLayout>
  );
};

export default TermsAndConditionsPage;
