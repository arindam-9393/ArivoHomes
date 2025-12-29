const About = () => {
    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .about-wrapper {
                    background: #f8fafc;
                    padding: 80px 20px;
                }

                .about-container {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* HERO */
                .about-hero {
                    text-align: center;
                    margin-bottom: 80px;
                }

                .about-hero h1 {
                    font-size: 3.2rem;
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.02em;
                    margin-bottom: 24px;
                }

                .about-hero p {
                    font-size: 1.25rem;
                    color: #475569;
                    max-width: 760px;
                    margin: 0 auto;
                    line-height: 1.7;
                }

                /* IMAGE */
                .about-image {
                    width: 100%;
                    border-radius: 24px;
                    margin-bottom: 90px;
                    box-shadow: 0 30px 60px rgba(15, 23, 42, 0.15);
                }

                /* STORY SECTION */
                .about-card {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 60px;
                    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
                }

                .about-card h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 24px;
                    letter-spacing: -0.01em;
                }

                .about-card p {
                    font-size: 1.05rem;
                    color: #334155;
                    line-height: 1.9;
                    margin-bottom: 20px;
                }

                .about-highlight {
                    font-weight: 600;
                    color: #020617;
                }

                /* VALUES */
                .values {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 30px;
                    margin-top: 80px;
                }

                .value-card {
                    background: #ffffff;
                    border-radius: 18px;
                    padding: 40px;
                    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
                }

                .value-card h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 12px;
                }

                .value-card p {
                    font-size: 0.95rem;
                    color: #475569;
                    line-height: 1.7;
                }

                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .about-hero h1 {
                        font-size: 2.4rem;
                    }

                    .about-card {
                        padding: 40px 28px;
                    }
                }
            `}</style>

            <div className="about-wrapper">
                <div className="about-container">
                    {/* HERO */}
                    <section className="about-hero">
                        <h1>About ArivoHomes</h1>
                        <p>
                            ArivoHomes is building the infrastructure that powers a more transparent,
                            secure, and intelligent rental ecosystem across India.
                        </p>
                    </section>

                    {/* IMAGE */}
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                        alt="ArivoHomes Team"
                        className="about-image"
                    />

                    {/* STORY */}
                    <section className="about-card">
                        <h2>Our Story</h2>
                        <p>
                            ArivoHomes was founded in 2024 with a single, deeply practical question:
                            <span className="about-highlight">
                                {" "}why has renting remained broken for so long?
                            </span>
                        </p>

                        <p>
                            High brokerage fees, unreliable listings, lack of trust, and inefficient
                            processes have historically defined the rental experience. We believed
                            this was unacceptable in a digital-first economy.
                        </p>

                        <p>
                            Today, ArivoHomes enables verified property owners and serious tenants
                            to transact with confidence. By combining technology, verification,
                            and data-driven insights, we are redefining how housing is discovered,
                            evaluated, and rented.
                        </p>
                    </section>

                    {/* VALUES */}
                    <section className="values">
                        <div className="value-card">
                            <h3>Trust by Design</h3>
                            <p>
                                Every listing, owner, and tenant is verified to ensure reliability
                                and long-term confidence.
                            </p>
                        </div>

                        <div className="value-card">
                            <h3>Operational Excellence</h3>
                            <p>
                                We focus relentlessly on efficiency, accuracy, and scale — because
                                housing decisions demand precision.
                            </p>
                        </div>

                        <div className="value-card">
                            <h3>Long-Term Impact</h3>
                            <p>
                                Our mission is not short-term growth, but building durable systems
                                that improve housing access for millions.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default About;
