"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Users, Star, Medal, Sparkles } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { client } from "@/lib/sanity.config";

type Team = {
    _id: string;
    projectName: string;
    members: string[];
    winner: boolean;
    rank: number | null;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 100 },
    },
};

export default function TeamsModal({ isOpen, onClose }: Props) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const triggerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            triggerRef.current = document.activeElement as HTMLElement;

            const fetchTeams = async () => {
                try {
                    const result = await client.fetch(`*[_type == "team"]`);
                    setTeams(result);
                } catch (error) {
                    console.error("Error fetching teams:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTeams();
        } else if (triggerRef.current) {
            triggerRef.current.focus();
        }
    }, [isOpen]);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();

            if (e.key === "Tab" && modalRef.current) {
                const focusable = Array.from(
                    modalRef.current.querySelectorAll<HTMLElement>(
                        "button, [contenteditable], [tabindex]:not([tabindex='-1'])"
                    )
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault(); last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault(); first?.focus();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const sortedTeams = useMemo(() => {
        const winners = teams
            .filter((t) => t.winner || (t.rank !== null && t.rank <= 3))
            .sort((a, b) => (a.rank || 99) - (b.rank || 99));
        const others = teams
            .filter((t) => !t.winner && (t.rank === null || t.rank > 3))
            .sort((a, b) => a.projectName.localeCompare(b.projectName));

        return { winners, others };
    }, [teams]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Teams"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-5xl h-[90vh] sm:h-[85vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0f111a] border border-white/20 dark:border-brand-border shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="relative h-28 sm:h-40 flex-shrink-0 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-indigo-600 to-violet-600 opacity-90" />

                            <motion.div
                                animate={{
                                    backgroundPosition: ["0% 0%", "100% 100%"],
                                }}
                                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: "radial-gradient(circle at center, white 2px, transparent 2px)",
                                    backgroundSize: "32px 32px",
                                }}
                            />

                            <button
                                onClick={onClose}
                                aria-label="Close modal"
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 rounded-full bg-black/20 dark:bg-white/10 p-1.5 sm:p-2 text-white hover:bg-black/40 dark:hover:bg-white/20 transition-all backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white"
                            >
                                <X size={18} className="sm:w-5 sm:h-5" />
                            </button>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pt-8 sm:p-4">
                                <motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mb-1 sm:mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 sm:px-3 sm:py-1 backdrop-blur-md border border-white/30"
                                >
                                    <Users size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white">Hackathon 2026</span>
                                </motion.div>

                                <motion.h2
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-2xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg px-4"
                                >
                                    Meet the Teams
                                </motion.h2>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                                </div>
                            ) : (
                                <div className="space-y-8 sm:space-y-12">
                                    {/* Winners Section */}
                                    {sortedTeams.winners.length > 0 && (
                                        <section>
                                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-brand-primary/10 text-brand-primary">
                                                    <Trophy size={20} className="sm:w-6 sm:h-6" />
                                                </div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Champions</h3>
                                            </div>

                                            <motion.div
                                                variants={containerVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                                            >
                                                {sortedTeams.winners.map((team) => (
                                                    <TeamCard key={team._id} team={team} isWinner />
                                                ))}
                                            </motion.div>
                                        </section>
                                    )}

                                    {/* Other Teams Section */}
                                    <section>
                                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                <Star size={20} className="sm:w-6 sm:h-6" />
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">The Contenders</h3>
                                        </div>

                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                                        >
                                            {sortedTeams.others.map((team) => (
                                                <TeamCard key={team._id} team={team} />
                                            ))}
                                        </motion.div>
                                    </section>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

}

function TeamCard({ team, isWinner }: { team: Team; isWinner?: boolean }) {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${isWinner
                ? "bg-white dark:bg-[#1a1d2d] border-amber-400/30 dark:border-amber-400/20 shadow-xl shadow-amber-400/5"
                : "bg-white dark:bg-[#1a1d2d] border-slate-100 dark:border-brand-border/50 hover:border-brand-primary/30 dark:hover:border-brand-primary/30 shadow-sm"
                }`}
        >
            {isWinner && (
                <div className="absolute top-0 right-0 p-3 sm:p-4">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Medal size={24} className="sm:w-8 sm:h-8 text-amber-500 opacity-20" />
                    </motion.div>
                </div>
            )}

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div>
                        <h4 className={`text-lg sm:text-xl font-black mb-1 group-hover:text-brand-primary transition-colors ${isWinner ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white"
                            }`}>
                            {team.projectName}
                        </h4>
                        {team.rank && (
                            <div className={`inline-flex items-center justify-center rounded-lg h-6 sm:h-7 px-2.5 sm:px-3 text-[10px] sm:text-sm font-black transition-all ${team.rank === 1 ? "bg-amber-400 text-amber-950 scale-105 sm:scale-110 shadow-lg shadow-amber-400/20" :
                                team.rank === 2 ? "bg-slate-300 text-slate-900 shadow-lg shadow-slate-300/20" :
                                    "bg-amber-600/80 text-white shadow-lg shadow-amber-600/20"
                                }`}>
                                {team.rank === 1 ? "1st Place" : team.rank === 2 ? "2nd Place" : team.rank === 3 ? "3rd Place" : `Rank ${team.rank}`}
                            </div>
                        )}
                    </div>
                    {isWinner && <Sparkles className="text-amber-400 group-hover:animate-spin-slow animate-pulse sm:w-5 sm:h-5" size={16} />}
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <Users size={10} className="sm:w-[12px] sm:h-[12px]" />
                        Members
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {team.members.length > 0 ? (
                            team.members.map((member, i) => (
                                <span
                                    key={i}
                                    className={`rounded-lg px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-medium border ${isWinner
                                        ? "bg-amber-400/10 dark:bg-amber-400/5 border-amber-400/20 text-amber-700 dark:text-amber-400"
                                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                        }`}
                                >
                                    {member}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs italic text-slate-400">Solo Vanguard</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className={`absolute -bottom-6 -right-6 h-24 w-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isWinner ? "bg-amber-400" : "bg-brand-primary"
                }`} />
        </motion.div>
    );
}
