export function BrandCarousel() {
  const brands = [
    { name: "Ford", src: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg" },
    { name: "Toyota", src: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg" },
    { name: "Honda", src: "https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg" },
    { name: "BMW", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
    { name: "Volkswagen", src: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Volkswagen_Logo_till_1995.svg" },
    { name: "Hyundai", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg" }
  ]

  return (
    <div className="w-full bg-white border-b py-10 overflow-hidden flex items-center">
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div className="flex items-center justify-start animate-infinite-scroll opacity-70">
          {[...brands, ...brands].map((brand, idx) => (
            <div key={idx} className="mx-8 md:mx-14 w-[120px] h-[60px] flex-shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 cursor-pointer">
              <img src={brand.src} alt={brand.name} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
