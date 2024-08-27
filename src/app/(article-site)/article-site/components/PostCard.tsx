export default function PostCard({
  photo,
  title,
  category,
  id
}: {
  photo: string | undefined;
  title: string | undefined;
  category: string | undefined;
  id: number
}) {
  return (
    <a
      className="bg-white rounded-lg shadow-md overflow-hidden"
      href={`/article-site/${id}`}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          <h1>{category}</h1>
        </div>
        <img src={photo} alt={title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold truncate">{title}</h2>
      </div>
    </a>
  );
}
