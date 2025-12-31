import LegalLayout from "../components/LegalLayout";

const TermsAndConditions = () => {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="1 January 2026">
      <p>
        By accessing or using ArivoHomes, you agree to comply with and be bound by
        these Terms & Conditions.
      </p>

      <h3>1. Eligibility</h3>
      <p>
        You must be at least 18 years old to use our services.
      </p>

      <h3>2. User Responsibilities</h3>
      <ul>
        <li>Provide accurate information</li>
        <li>Do not post misleading or illegal listings</li>
        <li>Respect other users</li>
      </ul>

      <h3>3. Property Listings</h3>
      <p>
        ArivoHomes acts only as a platform. We do not own, verify, or guarantee
        any property listings.
      </p>

      <h3>4. Limitation of Liability</h3>
      <p>
        We are not responsible for disputes, losses, or damages arising between
        users.
      </p>

      <h3>5. Termination</h3>
      <p>
        We reserve the right to suspend or terminate accounts that violate our
        terms.
      </p>

      <h3>6. Governing Law</h3>
      <p>
        These terms are governed by the laws of India.
      </p>
    </LegalLayout>
  );
};

export default TermsAndConditions;
