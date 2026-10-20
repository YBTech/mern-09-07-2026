type Props = { text: string; image?: string | null };

// The receipt: the photo when there is one, otherwise the OCR text (monospace, the columns matter)
export default function ReceiptView({ text, image }: Props) {
  if (image) return <img className="receipt-image" src={image} alt="Receipt" />;
  if (!text) return <p className="receipt none">No receipt attached.</p>;
  return <pre className="receipt">{text}</pre>;
}
