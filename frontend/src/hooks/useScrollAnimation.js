import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimation(selector, options = {}) {
  useEffect(() => {
    const nodes = gsap.utils.toArray(selector);
    const animations = nodes.map((node, index) =>
      gsap.fromTo(
        node,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: options.start || "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      )
    );

    return () => {
      animations.forEach((a) => a.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [selector, options.start]);
}
