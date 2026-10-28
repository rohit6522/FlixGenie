function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[140px] sm:w-[165px] md:w-[190px] mr-3">
      <div className="shimmer aspect-[2/3] rounded-xl w-full border border-white/5 relative overflow-hidden shadow-lg shadow-black/40">
        <div className="absolute bottom-3 left-3 right-3 space-y-1.5 opacity-60">
          <div className="h-3 bg-white/10 rounded w-3/4"></div>
          <div className="h-2 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
