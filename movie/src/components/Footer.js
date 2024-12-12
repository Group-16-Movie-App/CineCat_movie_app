import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo-container">
                    <h2 className="footer-title">CineCat</h2>
                    <img src="/images/logo.png" alt="CineCat Logo" className="footer-logo" />
                </div>
                <nav>
                    <a href="/about" className="footer-link">About</a>
                    <a href="/services" className="footer-link">Services</a>
                    <a href="/contact" className="footer-link">Contact</a>
                    <a href="/privacy" className="footer-link">Privacy Policy</a>
                </nav>
                <div className="footer-social">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
                <div>
                    <p>&copy; {new Date().getFullYear()} CineCat. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
