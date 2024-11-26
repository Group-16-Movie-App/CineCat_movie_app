const Footer = () => {
    return (
        <footer style={{
            backgroundColor: "#333",
            color: "white",
            padding: "1rem 2rem",
            textAlign: "center"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem"
            }}>
                {/* Logo or Brand Name */}
                <div>
                    <h2>My Website</h2>
                </div>

                {/* Navigation Links */}
                <nav>
                    <a href="/about" style={linkStyle}>About</a>
                    <a href="/services" style={linkStyle}>Services</a>
                    <a href="/contact" style={linkStyle}>Contact</a>
                    <a href="/privacy" style={linkStyle}>Privacy Policy</a>
                </nav>

                {/* Social Media Links */}
                <div>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                        <img src="/twitter-icon.png" alt="Twitter" width="20" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                        <img src="/facebook-icon.png" alt="Facebook" width="20" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                        <img src="/instagram-icon.png" alt="Instagram" width="20" />
                    </a>
                </div>

                {/* Copyright */}
                <div>
                    <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// Reusable Styles
const linkStyle = {
    margin: "0 10px",
    color: "white",
    textDecoration: "none"
};

const iconStyle = {
    margin: "0 5px"
};

export default Footer;
