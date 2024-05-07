import React from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

interface FooterLink {
    label: string;
    href: string;
}

const backgroundImages = {
    backgroundImage1: 'url(logo512.png)',
    // backgroundImage2: 'url(public/logo512.png)',
    // backgroundImage3: 'url(public/logo512.png)',
};

const footerLinks: FooterLink[] = [
    {label: 'Contact Us', href: '#contact'},
    {label: 'About Us', href: '#about'},
    // Add more links as needed
];

const Home = () => {
    return (
        <div

        >
            <Container>
                <div
                    style={{
                        textAlign: 'center',
                        height: '100vh',
                        // backgroundImage: backgroundImages.backgroundImage1,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'top',
                        marginTop: '10rem'
                    }}
                >
                    <Typography align={"center"} variant="h5" style={{marginTop: '2rem', marginBottom: '2rem'}}>
                        Our Mission
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        <div className={'typewriter'}>
                        Making Sunday Morning Planning Easier
                        </div>
                    </Typography>
                </div>

                <div
                    style={{
                        textAlign: 'center',
                        height: '70vh',
                        backgroundImage: backgroundImages.backgroundImage1,
                        // backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="body1" style={{marginTop: '2rem', marginBottom: '2rem'}}>
                        what is this
                    </Typography>
                </div>

            </Container>
            <footer style={{
                marginTop: 'auto',
                backgroundColor: '#555',
                color: '#fff',
                padding: '1rem',
                height: '10rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <Container>
                    {footerLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            style={{marginRight: '1rem', color: '#fff', textDecoration: 'none'}}
                        >
                            {link.label}
                        </a>
                    ))}
                </Container>
            </footer>
        </div>
    );
};

export default Home;