import LegalLayout from "../components/LegalLayout";

const PrivacyPolicy = () => {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="1 January 2026">
      <p>
        ArivoHomes ("we", "our", "us") respects your privacy and is committed to
        protecting the personal information of our users. This Privacy Policy
        explains how we collect, use, store, and protect your data when you use
        our website, mobile application, and related services.
      </p>

      <h3>1. Information We Collect</h3>
      <ul>
        <li>Personal details such as name, email address, phone number</li>
        <li>Account login information</li>
        <li>Property listings and preferences</li>
        <li>Device and usage data (IP address, browser type)</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <ul>
        <li>To provide and improve our services</li>
        <li>To verify users and prevent fraud</li>
        <li>To communicate important updates</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h3>3. Data Sharing</h3>
      <p>
        We do not sell or rent your personal data. Information may be shared only
        with trusted service providers or when legally required.
      </p>

      <h3>4. Data Security</h3>
      <p>
        We implement industry-standard security measures to protect your data.
        However, no system is completely secure, and we cannot guarantee
        absolute security.
      </p>

      <h3>5. Your Rights</h3>
      <p>
        You may request access, correction, or deletion of your personal data by
        contacting us at <b>support@arivohomes.com</b>.
      </p>

      <h3>6. Changes to This Policy</h3>
      <p>
        We may update this Privacy Policy periodically. Continued use of our
        services implies acceptance of the updated policy.
      </p>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
