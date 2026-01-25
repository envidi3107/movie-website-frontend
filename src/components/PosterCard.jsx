import { Link } from 'react-router-dom';

export default function PosterCard({ id, image, badge }) {
    return (
        <Link
            to={`/film/${id}`}
            className="group relative flex-none w-[200px] lg:w-[260px] aspect-2/3 rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 hover:scale-105 duration-300"
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${image}")` }}
            ></div>
            {badge && (
                <div className="absolute top-2 right-2 bg-primary text-[10px] font-black px-2 py-0.5 rounded tracking-tighter z-10">
                    {badge}
                </div>
            )}
        </Link>
    );
}
