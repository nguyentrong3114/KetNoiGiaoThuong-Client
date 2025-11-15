import React, { useState } from 'react';
import CountdownTimer from '../../components/CountdownTimer';
import BidModal from '../../components/BidModal';
import ReviewForm from '../../components/ReviewForm';

const sampleProducts = {
    id: 1,
    title: 'Đồng hồ cổ điển',
    description:
        'Đồng hồ chất lượng, đấu giá mở hôm nay. Mặt số bằng pha lê, dây da cổ điển, bảo hành 6 tháng. Thích hợp cho người sưu tầm.',
    image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fbenhviendongho.vn%2Fchiec-dong-ho-dat-nhat-the-gioi%2F&psig=AOvVaw2LtA-Ddqmp184qubJ4AgXH&ust=1763193531439000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJDJ3vWV8ZADFQAAAAAdAAAAABAM',
    currentBid: 500000,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    seller: 'Người bán ABC',
    condition: 'Like new',
}


const AuctionPage = () => {
    const product = sampleProducts;
    const [isBidOpen, setIsBidOpen] = useState(false);

    const handleReview = (payload) => {
        console.log('Review submitted', payload);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h2 className="text-3xl font-extrabold">{product.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Chi tiết sản phẩm và giao diện đặt giá</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: large image */}
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <img src={product.image} alt={product.title} className="w-full h-[520px] object-cover" />
                </div>

                {/* Right: product info and actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold leading-tight">{product.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{product.condition} · {product.seller}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">Kết thúc</div>
                                <CountdownTimer targetDate={product.endsAt} />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 items-center">
                            <div>
                                <div className="text-sm text-gray-400">Giá hiện tại</div>
                                <div className="text-3xl font-extrabold text-indigo-600">₫{product.currentBid.toLocaleString('vi-VN')}</div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setIsBidOpen(true)}
                                    className="px-5 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                                >
                                    Đặt giá ngay
                                </button>
                                <button className="px-5 py-3 border border-gray-200 rounded-md hover:bg-gray-50">Yêu thích</button>
                            </div>
                        </div>

                        <div className="mt-6 text-sm text-gray-700">
                            <h4 className="font-medium mb-2">Mô tả</h4>
                            <p className="leading-relaxed">{product.description}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold mb-4">Đánh giá người dùng</h4>
                        <ReviewForm onSubmit={handleReview} />
                    </div>
                </div>
            </div>

            <BidModal open={isBidOpen} onClose={() => setIsBidOpen(false)} product={product} />
        </div>
    );
};

export default AuctionPage;
