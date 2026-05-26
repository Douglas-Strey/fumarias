"use client";

import { FormEvent, PointerEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Cigarette, Clock3, Flame, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";

type Step = "intro" | "schedule" | "confirmation";

const evasiveLabels = [
  "Não",
  "Tem certeza?",
  "A fumaça viu",
  "Covardia detectada",
  "Essa opção não existe",
  "Tente de novo",
];

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const timeSlots = [
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
  "00:00",
  "00:30",
  "01:00",
  "01:30",
];

function formatDate(date: string) {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
}

function calendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay.getDay() }, () => null);
  const days = Array.from({ length: totalDays }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1));

  return [...blanks, ...days];
}

export default function Home() {
  const [step, setStep] = useState<Step>("intro");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [error, setError] = useState("");
  const [openPicker, setOpenPicker] = useState<"date" | "time" | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());

  const readableDate = formatDate(date);
  const noLabel = evasiveLabels[noAttempts % evasiveLabels.length];
  const whatsappText = `Confirmado. Eu estarei livre para fumar um kretek no dia ${readableDate} às ${time}.`;
  const whatsappUrl = `https://wa.me/5547997838550?text=${encodeURIComponent(whatsappText)}`;

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const visibleDays = useMemo(() => calendarDays(visibleMonth), [visibleMonth]);

  function fleeFromFate() {
    const rangeX = typeof window === "undefined" ? 260 : Math.min(window.innerWidth * 0.32, 330);
    const rangeY = typeof window === "undefined" ? 160 : Math.min(window.innerHeight * 0.22, 220);
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;

    setNoAttempts((attempts) => attempts + 1);
    setNoPosition({
      x: directionX * (80 + Math.random() * rangeX),
      y: directionY * (45 + Math.random() * rangeY),
    });
  }

  function handleNoPointer(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    fleeFromFate();
  }

  function handleSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!date || !time) {
      setError("O pacto exige dia e horário. A fumaça é burocrática.");
      return;
    }

    setError("");
    setStep("confirmation");
  }

  function changeMonth(offset: number) {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  function selectDate(day: Date) {
    const value = toDateInputValue(day);

    if (value < minDate) return;

    setDate(value);
    setError("");
    setOpenPicker(null);
  }

  function selectTime(value: string) {
    setTime(value);
    setError("");
    setOpenPicker(null);
  }

  return (
    <main className="kretek-stage flex min-h-screen items-center justify-center px-5 py-8 text-orange-50 sm:px-8">
      <div className="smoke" />
      <div className="smoke two" />
      <div className="smoke three" />
      <div className="noise" />

      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-4, 3, -4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-7 top-5 z-[2] h-72 w-48 opacity-85 drop-shadow-[0_1.5rem_2.5rem_rgba(0,0,0,0.65)] sm:right-4 sm:h-80 sm:w-56 lg:hidden"
      >
        <Image src="/assets/kretek.svg" alt="Kretek" fill priority sizes="14rem" className="object-contain" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="ritual-card relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] p-6 sm:p-9 lg:p-12"
      >
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-14 h-64 w-64 rounded-full bg-red-900/40 blur-3xl" />

        <div className="relative grid items-center gap-9 lg:grid-cols-[1.08fr_0.92fr]">
          <section>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200/20 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-100/80">
              <Flame className="h-4 w-4 text-orange-300" />
              convocação oficial do kretek
            </div>

            {step === "intro" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-7">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.38em] text-orange-200/80">
                    o destino acendeu a brasa
                  </p>
                  <h1 className="display-font max-w-3xl text-6xl font-bold leading-[0.9] text-orange-50 sm:text-7xl lg:text-8xl">
                    Fumaria um kretek?
                  </h1>
                  <p className="max-w-xl text-lg leading-8 text-orange-100/78 sm:text-xl">
                    A noite fez uma pergunta. Só existe uma resposta correta. A outra tenta fugir, mas nem ela acredita em si mesma.
                  </p>
                </div>

                <div className="relative flex min-h-36 flex-col gap-4 pt-2 sm:min-h-28 sm:flex-row sm:items-center">
                  <motion.button
                    whileHover={{ scale: 1.04, rotate: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("schedule")}
                    className="ember-button rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 px-7 py-4 text-base font-black uppercase tracking-[0.14em] text-stone-950 transition hover:brightness-110 sm:text-lg"
                  >
                    Sim, eu aceito meu destino
                  </motion.button>

                  <motion.button
                    animate={{ x: noPosition.x, y: noPosition.y, rotate: noAttempts % 2 ? -7 : 7 }}
                    transition={{ type: "spring", stiffness: 340, damping: 16 }}
                    onPointerEnter={handleNoPointer}
                    onPointerDown={handleNoPointer}
                    className="w-fit rounded-full border border-orange-100/25 bg-white/8 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-orange-100 shadow-2xl backdrop-blur transition hover:bg-white/12"
                  >
                    {noLabel}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "schedule" && (
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-7">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.38em] text-orange-200/80">
                    excelente escolha
                  </p>
                  <h1 className="display-font text-5xl font-bold leading-none text-orange-50 sm:text-7xl">
                    A fumaça reconhece os seus.
                  </h1>
                  <p className="max-w-xl text-lg leading-8 text-orange-100/78">
                    Escolha o dia e o horário em que você estará livre para cumprir seu destino.
                  </p>
                </div>

                <form onSubmit={handleSchedule} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative space-y-2">
                      <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-200/80">
                        <CalendarDays className="h-4 w-4" /> Dia
                      </span>
                      <button
                        type="button"
                        onClick={() => setOpenPicker(openPicker === "date" ? null : "date")}
                        className="flex w-full items-center justify-between rounded-2xl border border-orange-200/20 bg-black/35 px-4 py-4 text-left text-orange-50 outline-none ring-orange-300/30 transition hover:border-orange-200/40 hover:bg-black/45 focus:border-orange-200/50 focus:ring-4"
                      >
                        <span className={date ? "font-semibold" : "text-orange-100/45"}>{date ? readableDate : "Escolha o dia"}</span>
                        <CalendarDays className="h-5 w-5 text-amber-200" />
                      </button>

                      {openPicker === "date" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="relative z-30 mt-3 rounded-3xl border border-orange-200/20 bg-[#150807]/95 p-4 shadow-2xl backdrop-blur-xl sm:absolute sm:bottom-[4.85rem] sm:left-0 sm:right-0 sm:mt-0"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <button type="button" onClick={() => changeMonth(-1)} className="rounded-full border border-orange-100/15 p-2 text-orange-100 transition hover:bg-white/10">
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <p className="font-bold capitalize tracking-[0.08em] text-orange-50">{monthLabel(visibleMonth)}</p>
                            <button type="button" onClick={() => changeMonth(1)} className="rounded-full border border-orange-100/15 p-2 text-orange-100 transition hover:bg-white/10">
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center text-xs font-black uppercase tracking-[0.1em] text-orange-200/55">
                            {weekDays.map((day, index) => (
                              <span key={`${day}-${index}`} className="py-2">
                                {day}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {visibleDays.map((day, index) => {
                              if (!day) return <span key={`blank-${index}`} />;

                              const value = toDateInputValue(day);
                              const isSelected = value === date;
                              const isDisabled = value < minDate;

                              return (
                                <button
                                  key={value}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => selectDate(day)}
                                  className={`aspect-square rounded-2xl text-sm font-bold transition ${
                                    isSelected
                                      ? "bg-gradient-to-br from-amber-300 to-orange-500 text-stone-950 shadow-lg shadow-orange-950/40"
                                      : "text-orange-50 hover:bg-white/10"
                                  } ${isDisabled ? "cursor-not-allowed opacity-25 hover:bg-transparent" : ""}`}
                                >
                                  {day.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="relative space-y-2">
                      <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-200/80">
                        <Sparkles className="h-4 w-4" /> Horário
                      </span>
                      <button
                        type="button"
                        onClick={() => setOpenPicker(openPicker === "time" ? null : "time")}
                        className="flex w-full items-center justify-between rounded-2xl border border-orange-200/20 bg-black/35 px-4 py-4 text-left text-orange-50 outline-none ring-orange-300/30 transition hover:border-orange-200/40 hover:bg-black/45 focus:border-orange-200/50 focus:ring-4"
                      >
                        <span className={time ? "font-semibold" : "text-orange-100/45"}>{time || "Escolha o horário"}</span>
                        <Clock3 className="h-5 w-5 text-amber-200" />
                      </button>

                      {openPicker === "time" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="relative z-30 mt-3 rounded-3xl border border-orange-200/20 bg-[#150807]/95 p-4 shadow-2xl backdrop-blur-xl sm:absolute sm:bottom-[4.85rem] sm:left-auto sm:right-0 sm:mt-0 sm:w-[30rem]"
                        >
                          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-orange-200/60">horários ritualísticos</p>
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => selectTime(slot)}
                                className={`rounded-2xl border px-2 py-3 text-sm font-black tracking-[0.04em] transition ${
                                  slot === time
                                    ? "border-amber-200/60 bg-gradient-to-br from-amber-300 to-orange-500 text-stone-950 shadow-lg shadow-orange-950/40"
                                    : "border-orange-100/10 bg-white/5 text-orange-50 hover:border-orange-100/25 hover:bg-white/10"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {error && <p className="rounded-2xl border border-red-300/20 bg-red-950/45 px-4 py-3 text-sm text-red-100">{error}</p>}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="ember-button rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 px-7 py-4 font-black uppercase tracking-[0.14em] text-stone-950 transition hover:brightness-110"
                    >
                      Selar o pacto
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setStep("intro")}
                      className="rounded-full border border-orange-100/20 px-7 py-4 font-bold uppercase tracking-[0.14em] text-orange-100/80 transition hover:bg-white/10"
                    >
                      Repensar covardemente
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === "confirmation" && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.38em] text-orange-200/80">
                    pacto selado
                  </p>
                  <h1 className="display-font text-6xl font-bold leading-none text-orange-50 sm:text-8xl">
                    Está decidido.
                  </h1>
                  <p className="max-w-2xl text-xl leading-9 text-orange-100/82">
                    No dia <strong className="text-amber-200">{readableDate}</strong>, às <strong className="text-amber-200">{time}</strong>, estaremos fumando. Não tente fugir.
                  </p>
                </div>

                <div className="rounded-3xl border border-orange-200/20 bg-black/30 p-5 text-orange-100/78">
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-200/70">mensagem que será enviada</p>
                  <p className="mt-3 text-lg leading-8">{whatsappText}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ember-button inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-400 via-green-300 to-lime-300 px-7 py-4 font-black uppercase tracking-[0.12em] text-stone-950 transition hover:brightness-110"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Enviar confirmação no WhatsApp
                  </motion.a>
                  <button
                    type="button"
                    onClick={() => setStep("schedule")}
                    className="rounded-full border border-orange-100/20 px-7 py-4 font-bold uppercase tracking-[0.14em] text-orange-100/80 transition hover:bg-white/10"
                  >
                    Ajustar horário
                  </button>
                </div>
              </motion.div>
            )}
          </section>

          <aside className="relative hidden min-h-[34rem] lg:block">
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [-3, 2, -3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-0 top-4 h-[31rem] w-[21rem] drop-shadow-[0_2rem_3rem_rgba(0,0,0,0.55)]"
            >
              <Image
                src="/assets/kretek.svg"
                alt="Kretek"
                fill
                priority
                sizes="21rem"
                className="object-contain opacity-95"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, 18, 0], rotate: [5, -2, 5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute bottom-8 left-3 rounded-[2rem] border border-amber-200/20 bg-stone-950/70 p-5 shadow-2xl backdrop-blur"
            >
              <Cigarette className="mb-5 h-16 w-16 text-amber-200" />
              <p className="display-font max-w-52 text-3xl font-bold leading-none text-orange-50">
                Não há escapatória. Apenas kretek.
              </p>
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </main>
  );
}
