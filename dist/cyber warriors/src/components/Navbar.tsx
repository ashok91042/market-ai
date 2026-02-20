import { Link, useLocation } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const links = [
  { to: "/", label: "cyber warriors" },
  { to: "/campaign", label: "cyber warriors" },
  { to: "/pitch", label: "cyber warriors" },
  { to: "/lead-score", label: "cyber warriors" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="flex items-center justify-between px-8 py-4 w-full">
      <Link to="/" className="flex items-center gap-2 text-foreground font-bold text-lg">
        <TrendingUp className="w-5 h-5 text-foreground" />
        <span className="font-display">cyber warriors</span>
      </Link>
      <ul className="flex items-center gap-8">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={`nav-link text-sm font-medium tracking-wide ${pathname === to ? "active font-semibold" : ""}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;


