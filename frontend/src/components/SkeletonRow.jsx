import SkeletonCard from "./SkeletonCard";

function SkeletonRow({ title }) {
  return (
    <div className="px-6 md:px-12 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-5 bg-red-600 rounded-full"></div>
        <div className="shimmer h-6 w-44 rounded-md"></div>
      </div>
      <div className="flex overflow-x-hidden gap-1 py-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default SkeletonRow;
