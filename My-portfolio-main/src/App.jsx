import React, { useState, useEffect, useRef } from 'react';
import myself from './assets/profile_alt.jpeg';
import { Mail, Phone, Menu, X, ArrowDown } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import ThreeScene from './ThreeScene';

// ─── Project data ────────────────────────────────────────────────────────────
const PROJECTS = [
    {
        num: '01',
        stack: 'Java & SQL',
        title: 'Audio Player',
        desc: 'Database-driven audio management system with full playlist functionalities and real-time search.',
        tags: ['SQL', 'Java', 'JDBC'],
    },
    {
        num: '02',
        stack: 'Java',
        title: 'Path Finder',
        desc: 'Algorithmic visualizer for shortest-path graph theory with step-by-step Dijkstra animation.',
        tags: ['Algorithms', 'GUI', 'Graphs'],
    },
    {
        num: '03',
        stack: 'Game Dev',
        title: 'Snake Game',
        desc: 'Modern re-implementation of the classic arcade game with smooth controls and score persistence.',
        tags: ['Game Loop', '2D', 'OOP'],
    },
    {
        num: '04',
        stack: 'C# & MySQL',
        title: 'Application Hub',
        desc: 'Centralised tool management dashboard with varied integrations and role-based access control.',
        tags: ['.NET', 'MySQL', 'WinForms'],
    },
];

function App() {
    // ── State ──────────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        name: '', email: '', type: 'Individual', description: '',
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cardRefs = useRef([]);

    // ── VanillaTilt for project cards (pointer/mouse only — skip on touch) ────
    useEffect(() => {
        // Touch devices don't support tilt and it interferes with scroll
        const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        if (isTouch) return;

        const scriptId = 'vanilla-tilt-script';

        const initTilt = () => {
            if (!window.VanillaTilt) return;
            cardRefs.current.forEach((el) => {
                if (el && !el.vanillaTilt) {
                    window.VanillaTilt.init(el, {
                        max: 12,
                        speed: 400,
                        glare: true,
                        'max-glare': 0.2,
                        scale: 1.04,
                        perspective: 900,
                    });
                }
            });
        };

        if (document.getElementById(scriptId)) {
            initTilt();
        } else {
            const script = document.createElement('script');
            script.id  = scriptId;
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js';
            script.onload = initTilt;
            document.body.appendChild(script);
        }

        return () => {
            cardRefs.current.forEach((el) => {
                if (el && el.vanillaTilt) el.vanillaTilt.destroy();
            });
        };
    }, []);

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleChange  = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const toggleMenu    = ()  => setIsMenuOpen(!isMenuOpen);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'contacts'), {
                ...formData,
                timestamp: new Date(),
            });
            alert('Message sent successfully!');
            setFormData({ name: '', email: '', type: 'Individual', description: '' });
        } catch (err) {
            alert('Error sending message: ' + err.message);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="app-container">

            {/* ── Fixed Three.js canvas (always behind everything) ── */}
            <ThreeScene />

            {/* ── Navbar ── */}
            <header className="header">
                <h1 className="logo">Ahsan.Portfolio</h1>

                <nav className="desktop-nav">
                    <a href="#about">About</a>
                    <a href="#projects">Work</a>
                    <a href="#contact">Contact</a>
                </nav>

                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <nav>
                        <a href="#about"    onClick={toggleMenu}>About</a>
                        <a href="#projects" onClick={toggleMenu}>Work</a>
                        <a href="#contact"  onClick={toggleMenu}>Contact</a>
                    </nav>
                </div>
            </header>

            {/* ════════════════════════════════════════════════════════════════
                HERO — cube sits dead-center, text on the left half
            ════════════════════════════════════════════════════════════════ */}
            <section id="about" className="hero">
                {/* Text lives on the left half; cube occupies the right half via Three.js */}
                <div className="hero-text-block">
                    <span className="subtitle">Java &amp; Database Developer</span>
                    <h1 className="hero-title">
                        BUILDING<br />
                        DIGITAL<br />
                        EXPERIENCES
                    </h1>
                    <p className="description">
                        I craft sophisticated applications using robust Java / C# backends
                        and intuitive data architecture. Blending logic with creativity.
                    </p>
                    <div className="hero-profile">
                        <img src={myself} alt="Ahsan Siddique" className="hero-image" loading="eager" />
                        <div className="hero-name-block">
                            <span className="hero-name">Ahsan Siddique</span>
                            <span className="hero-role">Backend &amp; Database Engineer</span>
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
                <a href="#projects" className="scroll-hint" aria-label="Scroll to projects">
                    <span>Scroll</span>
                    <ArrowDown size={18} className="scroll-arrow" />
                </a>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                PROJECT SECTIONS — each full-height, card on alternating side
                Cube (Three.js) flies to the OPPOSITE side of the card
            ════════════════════════════════════════════════════════════════ */}
            <section id="projects" className="projects-label-section">
                <h2 className="section-title">SELECTED WORK</h2>
            </section>

            {PROJECTS.map((project, i) => {
                const isLeft = i % 2 === 0; // card on left → cube flies right
                return (
                    <section
                        key={project.num}
                        className={`project-section ${isLeft ? 'card-left' : 'card-right'}`}
                    >
                        <div
                            className="project-card"
                            ref={(el) => (cardRefs.current[i] = el)}
                        >
                            <div className="card-inner">
                                <span className="card-badge">{project.num} — {project.stack}</span>
                                <h3>{project.title}</h3>
                                <p>{project.desc}</p>
                                <div className="tags">
                                    {project.tags.map((t) => <span key={t}>{t}</span>)}
                                </div>
                            </div>
                        </div>

                        {/* Section number watermark */}
                        <span className="section-num-watermark">{project.num}</span>
                    </section>
                );
            })}

            {/* ════════════════════════════════════════════════════════════════
                CONTACT
            ════════════════════════════════════════════════════════════════ */}
            <section id="contact" className="contact-section">
                <h2 className="section-title">LET'S CONNECT</h2>
                <div className="contact-container">
                    <div className="contact-info">
                        <p className="info-text">
                            Interested in collaboration?<br />
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
                            <input type="text"  name="name"  value={formData.name}  onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
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
                            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required />
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
    );
}

export default App;
