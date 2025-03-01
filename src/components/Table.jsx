import '@fortawesome/fontawesome-free/css/all.min.css';

const Table = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Room Request</h2>
        <button className="bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-300">
          View more
        </button>
      </div>
      <table className="w-full table-auto mt-4 border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3 border-b border-gray-200">RoomID</th>
            <th className="text-left p-3 border-b border-gray-200">Landlord</th>
            <th className="text-left p-3 border-b border-gray-200">Phone</th>
            <th className="text-left p-3 border-b border-gray-200">Email</th>
            <th className="text-left p-3 border-b border-gray-200">Address</th>
            <th className="text-left p-3 border-b border-gray-200">Status</th>
            <th className="text-left p-3 border-b border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((room) => (
            <tr key={room.RoomID} className="text-center">
              <td className="p-3 border-b border-gray-200">{room.RoomID}</td>
              <td className="p-3 border-b border-gray-200">{room.landlord}</td>
              <td className="p-3 border-b border-gray-200">{room.phone}</td>
              <td className="p-3 border-b border-gray-200">{room.email}</td>
              <td className="p-3 border-b border-gray-200">{room.address}</td>
              <td className="p-3 border-b border-gray-200">
                <span className="bg-yellow-400 text-black py-1 px-3 rounded-full">{room.status}</span>
              </td>
              <td className="p-3 border-b border-gray-200">
                <i className="fas fa-eye text-blue-500 hover:text-blue-700 cursor-pointer"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
