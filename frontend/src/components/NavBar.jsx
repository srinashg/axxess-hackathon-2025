import CSS from "./NavBar.module.css";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav id={CSS.nav}>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="register">Register</Link>
        </nav>
    )
}

export default NavBar;