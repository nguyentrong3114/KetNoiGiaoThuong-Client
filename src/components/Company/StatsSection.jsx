const StatsSection = () => {
  return (
    <section className="bg-white py-12 px-4 md:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-700 mb-8">
          Hơn <span className="font-bold text-2xl text-gray-900">32.000+</span> nhà bán hàng đang
          phát triển thương hiệu cùng FashionForAll.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
          <span>FashionHub</span>
          <span>FashionGuru</span>
          <span>Queen Closet</span>
          <span>FashionStyle</span>
          <span>Queen Closet</span>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
