import LegalLayout from "../components/LegalLayout";

const SafetyGuide = () => {
  return (
    <LegalLayout title="Safety Guide" lastUpdated="—">
      <p>
        Your safety is important to us. Please follow these guidelines while
        using ArivoHomes.
      </p>

      <ul>
        <li>Always visit properties before making payments</li>
        <li>Do not share OTPs or passwords</li>
        <li>Be cautious of deals that seem too good to be true</li>
        <li>Report suspicious activity immediately</li>
      </ul>

      <p>
        ArivoHomes does not handle payments between users.
      </p>
    </LegalLayout>
  );
};

export default SafetyGuide;
