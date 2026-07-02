const receptions = [
  {
    number: "REC-0001",
    supplier: "Vaporesso",
    carrier: "Chronopost",
    dock: "Quai 2",
    pallets: 12,
    status: "Prévu",
  },
  {
    number: "REC-0002",
    supplier: "GeekVape",
    carrier: "UPS",
    dock: "Quai 1",
    pallets: 8,
    status: "À quai",
  },
  {
    number: "REC-0003",
    supplier: "Voopoo",
    carrier: "DHL",
    dock: "Quai 4",
    pallets: 16,
    status: "Terminé",
  },
];

export default function ReceptionTable() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-800">

          <tr>
            <th className="p-4 text-left">Réception</th>
            <th className="p-4 text-left">Fournisseur</th>
            <th className="p-4 text-left">Transporteur</th>
            <th className="p-4 text-left">Quai</th>
            <th className="p-4 text-left">Palettes</th>
            <th className="p-4 text-left">Statut</th>
          </tr>

        </thead>

        <tbody>

          {receptions.map((item) => (

            <tr
              key={item.number}
              className="border-t border-slate-800 hover:bg-slate-800"
            >

              <td className="p-4 font-bold">
                {item.number}
              </td>

              <td className="p-4">
                {item.supplier}
              </td>

              <td className="p-4">
                {item.carrier}
              </td>

              <td className="p-4">
                {item.dock}
              </td>

              <td className="p-4">
                {item.pallets}
              </td>

              <td className="p-4">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  {item.status}
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}