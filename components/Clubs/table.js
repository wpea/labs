import moment from "moment";
import { formatValue } from "react-currency-input-field";

// {
//   moment().format("MMM Do YY");
// }

// {
//   formatValue({
//     value: String(2999),
//     intlConfig: { locale: "en-US", currency: "NGN" },
//   });
// }
export default function Table({ th, tr }) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-2xs capitalize font-normal text-gray-700 uppercase bg-gray-50">
          <tr>
            {th.map((title) => (
              <th scope="col" className="px-6 py-3">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b">
            {tr.map((data) => (
              <td className="px-6 py-4">{data}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
