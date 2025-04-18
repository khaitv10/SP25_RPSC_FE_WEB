import { useState } from "react";

const AddressToCoordinates = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Lấy tọa độ từ địa chỉ
  const handleConvertToCoordinates = async () => {
    if (!address) return;

    try {
      const response = await fetch(
        https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0]; // OSM dùng 'lon' thay vì 'lng'
        setCoordinates({ lat, lng: lon });
        setResult(Tọa độ: ${lat}, ${lon});
        setError("");
      } else {
        setError("Không tìm thấy tọa độ. Hãy nhập địa chỉ chính xác hơn.");
        setResult(null);
      }
    } catch (err) {
      setError("Lỗi khi gọi API");
      setResult(null);
    }
  };

  // Lấy địa chỉ từ tọa độ
  const handleConvertToAddress = async () => {
    if (!coordinates.lat || !coordinates.lng) return;

    try {
      const response = await fetch(
        https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}
      );
      const data = await response.json();

      if (data.display_name) {
        setResult(Địa chỉ: ${data.display_name});
        setError("");
      } else {
        setError("Không tìm thấy địa chỉ. Hãy nhập tọa độ chính xác hơn.");
        setResult(null);
      }
    } catch (err) {
      setError("Lỗi khi gọi API");
      setResult(null);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">🔄 Chuyển đổi Địa chỉ ↔️ Tọa độ</h2>

      {/* Nhập địa chỉ */}
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Nhập địa chỉ..."
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleConvertToCoordinates}
        className="bg-blue-500 text-white p-2 w-full mb-4"
      >
        📍 Lấy tọa độ
      </button>

      {/* Nhập tọa độ */}
      <input
        type="text"
        value={coordinates.lat}
        onChange={(e) => setCoordinates({ ...coordinates, lat: e.target.value })}
        placeholder="Nhập vĩ độ (lat)..."
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        value={coordinates.lng}
        onChange={(e) => setCoordinates({ ...coordinates, lng: e.target.value })}
        placeholder="Nhập kinh độ (lng)..."
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleConvertToAddress}
        className="bg-green-500 text-white p-2 w-full"
      >
        🏠 Lấy địa chỉ
      </button>

      {/* Hiển thị kết quả */}
      {result && <p className="mt-2 text-green-600">{result}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AddressToCoordinates;