import Link from 'next/link';

export default ({ currentuser }) => {
  const links = [
    !currentuser && { label: 'Sign In', href: '/auth/signin' },
    !currentuser && { label: 'Sign Up', href: '/auth/signup' },
    currentuser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentuser && { label: 'My Orders', href: '/orders' },
    currentuser && { label: 'Sign Out', href: '/auth/signout' }
  ]
    .filter((linkconfig) => linkconfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GITX</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-item-center">{links}</ul>
      </div>
    </nav>
  );
};
