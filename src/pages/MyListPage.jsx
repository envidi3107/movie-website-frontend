import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MyListContent from '@/components/MyListContent';

export default function MyListPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display w-screen">
            <Navbar />
            <div className="pt-24 px-6 lg:px-12 pb-12 min-h-screen">
                <MyListContent />
            </div>
            <Footer />
        </div>
    );
}
