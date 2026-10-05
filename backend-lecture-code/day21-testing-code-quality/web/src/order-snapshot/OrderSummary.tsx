// The confirmation shown after an order is placed. Small, stable markup
// that rarely changes, which is what makes it a fair snapshot-test target.

type Props = { id: number; total: number };

export function OrderSummary({ id, total }: Props) {
  return (
    <section>
      <p data-testid="confirmation">Order placed</p>
      <p>
        Order #{id} · total ${total}
      </p>
    </section>
  );
}
