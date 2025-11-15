import { ShoppingBag, Megaphone, Briefcase, Truck } from "lucide-react";

const WhatWeDo = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: "Mua sắm thời trang mới nhất",
      description: "Khám phá hàng trăm mẫu thiết kế bắt kịp xu hướng.",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      icon: Megaphone,
      title: "Yêu cầu may đo theo mẫu",
      description: "Hỗ trợ đặt may hoặc điều chỉnh kích thước theo yêu cầu.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: Briefcase,
      title: "Đăng bán sản phẩm của bạn",
      description: "Tự do đăng tin bán hàng và tiếp cận khách hàng nhanh hơn.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: Truck,
      title: "Giao hàng tận nơi",
      description: "Sản phẩm sẽ được giao đến tận tay bạn một cách nhanh chóng.",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Chúng tôi làm gì?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={`${feature.bgColor} rounded-lg p-6 flex gap-4`}>
                <div className={`flex-shrink-0 ${feature.iconColor}`}>
                  <Icon size={32} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
