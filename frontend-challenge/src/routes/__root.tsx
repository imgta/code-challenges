import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import '@/styles/main.css';

interface NavagationLink {
  to: string;
  label: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const footerNav: NavagationLink[] = [
  {
    to: 'https://imgta.dev', label: 'Devfolio',
    icon: (props) => (<svg viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M6.818 22v-2.857C6.662 17.592 5.633 16.416 4.682 15m9.772 7v-1.714c4.91 0 4.364-5.714 4.364-5.714s2.182 0 2.182-2.286l-2.182-3.428c0-4.572-3.709-6.816-7.636-6.857c-2.2-.023-3.957.53-5.27 1.499" /><path d="m13 7l2 2.5l-2 2.5M5 7L3 9.5L5 12m5-6l-2 7" /></g></svg>),
  }
];

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div className="min-h-screen flex flex-col">
          <header>
            <nav className="max-w-fit mx-auto px-8 py-4">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center mb-2 gap-2 logo">
                  <img src="/vite.svg" className="size-7" alt="Vite logo" />
                  <h1 className="text-3xl font-light tracking-tight">BYOB</h1>
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-1 mx-auto px-1 max-w-sm">
            <Outlet />
          </main>

          <footer className="mt-auto">
            <section className="mx-auto max-w-fit overflow-hidden px-6 lg:px-8 py-4 sm:py-8">
              <div className="mt-6 lg:mt-8 flex justify-center gap-x-12">
                {footerNav && footerNav.map(item =>
                  <Link
                    key={item.to}
                    to={item.to}
                    target='_blank'
                    className="text-foreground hover:scale-110 transition-transform duration-150">
                    <span className="sr-only">{item.label}</span>
                    {item.icon && (<item.icon aria-hidden="true" className="size-6" />)}
                  </Link >
                )}
              </div>
              <p className="mt-8 text-center text-sm/6 text-foreground/50">
                &copy; {new Date().getFullYear()} Gordon Ta. Happily based in Boston, MA.
              </p>
            </section>
          </footer>
        </div>

      </>
    );
  }
});