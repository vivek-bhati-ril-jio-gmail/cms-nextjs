// app/components/plugins/imageSliderPlugin.js

export default function ImageSliderPlugin() {
  return (
    <div className="image-slider">
      <h3>Image Slider</h3>
      <div className="slider-container">
        <div className="slider">
          <div className="slide">
            <img src="/images/slider-image1.jpg" alt="Slide 1" />
          </div>
          <div className="slide">
            <img src="/images/slider-image2.jpg" alt="Slide 2" />
          </div>
          <div className="slide">
            <img src="/images/slider-image3.jpg" alt="Slide 3" />
          </div>
        </div>
      </div>
    </div>
  );
}
