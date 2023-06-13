import Link from "next/link";

const Footer = () => {
  return (
    <footer className="row bg-primary px-2 px-md-5 py-4 mt-auto">
      <div className="col d-none d-md-block">
        <b>Bibblis 2023</b>
        {' '}| <Link href="/terms-and-conditions">Términos y condiciones</Link>
        {' '}| <Link href="/cookie-policy">Cookies</Link>
      </div>
      <div className="col d-md-none">
        <p>
          <b>Bibblis 2023</b>
        </p>
        <p>
          <Link href="/terms-and-conditions">Términos y condiciones</Link>
        </p>
        <p>
          <Link href="/cookie-policy">Cookies</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
