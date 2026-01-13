"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Define the type to match your API structure
type Book = {
  "Book-Title": string;
  "Book-Author": string;
  "Image-URL-M": string;
  "num-ratings": number;
  "avg_rating": number;
};

// A sleek skeleton loader for better UX
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse border border-gray-100">
    <div className="w-full aspect-[2/3] bg-gray-200 rounded-xl mb-4" />
    <div className="h-5 bg-gray-200 rounded w-5/6 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-100 rounded w-1/4" />
      <div className="h-6 bg-gray-100 rounded-full w-1/4" />
    </div>
  </div>
);

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/popular`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching popular books:", err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (book: Book) => {
    // Navigate to /recomendations page with query params
    const query = new URLSearchParams({
      title: book["Book-Title"],
      author: book["Book-Author"],
      image: book["Image-URL-M"],
      ratings: book["num-ratings"].toString(),
      avg_rating: book.avg_rating.toString(),
    }).toString();

    router.push(`/recomendations?${query}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-3 md:p-12 selection:bg-indigo-100">
      {/* Header Section - Adjusted margins for mobile */}
      <header className="max-w-7xl mx-auto mb-8 md:mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-[10px] md:text-xs">Discovery</span>
          <h1 className="text-3xl md:text-6xl font-black text-slate-900 mt-2 mb-3 tracking-tight">
            Read <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Wise</span>
          </h1>
          <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-[10px] md:text-xs">
            Kashif Karim
          </h2>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* CHANGED: grid-cols-2 for mobile, reduced gap-3 for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              books.map((book, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleCardClick(book)}
                  className="group bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  {/* Image Container - Height reduced on mobile */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-slate-100">
                    <img
                      src={book["Image-URL-M"]}
                      alt={book["Book-Title"]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Text Content - Padding reduced (p-3) for mobile */}
                  <div className="p-3 md:p-5">
                    <h2 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1">
                      {book["Book-Title"]}
                    </h2>
                    <p className="text-[10px] md:text-sm text-slate-500 mt-0.5 mb-2 md:mb-4 line-clamp-1 italic">
                      {book["Book-Author"]}
                    </p>

                    <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 text-[10px] md:text-xs">★</span>
                        <span className="font-bold text-slate-700 text-xs md:text-sm">
                          {book.avg_rating?.toFixed(1) ?? "0.0"}
                        </span>
                      </div>

                      {/* Hide "Reviews" text on tiny screens to save space */}
                      <span className="text-[9px] md:text-[11px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {(book["num-ratings"] ?? 0).toLocaleString()} <span className="hidden xs:inline">Ratings</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}