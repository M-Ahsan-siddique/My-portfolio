import React, { useState } from 'react';
import myself from './assets/myself.jpg';
import { Mail, Phone, Sun, Moon } from 'lucide-react';

function App() {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Individual', // Individual or Company
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you! Connection to Firebase will be implemented soon.');
    };

    return (
        <div className="app-container">
            {/* Navbar / Header */}
            <header className="header">
                <h1 className="logo">MyPortfolio</h1>
                <nav>
                    <a href="#about">About</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                </nav>
            </header>

            {/* Hero Section */}
            <section id="about" className="hero">
                <div className="hero-content">
                    <h1>Hello, I'm <span className="highlight">Mahsa</span></h1>
                    <p className="subtitle">Java Developer | Database Expert | Creative Coder</p>
                    <p className="description">
                        I build powerful applications with Java, Visual Programming tools, and Robust Databases.
                        Check out my work below!
                    </p>
                </div>
                <div className="hero-image-container">
                    <img src={myself} alt="Me" className="hero-image" />
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="projects-section">
                <h2>Featured Projects</h2>
                <div className="projects-grid">

                    {/* Card 1: Audio Player */}
                    <div className="project-card">
                        <div className="card-badge">Java & DB</div>
                        <h3>Audio Player</h3>
                        <p>A sophisticated audio player that manages playlists and tracks using a SQL database backend.</p>
                        <div className="tags">
                            <span>Java</span>
                            <span>SQL</span>
                            <span>JDBC</span>
                        </div>
                    </div>

                    {/* Card 2: Path Finder */}
                    <div className="project-card">
                        <div className="card-badge">Java</div>
                        <h3>Path Finder</h3>
                        <p>An algorithmic visualization tool that finds the shortest path between nodes using graph theory.</p>
                        <div className="tags">
                            <span>Java</span>
                            <span>Algorithms</span>
                            <span>GUI</span>
                        </div>
                    </div>

                    {/* Card 3: Snake Game */}
                    <div className="project-card">
                        <div className="card-badge">Java</div>
                        <h3>Snake Game</h3>
                        <p>A classic Snake game reimplementation with smooth controls and scoring system.</p>
                        <div className="tags">
                            <span>Java</span>
                            <span>Game Loop</span>
                            <span>2D Graphics</span>
                        </div>
                    </div>

                    {/* Card 4: Application Hub */}
                    <div className="project-card">
                        <div className="card-badge">Visual Programming</div>
                        <h3>Application Hub</h3>
                        <p>A central hub for managing various tools, built with C# and powered by MySQL for secure data storage.</p>
                        <div className="tags">
                            <span>C#</span>
                            <span>MySQL</span>
                            <span>.NET</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <h2>Contact Us</h2>
                <div className="contact-container">
                    <div className="contact-info">
                        <div className="info-item">
                            <Mail className="icon" />
                            <span>email@example.com</span>
                        </div>
                        <div className="info-item">
                            <Phone className="icon" />
                            <span>+123 456 7890</span>
                        </div>
                        <p className="info-text">
                            Looking for a developer? Let's discuss your project!
                            Fill out the form and we'll get in touch.
                        </p>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>I am representing...</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="Individual">Individual</option>
                                <option value="Company">Company</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description of Inquiry</label>
                            <textarea
                                name="description"
                                rows="4"
                                placeholder="How can we help you?"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </section>

            <footer>
                <p>&copy; 2026 My Portfolio. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default App
