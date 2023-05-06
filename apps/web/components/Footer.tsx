import Link from "next/link";

const Footer = () => {
  return (
    <footer className="row bg-primary px-2 px-md-5 py-4">
      <div className="col">
        <b>Bibblis 2023</b>
        {' '}| <Link href="/terms-and-conditions">Términos y condiciones</Link>
        {' '}| <Link href="/cookie-policy">Cookies</Link>
      </div>
    </footer>
  );
};

export default Footer;
