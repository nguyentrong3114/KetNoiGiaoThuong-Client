import React, { useEffect, useRef, useState } from "react";

const FadeIn = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;

    // Trường hợp phần tử đang nằm trong viewport khi vừa load trang
    const onLoadCheck = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        setVisible(true);
      }
    };

    // Intersection Observer: kích hoạt khi element vào màn hình
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    onLoadCheck();

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(20px)",
        transition: `all 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
