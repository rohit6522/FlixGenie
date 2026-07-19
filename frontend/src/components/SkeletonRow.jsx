import SkeletonCard from "./SkeletonCard";

function SkeletonRow({ title }) {
  return (
    <div className="px-8 mb-8">
      <div className="shimmer h-6 w-40 rounded mb-3"></div>
      <div className="flex overflow-x-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default SkeletonRow;