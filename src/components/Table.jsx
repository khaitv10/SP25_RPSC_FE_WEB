const Table = ({ data, onViewMore }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="mr-2">🏠</span> Landlord Requests
        </h2>
        <button 
          className="bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-300"
          onClick={onViewMore}
        >
          View more
        </button>
      </div>

      {/* 🔹 Định dạng bảng cho chuẩn */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border border-gray-300">Landlord ID</th>
            <th className="p-3 border border-gray-300">Full Name</th>
            <th className="p-3 border border-gray-300">Phone</th>
            <th className="p-3 border border-gray-300">Email</th>
            <th className="p-3 border border-gray-300 text-center">Status</th> {/* 🔹 Căn giữa */}
          </tr>
        </thead>
        <tbody>
          {data.map((landlord) => (
            <tr key={landlord.landlordId} className="border border-gray-300">
              <td className="p-3 border border-gray-300">{landlord.landlordId}</td>
              <td className="p-3 border border-gray-300">{landlord.fullName}</td>
              <td className="p-3 border border-gray-300">{landlord.phoneNumber}</td>
              <td className="p-3 border border-gray-300">{landlord.email}</td>
              <td className="p-3 border border-gray-300 text-center">
                <span className="bg-yellow-400 text-black py-1 px-3 rounded-full">
                  {landlord.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
