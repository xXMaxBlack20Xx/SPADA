import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Loader, Clock } from 'lucide-react';
// FIX: Updated import path to match your new directory: 'src/api/calendar/calendarService.ts'
import {
    fetchSchedule,
    fetchSavedGames,
    toggleGameSave,
    type CalendarGame,
} from '../../../api/serviceCalendar/calendarService';

export default function CalendarPage() {
    // We treat this as the "current month" reference (always day 1)
    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const [monthGames, setMonthGames] = useState<Record<string, CalendarGame[]>>({});
    const [savedGames, setSavedGames] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    // Format date as YYYYMMDD (for API)
    const formatDateForApi = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    // For labeling month header like "January 2025"
    const formatMonthLabel = (date: Date) => {
        return date.toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    // Get all Date objects for days in current month
    const getDaysInMonth = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days: Date[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    };

    // Change month (offset in months)
    const changeMonth = (offset: number) => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    // Load schedule for all days in the month
    useEffect(() => {
        const loadMonthData = async () => {
            setLoading(true);
            try {
                const days = getDaysInMonth(currentMonth);

                // Fetch all days' schedules in parallel + saved games
                const [allDailySchedules, savedData] = await Promise.all([
                    Promise.all(days.map((d) => fetchSchedule(formatDateForApi(d)))),
                    fetchSavedGames(),
                ]);

                const grouped: Record<string, CalendarGame[]> = {};

                allDailySchedules.forEach((dayGames, index) => {
                    const key = formatDateForApi(days[index]);
                    grouped[key] = dayGames;
                });

                setMonthGames(grouped);
                setSavedGames(new Set(savedData));
            } catch (error) {
                console.error('Error loading month calendar', error);
            } finally {
                setLoading(false);
            }
        };

        loadMonthData();
    }, [currentMonth]);

    // Star toggle (same logic as before, just works inside each day cell)
    const handleStarClick = async (e: React.MouseEvent, game: CalendarGame) => {
        e.stopPropagation();
        if (toggling) return;

        setToggling(game.gameId);

        const updated = new Set(savedGames);
        const alreadySaved = updated.has(game.gameId);

        if (alreadySaved) {
            updated.delete(game.gameId);
        } else {
            updated.add(game.gameId);
        }
        setSavedGames(updated);

        try {
            await toggleGameSave(game.gameId, game.date, game.shortName);
        } catch (error) {
            // revert on failure
            if (alreadySaved) {
                updated.add(game.gameId);
            } else {
                updated.delete(game.gameId);
            }
            setSavedGames(new Set(updated));
        } finally {
            setToggling(null);
        }
    };

    // Calendar grid generation
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekday = firstDayOfMonth.getDay(); // 0 = Sunday

    const daysInMonth = getDaysInMonth(currentMonth);

    // Build cells array with leading nulls for days before the 1st
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) {
        cells.push(null);
    }
    daysInMonth.forEach((d) => cells.push(d));

    const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-8 p-2 md:p-4">
            {/* Header & Month Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        NBA Schedule
                    </h1>
                    <p className="text-gray-400 text-base mt-1">
                        Full month view — click the star to save games
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-lg">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-3 rounded-xl hover:bg-white/10 text-white transition"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <div className="flex flex-col items-center min-w-[180px]">
                        <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                            Selected Month
                        </span>
                        <span className="text-lg font-bold text-white whitespace-nowrap">
                            {formatMonthLabel(currentMonth)}
                        </span>
                    </div>

                    <button
                        onClick={() => changeMonth(1)}
                        className="p-3 rounded-xl hover:bg-white/10 text-white transition"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
            </div>

            {/* Calendar Wrapper */}
            <div className="rounded-3xl border border-white/10 bg-[#05040c]/90 shadow-[0_0_40px_rgba(255,255,255,0.12)] p-4 md:p-6">
                {/* Weekday Header */}
                <div className="grid grid-cols-7 gap-2 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {weekDayLabels.map((day) => (
                        <div key={day} className="text-center">
                            {day}
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Loader className="animate-spin mb-4" size={40} />
                        <p>Loading monthly schedule...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-2 text-xs md:text-sm">
                        {cells.map((date, index) => {
                            if (!date) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="h-28 md:h-32 rounded-2xl border border-transparent"
                                    />
                                );
                            }

                            const dateKey = formatDateForApi(date);
                            const gamesForDay = monthGames[dateKey] || [];
                            const today = isToday(date);

                            return (
                                <div
                                    key={dateKey}
                                    className={`flex flex-col rounded-2xl border bg-white/5/0 backdrop-blur-sm p-2 md:p-3 
                                    transition hover:border-white/30 hover:bg-white/5 ${
                                        today
                                            ? 'border-indigo-500/70 bg-indigo-500/10'
                                            : 'border-white/10'
                                    }`}
                                >
                                    {/* Day Header */}
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-white">
                                            {date.getDate()}
                                        </span>
                                        {today && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-100 uppercase tracking-wide">
                                                Today
                                            </span>
                                        )}
                                    </div>

                                    {/* Games for this day */}
                                    <div className="space-y-1 mt-1 max-h-24 overflow-y-auto custom-scrollbar">
                                        {gamesForDay.length === 0 ? (
                                            <p className="text-[10px] text-gray-600 italic">
                                                No games
                                            </p>
                                        ) : (
                                            gamesForDay.map((game) => {
                                                const isSaved = savedGames.has(game.gameId);
                                                const isLive = game.status === 'in';

                                                return (
                                                    <div
                                                        key={game.gameId}
                                                        className="group flex items-center justify-between gap-1 rounded-lg bg-[#0B0A17]/70 px-1.5 py-1 border border-white/5 hover:border-white/20"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate text-[10px] text-gray-200">
                                                                {game.shortName ||
                                                                    `${game.awayTeam} @ ${game.homeTeam}`}
                                                            </p>
                                                            <div className="flex items-center gap-1 text-[9px] text-gray-400">
                                                                {isLive ? (
                                                                    <>
                                                                        <span className="relative flex h-1.5 w-1.5">
                                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                                                                        </span>
                                                                        LIVE
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Clock size={9} />
                                                                        {new Date(
                                                                            game.date,
                                                                        ).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={(e) =>
                                                                handleStarClick(e, game)
                                                            }
                                                            className="ml-1 p-0.5 rounded-full hover:bg-white/10"
                                                        >
                                                            {toggling === game.gameId ? (
                                                                <Loader
                                                                    size={14}
                                                                    className="animate-spin text-indigo-400"
                                                                />
                                                            ) : (
                                                                <Star
                                                                    size={14}
                                                                    className={
                                                                        isSaved
                                                                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]'
                                                                            : 'text-gray-500 group-hover:text-yellow-300'
                                                                    }
                                                                />
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
