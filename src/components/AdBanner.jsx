import { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    try {
      // This tells Google to fill the ad slot
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="ad-container">
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-################"
           data-ad-slot="############"
           data-ad-format="auto"
           data-full-width-responsive="true">
      </ins>
    </div>
  );
};

export default AdBanner;