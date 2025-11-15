import { ShoppingBag, Megaphone, Briefcase, Truck } from "lucide-react"

const WhatWeDo = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: "Shop for latest wears",
      description: "Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      icon: Megaphone,
      title: "Request for measurment for a style",
      description: "Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: Briefcase,
      title: "Sell yours wears",
      description: "Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: Truck,
      title: "Get your wears delivered to you",
      description: "Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What we do</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
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
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
