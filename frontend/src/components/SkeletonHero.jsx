function SkeletonHero() {
  return (
    <div className="relative w-full h-[70vh] mb-8 shimmer">
      <div className="absolute bottom-16 left-8 max-w-xl">
        <div className="shimmer h-10 w-72 rounded mb-4"></div>
        <div className="shimmer h-4 w-96 rounded mb-2"></div>
        <div className="shimmer h-4 w-80 rounded mb-2"></div>
        <div className="shimmer h-4 w-64 rounded"></div>
      </div>
    </div>
  );
}

export default SkeletonHero;