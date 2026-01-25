import { Link } from 'react-router-dom';
import { routes } from '@/App';

export default function Logo() {
    return (
        <Link to={routes.default}>
            <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-4xl font-bold">
                    movie_filter
                </span>
                <h2 className="text-white text-2xl font-black tracking-tighter uppercase italic">
                    CineStream
                </h2>
            </div>
        </Link>
    );
}
