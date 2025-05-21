import { formatCurrency } from "@/src/utils";

type AmountProps = {
  label: string;
  amount: number;
  discount?: boolean;
};

export default function Amount({ label, amount, discount }: AmountProps) {
  return (
    <div
      className={`${
        discount && "text-green-900 bg-green-400"
      } flex justify-between p-1`}
    >
      <dt className={`font-bold`}>{label}</dt>
      <dd className={`text-gray-900 ${discount && "text-green-900"}`}>
        {`${discount ? "-" : ""} ${formatCurrency(amount)}`}
      </dd>
    </div>
  );
}
