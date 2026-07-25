import React, { useState } from 'react';
import myself from './assets/profile_alt.jpeg';
import { Mail, Phone, Menu, X } from 'lucide-react'; // Removed Sun/Moon as we are enforcing the dark Igloo aesthetic
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";


function App() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'Individual', // Individual or Company
        description: ''
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "contacts"), {
                name: formData.name,
                email: formData.email,
                type: formData.type,
                description: formData.description,
                timestamp: new Date()
            });
            alert("Message sent successfully!");
            setFormData({ name: '', email: '', type: 'Individual', description: '' });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error sending message: " + error.message);
        }
    };

    return (
        <div className="app-container">
            {/* Navbar */}
            <header className="header">
                <h1 className="logo">Ahsan.Portfolio</h1>

                {/* Desktop Nav */}
                <nav className="desktop-nav">
                    <a href="#about">About</a>
                    <a href="#projects">Work</a>
                    <a href="#contact">Contact</a>
                </nav>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Nav Overlay */}
                <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <nav>
                        <a href="#about" onClick={toggleMenu}>About</a>
                        <a href="#projects" onClick={toggleMenu}>Work</a>
                        <a href="#contact" onClick={toggleMenu}>Contact</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section id="about" className="hero">
                <div className="hero-content">
                    <span className="subtitle">Java & Database Developer</span>
                    <h1>BUILDING<br />DIGITAL<br />EXPERIENCES</h1>
                    <p className="description">
                        I craft sophisticated applications using robust Java/C# backends and intuitive data architecture.
                        Blending logic with creativity.
                    </p>
                </div>
                <div className="hero-image-container">
                    {/* Image is now rectangular and grayscale via CSS */}
                    <img src={myself} alt="Me" className="hero-image" loading="eager" />
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="projects-section">
                <h2 className="section-title">SELECTED WORK</h2>
                <div className="projects-grid">

                    <div className="project-card">
                        <span className="card-badge">01 — Java & SQL</span>
                        <h3>Audio Player</h3>
                        <p>Database-driven audio management system with playlist functionalities.</p>
                        <div className="tags">
                            <span>SQL</span>
                            <span>Java</span>
                        </div>
                    </div>

                    <div className="project-card">
                        <span className="card-badge">02 — Java</span>
                        <h3>Path Finder</h3>
                        <p>Algorithmic visualization for shortest-path graph theory.</p>
                        <div className="tags">
                            <span>Algorithms</span>
                            <span>GUI</span>
                        </div>
                    </div>

                    <div className="project-card">
                        <span className="card-badge">03 — Game Dev</span>
                        <h3>Snake Game</h3>
                        <p>Modern re-implementation of the classic arcade game.</p>
                        <div className="tags">
                            <span>Game Loop</span>
                            <span>2D</span>
                        </div>
                    </div>

                    <div className="project-card">
                        <span className="card-badge">04 — C# & MySQL</span>
                        <h3>Application Hub</h3>
                        <p>Centralized tool management dashboard with varied integrations.</p>
                        <div className="tags">
                            <span>.NET</span>
                            <span>MySQL</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <h2 className="section-title">LET'S CONNECT</h2>
                <div className="contact-container">
                    <div className="contact-info">
                        <p className="info-text">
                            Interested in collaboration? <br />
                            Fill out the form or reach out directly.
                        </p>
                        <div className="info-item">
                            <Mail size={18} />
                            <span>M.Ahsansiddique@hotmail.com</span>
                        </div>
                        <div className="info-item">
                            <Phone size={18} />
                            <span>+923141483597</span>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Representing</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="Individual">Individual</option>
                                <option value="Company">Company</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Inquiry</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Send Info</button>
                    </form>
                </div>
            </section>

            <footer>
                <p>Designed by Ahsan Siddique</p>
                <p>&copy; 2026</p>
            </footer>
        </div>
    )
}

export default App
