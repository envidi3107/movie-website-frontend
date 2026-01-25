import { Link } from 'react-router-dom';

export default function WideCard({ id, title, match, image }) {
    return (
        <Link
            to={`/film/${id}`}
            className="group relative flex-none w-[320px] lg:w-[460px] aspect-video rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] duration-300 ring-1 ring-white/10"
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${image}")` }}
            ></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="bg-primary/80 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded w-fit mb-2">
                    {match} MATCH
                </span>
                <h3 className="text-white font-bold text-xl uppercase tracking-tighter">
                    {title}
                </h3>
            </div>
        </Link>
    );
}
