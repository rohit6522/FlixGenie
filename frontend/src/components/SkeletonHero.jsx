function SkeletonHero() {
  return (
    <div className="relative w-full h-[85vh] min-h-[560px] overflow-hidden bg-[#0c0c12]">
      <div className="shimmer absolute inset-0 opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08080c] via-[#08080c]/60 to-transparent" />
      
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="flex gap-2 mb-3">
            <div className="shimmer h-6 w-24 rounded-full"></div>
            <div className="shimmer h-6 w-16 rounded-full"></div>
          </div>
          <div className="shimmer h-12 md:h-16 w-3/4 rounded-xl"></div>
          <div className="shimmer h-4 w-full rounded-md"></div>
          <div className="shimmer h-4 w-5/6 rounded-md"></div>
          <div className="flex gap-3 pt-4">
            <div className="shimmer h-12 w-36 rounded-xl"></div>
            <div className="shimmer h-12 w-32 rounded-xl"></div>
          </div>
        </div>
        <div className="hidden md:block w-72 h-[420px] shimmer rounded-2xl border border-white/10 opacity-70"></div>
      </div>
    </div>
  );
}

export default SkeletonHero;
