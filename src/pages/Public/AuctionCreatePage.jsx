import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Image as ImageIcon, XCircle } from "lucide-react";

const AuctionCreatePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
    endsAt: "",
  });

  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => handleImageUpload(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Vui lòng thêm ảnh sản phẩm!");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      start_price: Number(form.price),
      ends_at: new Date(form.endsAt).toISOString(),
    };

    try {
      setLoading(true);

      const res = await auctionApi.create(payload);

      if (res?.status === "success") {
        alert("🎉 Đăng sản phẩm đấu giá thành công!");
        navigate("/auction");
      }
    } catch (err) {
      console.error("Lỗi tạo đấu giá:", err);
      alert("Không thể đăng sản phẩm! Backend chưa hỗ trợ API này.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">
        Đăng sản phẩm đấu giá
      </h2>

      <div className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl p-10 border border-gray-100">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT FORM */}
          <div className="space-y-7">
            <div>
              <label className="font-semibold text-gray-700">Tên sản phẩm</label>
              <input
                name="title"
                type="text"
                className="w-full border rounded-xl px-4 py-3 mt-2 bg-gray-50 focus:ring-2 
                focus:ring-blue-400 shadow-sm outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Mô tả</label>
              <textarea
                name="description"
                rows="4"
                className="w-full border rounded-xl px-4 py-3 mt-2 bg-gray-50 focus:ring-2 
                focus:ring-blue-400 shadow-sm outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Giá khởi điểm (VNĐ)</label>
              <input
                name="price"
                type="number"
                className="w-full border rounded-xl px-4 py-3 mt-2 bg-gray-50 focus:ring-2 
                focus:ring-blue-400 shadow-sm outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Thời gian kết thúc</label>
              <input
                name="endsAt"
                type="datetime-local"
                className="w-full border rounded-xl px-4 py-3 mt-2 bg-gray-50 focus:ring-2 
                focus:ring-blue-400 shadow-sm outline-none"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* RIGHT IMAGE UPLOAD */}
          <div>
            <label className="font-semibold text-gray-700 block mb-3">Ảnh sản phẩm</label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer 
              transition h-64 flex flex-col items-center justify-center
              ${
                dragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {!preview ? (
                <div className="flex flex-col items-center">
                  <UploadCloud className="text-gray-500 mb-3" size={40} />
                  <p className="text-gray-600 mb-2">Kéo hình vào đây hoặc</p>

                  <label
                    htmlFor="upload"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow 
                    hover:bg-indigo-700 cursor-pointer transition"
                  >
                    Chọn ảnh
                  </label>

                  <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl shadow"
                />
              )}
            </div>

            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  setForm({ ...form, image: "" });
                }}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500 text-white 
                rounded-lg hover:bg-red-600 transition"
              >
                <XCircle size={18} />
                Xóa ảnh
              </button>
            )}
          </div>
        </form>

        {/* SUBMIT BUTTON */}
        <div className="mt-10">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`w-full py-3.5 text-lg rounded-xl shadow text-white transition 
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95"
            }`}
          >
            {loading ? "Đang gửi..." : "Đăng sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCreatePage;
