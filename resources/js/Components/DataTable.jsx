export default function DataTable({ columns, data = [], emptyMessage = 'No records found.' }) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 ${column.headerClassName ?? ''}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-10 text-center text-sm text-slate-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={row.id ?? idx} className="hover:bg-slate-50/60">
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={`px-4 py-3 text-sm text-slate-700 ${column.className ?? ''}`}
                                        >
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
