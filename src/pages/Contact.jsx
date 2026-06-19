import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page fade-in">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Have questions? We would love to hear from you.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info card">
          <h2>Get in touch</h2>
          <p>
            Reach out for support, partnerships, or product feedback. Our team
            typically responds within 1–2 business days.
          </p>
          <ul className="contact-details">
            <li>
              <strong>Email</strong>
              <span>support@indiatrade.com</span>
            </li>
            <li>
              <strong>Hours</strong>
              <span>Mon–Fri, 9:00 AM – 6:00 PM IST</span>
            </li>
          </ul>
        </div>

        <form className="contact-form card" onSubmit={handleSubmit} noValidate>
          {submitted ? (
            <div className="form-success" role="status">
              <h3>Message sent!</h3>
              <p>Thank you for reaching out. We will get back to you soon.</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Send message
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;
