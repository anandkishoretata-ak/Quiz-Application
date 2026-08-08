import jsPDF from "jspdf";

const generatePdf = (
  user,
  category,
  score,
  total
) => {
  const doc = new jsPDF();

  const percentage = (
    (score / total) *
    100
  ).toFixed(0);

  doc.setFontSize(20);
  doc.text(
    "Quiz Result Report",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Student Name: ${
      user?.name || "Guest"
    }`,
    20,
    40
  );

  doc.text(
    `Email: ${
      user?.email || "N/A"
    }`,
    20,
    50
  );

  doc.text(
    `Quiz Category: ${category}`,
    20,
    60
  );

  doc.text(
    `Score: ${score}/${total}`,
    20,
    70
  );

  doc.text(
    `Percentage: ${percentage}%`,
    20,
    80
  );

  doc.text(
    `Result: ${
      percentage >= 50
        ? "PASSED"
        : "FAILED"
    }`,
    20,
    90
  );

  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    20,
    100
  );

  doc.save(
    `${category}-Result.pdf`
  );
};

export default generatePdf;