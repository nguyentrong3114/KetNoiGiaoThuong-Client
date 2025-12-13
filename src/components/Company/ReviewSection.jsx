import { useState, useEffect } from "react";
import { listingApi, reviewApi } from "../../services/apiClient";
import { Star, ThumbsUp, MessageCircle, CheckCircle } from "lucide-react";

const ReviewSection = ({ productId, comments: initialComments = [], onCommentAdded }) => {
  const [activeTab, setActiveTab] = useState("reviews"); // reviews | comments
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Load reviews
  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const [reviewsRes, summaryRes] = await Promise.all([
        reviewApi.getAll({ listing_id: productId, per_page: 50 }),
        reviewApi.getSummary({ listing_id: productId }),
      ]);
      setReviews(reviewsRes?.data?.data || reviewsRes?.data || []);
      setReviewSummary(summaryRes?.data || null);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Load comments
  const loadComments = async () => {
    try {
      const response = await listingApi.getComments(productId);
      setComments(response?.data || response || []);
    } catch (err) {
      console.error("Error loading comments:", err);
      setComments(initialComments);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
      loadComments();
    }
  }, [productId]);

  useEffect(() => {
    if (initialComments.length > 0 && comments.length === 0) {
      setComments(initialComments);
    }
  }, [initialComments]);

  // Gửi bình luận mới
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!token || !user) {
      setError("Vui lòng đăng nhập để gửi bình luận!");
      return;
    }
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung bình luận!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await listingApi.postComment(productId, content.trim());
      setContent("");
      loadComments();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  // Gửi reply
  const handleReply = async (parentId) => {
    if (!token || !user) {
      alert("Vui lòng đăng nhập!");
      return;
    }
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      await listingApi.postReply(productId, replyContent.trim(), parentId);
      setReplyContent("");
      setReplyingTo(null);
      loadComments();
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  // Mark review helpful
  const handleMarkHelpful = async (reviewId) => {
    if (!token) {
      alert("Vui lòng đăng nhập!");
      return;
    }
    try {
      await reviewApi.markHelpful(reviewId);
      loadReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const totalComments = comments.reduce((t, c) => t + 1 + (c.replies?.length || 0), 0);
  const totalReviews = reviewSummary?.total_reviews || reviews.length;

  return (
    <div className="space-y-4" id="reviews-comments">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition border-b-2 ${
            activeTab === "reviews"
              ? "border-yellow-500 text-yellow-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Star size={18} />
          Đánh giá ({totalReviews})
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition border-b-2 ${
            activeTab === "comments"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <MessageCircle size={18} />
          Bình luận ({totalComments})
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="bg-white border rounded-lg p-6">
          {/* Summary */}
          {reviewSummary && totalReviews > 0 && (
            <div className="flex gap-8 mb-6 pb-6 border-b">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500">
                  {reviewSummary.average_rating?.toFixed(1) || "0"}
                </div>
                <div className="flex justify-center my-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(reviewSummary.average_rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">{totalReviews} đánh giá</div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewSummary.rating_distribution?.[star] || 0;
                  const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-12">{star} sao</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="w-8 text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải đánh giá...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star size={40} className="mx-auto mb-2 text-gray-300" />
              <p>Chưa có đánh giá nào</p>
              <p className="text-sm">Hãy mua sản phẩm để đánh giá!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} formatTime={formatTime} onHelpful={handleMarkHelpful} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          {/* Comments List */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💬 Bình luận ({totalComments})</h3>
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Chưa có bình luận nào.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    onSubmitReply={handleReply}
                    loading={loading}
                    token={token}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Viết bình luận</h3>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bình luận..."
              className="w-full p-3 border rounded-lg text-sm resize-none mb-4 focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi bình luận"}
            </button>
            {!token && (
              <p className="text-center text-sm text-gray-500 mt-3">
                <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a> để bình luận
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};


// Review Item Component
const ReviewItem = ({ review, formatTime, onHelpful }) => {
  const userName = review.user?.full_name || "Người dùng";
  const userAvatar = review.user?.avatar_url;

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm">{userName}</span>
            {review.is_verified_purchase && (
              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <CheckCircle size={12} /> Đã mua hàng
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{formatTime(review.created_at)}</span>
          </div>

          {/* Comment */}
          <p className="text-gray-700 text-sm mb-2">{review.comment}</p>

          {/* Images */}
          {review.images?.length > 0 && (
            <div className="flex gap-2 mb-2">
              {review.images.map((img, i) => (
                <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
              ))}
            </div>
          )}

          {/* Seller Reply */}
          {review.seller_reply && (
            <div className="bg-blue-50 rounded-lg p-3 mt-2">
              <p className="text-xs text-blue-600 font-medium mb-1">Phản hồi từ người bán:</p>
              <p className="text-sm text-gray-700">{review.seller_reply.content}</p>
            </div>
          )}

          {/* Helpful */}
          <button
            onClick={() => onHelpful(review.id)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 mt-2"
          >
            <ThumbsUp size={14} />
            Hữu ích ({review.helpful_count || 0})
          </button>
        </div>
      </div>
    </div>
  );
};

// Comment Item Component
const CommentItem = ({ comment, replyingTo, setReplyingTo, replyContent, setReplyContent, onSubmitReply, loading, token, formatTime }) => {
  const userName = comment.user?.full_name || comment.user_name || "Người dùng";
  const userAvatar = comment.user?.avatar_url || comment.user_avatar;
  const commentBody = comment.body || comment.content;

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm">{userName}</span>
            <span className="text-xs text-gray-500">{formatTime(comment.created_at)}</span>
          </div>
          <p className="text-gray-700 text-sm mb-2">{commentBody}</p>

          {token && (
            <button
              onClick={() => {
                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                setReplyContent("");
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              {replyingTo === comment.id ? "Hủy" : "Phản hồi"}
            </button>
          )}

          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Phản hồi ${userName}...`}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSubmitReply(comment.id);
                  }
                }}
              />
              <button
                onClick={() => onSubmitReply(comment.id)}
                disabled={loading || !replyContent.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Gửi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-12 mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-2">
              <div className="flex-shrink-0">
                {reply.user?.avatar_url ? (
                  <img src={reply.user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                    {(reply.user?.full_name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{reply.user?.full_name || "Người dùng"}</span>
                  <span className="text-xs text-gray-500">{formatTime(reply.created_at)}</span>
                </div>
                <p className="text-gray-700 text-sm">{reply.body || reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
