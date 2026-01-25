import { Link } from 'react-router-dom';

export default function TrendingCard({
    id,
    title,
    year,
    genre,
    rating,
    image,
}) {
    return (
        <Link
            to={`/film/${id}`}
            className="group relative flex-none w-[200px] lg:w-[260px] aspect-2/3 rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 hover:scale-105 duration-300"
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${image}")` }}
            ></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity card-hover-bg flex flex-col justify-end p-4">
                <p className="text-white font-black text-lg">{title}</p>
                <div className="flex items-center gap-2 text-[10px] text-white/70 font-bold uppercase mt-1">
                    <span>{year}</span>
                    <span>•</span>
                    <span>{genre}</span>
                    <span>•</span>
                    <span className="text-yellow-500">{rating}</span>
                </div>
            </div>
        </Link>
    );
}
