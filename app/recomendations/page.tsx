"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, BookOpen, Sparkles, Loader2, ChevronRight } from "lucide-react";

type RecBook = {
    title: string;
    author: string;
    image: string;
};

// --- SUB-RECOMMENDATIONS COMPONENT (Fixed for Mobile Visibility) ---
const SubRecommendations = ({ parentTitle }: { parentTitle: string }) => {
    const [subs, setSubs] = useState<RecBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/recommend?book_name=${encodeURIComponent(parentTitle)}`)
            .then((res) => res.json())
            .then((data) => {
                setSubs(data.slice(0, 4));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [parentTitle]);

    if (loading) return (
        <div className="flex items-center gap-3 p-6 text-indigo-500 font-medium text-xs">
            <Loader2 className="animate-spin" size={16} />
            <span className="animate-pulse">Analyzing connections...</span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            // grid-cols-2 ensures visibility on mobile, sm:grid-cols-4 for desktop
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-100/80 rounded-2xl border border-slate-200/50 mt-2 ml-2 md:ml-12 mb-4"
        >
            {subs.map((book, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col group/sub"
                >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-sm bg-gray-200">
                        <img
                            src={book.image}
                            className="w-full h-full object-cover group-hover/sub:scale-110 transition-transform duration-500"
                            alt=""
                        />
                    </div>
                    <p className="text-[9px] font-bold mt-2 text-slate-700 line-clamp-1 px-1">
                        {book.title}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
};

// --- MAIN PAGE CONTENT ---
function RecommendationsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const title = searchParams.get("title") || "Unknown Title";
    const author = searchParams.get("author") || "Unknown Author";
    const image = searchParams.get("image") || "";
    const ratings = searchParams.get("ratings") || "0";
    const avg_rating = searchParams.get("avg_rating") || "0";

    const [recommendedBooks, setRecommendedBooks] = useState<RecBook[]>([]);
    const [loadingRecs, setLoadingRecs] = useState(true);
    const [expandedBook, setExpandedBook] = useState<string | null>(null);

    useEffect(() => {
        if (!title) return;
        setLoadingRecs(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/recommend?book_name=${encodeURIComponent(title)}`)
            .then((res) => res.json())
            .then((data) => {
                setRecommendedBooks(data);
                setLoadingRecs(false);
            })
            .catch(() => setLoadingRecs(false));
    }, [title]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-[#f8f9fb] lg:overflow-hidden font-sans">

            {/* SIDEBAR: Swaps to a header on mobile */}
            <motion.aside
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full lg:w-[380px] bg-white border-b lg:border-r border-slate-200 p-6 lg:p-10 flex flex-col lg:overflow-y-auto shrink-0"
            >
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-6 text-xs font-black tracking-widest transition-all uppercase"
                >
                    <ArrowLeft size={16} /> Library
                </button>

                <div className="flex flex-row lg:flex-col items-center lg:items-start gap-6 lg:gap-0">
                    <div className="relative shrink-0 w-24 lg:w-full mb-0 lg:mb-8">
                        <img
                            src={image}
                            className="w-full aspect-[2/3] object-cover rounded-xl shadow-xl lg:shadow-indigo-500/10"
                            alt={title}
                        />
                    </div>

                    <div className="flex-1 text-left space-y-2 lg:space-y-3">
                        <h1 className="text-lg lg:text-3xl font-black text-slate-900 leading-tight line-clamp-2 lg:line-clamp-none">
                            {title}
                        </h1>
                        <p className="text-sm lg:text-lg text-slate-400 font-medium italic">by {author}</p>

                        <div className="flex gap-4 pt-3 lg:pt-6 lg:mt-6 border-t border-slate-100">
                            <div>
                                <p className="text-[9px] text-slate-400 font-black uppercase">Score</p>
                                <p className="text-sm lg:text-xl font-black text-slate-800 flex items-center gap-1">
                                    {parseFloat(avg_rating).toFixed(1)} <Star size={14} className="fill-amber-400 text-amber-400" />
                                </p>
                            </div>
                            <div className="w-px h-8 lg:h-10 bg-slate-100" />
                            <div>
                                <p className="text-[9px] text-slate-400 font-black uppercase">Reviews</p>
                                <p className="text-sm lg:text-xl font-black text-slate-800">{ratings}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* MAIN LIST: Scrollable area */}
            <main className="flex-1 lg:overflow-y-auto p-4 lg:p-12 pb-20">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full mb-3">
                            <Sparkles size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">AI Recommendations</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Explore Branches</h2>
                        <p className="text-slate-400 text-sm mt-1">Tap a book to reveal its personal influence map.</p>
                    </header>

                    <div className="space-y-3">
                        {loadingRecs ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 w-full bg-white rounded-2xl animate-pulse shadow-sm" />)}
                            </div>
                        ) : (
                            recommendedBooks.map((book, idx) => (
                                <div key={idx} className="flex flex-col">
                                    {/* Primary Card */}
                                    <motion.div
                                        layout
                                        onClick={() => setExpandedBook(expandedBook === book.title ? null : book.title)}
                                        className={`flex items-center gap-4 p-3 md:p-4 rounded-3xl cursor-pointer transition-all border ${expandedBook === book.title
                                            ? "bg-white border-indigo-200 shadow-lg ring-1 ring-indigo-50"
                                            : "bg-white/50 border-transparent hover:bg-white hover:shadow-md"
                                            }`}
                                    >
                                        <img src={book.image} className="w-12 h-16 md:w-16 md:h-20 object-cover rounded-lg shadow-sm" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-sm md:text-base truncate group-hover:text-indigo-600">
                                                {book.title}
                                            </h3>
                                            <p className="text-slate-400 text-xs font-medium italic truncate">by {book.author}</p>
                                        </div>
                                        <div className={`transition-all duration-300 p-2 rounded-full ${expandedBook === book.title ? "bg-indigo-600 text-white rotate-90" : "text-slate-300"}`}>
                                            <ChevronRight size={18} />
                                        </div>
                                    </motion.div>

                                    {/* Sub-Card View */}
                                    <AnimatePresence>
                                        {expandedBook === book.title && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <SubRecommendations parentTitle={book.title} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function RecommendationsPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Initializing...</div>}>
            <RecommendationsContent />
        </Suspense>
    );
}