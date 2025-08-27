import { useEffect } from "react";

export default function useScrollToTop(dependency) {
    
  useEffect(() => {

    const timer = setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
    }, 50);  

    return () => clearTimeout(timer);
  }, [dependency]);
}
