type Props = {
  label: string;
  value: number;
  onChange: (next: number) => void;
};

export function QuantityPicker({ label, value, onChange }: Props) {
  return (
    <span className="qty">
      <button
        aria-label={`Decrease ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span>Quantity: {value}</span>
      <button aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)}>
        +
      </button>
    </span>
  );
}
