import jsPDF from "jspdf";

const generateCertificate = (
  user,
  category,
  score,
  total
) => {
  const doc = new jsPDF(
    "landscape"
  );

  const percentage = (
    (score / total) *
    100
  ).toFixed(0);

  doc.setFontSize(28);
  doc.text(
    "CERTIFICATE OF ACHIEVEMENT",
    65,
    40
  );

  doc.setFontSize(18);
  doc.text(
    "This Certificate is Proudly Presented To",
    80,
    60
  );

  doc.setFontSize(24);
  doc.text(
    user?.name || "Student",
    120,
    80
  );

  doc.setFontSize(16);
  doc.text(
    `For Successfully Completing the ${category} Quiz`,
    70,
    100
  );

  doc.text(
    `Score: ${score}/${total} (${percentage}%)`,
    105,
    120
  );

  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    110,
    140
  );

  doc.save(
    `${user?.name}_Certificate.pdf`
  );
};

export default generateCertificate;