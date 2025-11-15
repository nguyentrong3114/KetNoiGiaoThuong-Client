import React, { useState } from "react";

const AuctionCreatePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
    endsAt: "",
  });

  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⬆️ UPLOAD ẢNH (file input hoặc kéo thả)
  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    handleImageUpload(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Vui lòng thêm ảnh sản phẩm!");
      return;
    }

    const auctions = JSON.parse(localStorage.getItem("auctions") || "[]");

    const newAuction = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      image: form.image,
      currentBid: Number(form.price),
      endsAt: new Date(form.endsAt).toISOString(),
      seller: "Bạn",
      condition: "Mới 100%",
      highestBidder: null,
    };

    auctions.push(newAuction);
    localStorage.setItem("auctions", JSON.stringify(auctions));

    alert("🎉 Đăng sản phẩm thành công!");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900">Đăng sản phẩm đấu giá</h2>

      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT FORM */}
          <div className="space-y-6">
            {/* TÊN */}
            <div>
              <label className="font-semibold text-gray-700">Tên sản phẩm</label>
              <input
                name="title"
                type="text"
                className="w-full border rounded-lg px-4 py-3 mt-1 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
                onChange={handleChange}
                required
              />
            </div>

            {/* MÔ TẢ */}
            <div>
              <label className="font-semibold text-gray-700">Mô tả</label>
              <textarea
                name="description"
                rows="4"
                className="w-full border rounded-lg px-4 py-3 mt-1 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
                onChange={handleChange}
              />
            </div>

            {/* GIÁ */}
            <div>
              <label className="font-semibold text-gray-700">Giá khởi điểm</label>
              <input
                name="price"
                type="number"
                className="w-full border rounded-lg px-4 py-3 mt-1 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
                onChange={handleChange}
                required
              />
            </div>

            {/* THỜI GIAN */}
            <div>
              <label className="font-semibold text-gray-700">Thời gian kết thúc</label>
              <input
                name="endsAt"
                type="datetime-local"
                className="w-full border rounded-lg px-4 py-3 mt-1 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* RIGHT UPLOAD IMAGE */}
          <div>
            <label className="font-semibold text-gray-700 block mb-2">Ảnh sản phẩm</label>

            {/* UPLOAD BOX */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
              }`}
            >
              {!preview ? (
                <>
                  <p className="text-gray-600 mb-3">Kéo hình vào đây hoặc</p>

                  <label
                    htmlFor="upload"
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 cursor-pointer"
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
                </>
              ) : (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-64 object-cover rounded-lg shadow"
                />
              )}
            </div>

            {/* NÚT XÓA ẢNH */}
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  setForm({ ...form, image: "" });
                }}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Xóa ảnh
              </button>
            )}
          </div>
        </form>

        {/* BUTTON SUBMIT */}
        <div className="mt-10">
          <button
            onClick={handleSubmit}
            className="w-full py-3 text-lg bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            Đăng sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCreatePage;
