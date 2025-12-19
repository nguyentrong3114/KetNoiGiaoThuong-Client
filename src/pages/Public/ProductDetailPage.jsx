import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { listingApi } from "../../services/apiClient";

// Giữ nguyên các import component con của bạn
import ProductShowcase from "../../components/Company/ProductShowcase";
import ProductDetails from "../../components/Company/ProductDetails";
import ReviewSection from "../../components/Company/ReviewSection";
import ChatWithShop from "../../components/Company/ChatWithShop";

const ProductDetailPage = () => {
  /* ============================
     GIỮ NGUYÊN LOGIC CỦA BẠN
  ============================ */
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await listingApi.getById(id);
      console.log("📦 Product API response:", response);
      console.log("💰 Price fields:", {
        price_cents: response?.price_cents,
        price: response?.price,
      });
      if (response) {
        setProduct(response);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const handleCommentAdded = () => {
    fetchProduct();
  };

  /* ============================
        UI NÂNG CẤP
  ============================ */
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* 🔙 NAVIGATION BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors text-sm"
          >
            <div className="p-1 rounded-full group-hover:bg-indigo-50 transition-colors">
              <ArrowLeft size={18} />
            </div>
            Quay lại danh sách
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="container max-w-7xl mx-auto px-4 pt-8">
        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Đang tải thông tin sản phẩm...</p>
          </div>
        )}

        {/* NOT FOUND STATE */}
        {!loading && !product && (
          <div className="flex flex-col items-center justify-center py-20 min-h-[50vh] bg-white rounded-3xl border border-dashed border-slate-300 mx-auto max-w-2xl mt-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-slate-500 mb-6 text-center max-w-md">
              Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không chính xác.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Về trang chủ
            </button>
          </div>
        )}

        {/* PRODUCT CONTENT */}
        {!loading && product && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ================= LEFT COLUMN: IMAGES & CHAT (Sticky) ================= */}
            {/* Chiếm 5/12 cột */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 z-10">
              {/* Product Showcase (Images) Wrapper */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <ProductShowcase productId={id} product={product} />
              </div>

              {/* Chat With Shop Wrapper */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5">
                <div className="flex items-center gap-3 mb-3 border-b border-slate-50 pb-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Thông tin cửa hàng</h4>
                    <p className="text-xs text-slate-500">Hỗ trợ 24/7</p>
                  </div>
                </div>
                <ChatWithShop product={product} />
              </div>
            </div>

            {/* ================= RIGHT COLUMN: DETAILS & REVIEWS ================= */}
            {/* Chiếm 7/12 cột */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Product Details Wrapper */}
              <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
                <ProductDetails productId={id} slug={slug} product={product} />
              </div>

              {/* Reviews Wrapper */}
              <div
                className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8"
                id="reviews-section"
              >
                <ReviewSection
                  productId={id}
                  comments={product?.comments_list || []}
                  onCommentAdded={handleCommentAdded}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
