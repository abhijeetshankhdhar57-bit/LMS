"use client";

import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { sendOtp } from "@/app/actions/auth";
import { Phone, ChevronLeft, Loader2 } from "lucide-react";

export function LoginCard() {
    const [step, setStep] = useState<"SELECT" | "PHONE" | "OTP">("SELECT");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = async () => {
        setLoading(true);
        setError("");
        const res = await sendOtp(phone);
        setLoading(false);
        if (res.success) {
            setStep("OTP");
        } else {
            setError(res.error || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setError("");
        const res = await signIn("phone", { // Custom provider ID from CredentialsProvider
            phone,
            code,
            callbackUrl: "/courses",
            redirect: true
        });
        setLoading(false);
        // NextAuth redirect happens automatically if ok, otherwise error
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative mx-auto"
        >
            <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 sm:p-14 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-md mx-auto min-h-[460px] justify-center">
                <AnimatePresence mode="wait">
                    {step === "SELECT" && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full flex flex-col items-center"
                        >
                            <h1 className="text-[28px] sm:text-[34px] leading-tight font-medium tracking-[-0.02em] text-white mb-3">
                                Welcome to<br />Juspay LMS
                            </h1>
                            <p className="text-[15px] sm:text-[17px] text-white/50 mb-10 font-normal">
                                Please login to continue
                            </p>

                            <div className="flex flex-col gap-4 w-full px-4">
                                <button
                                    onClick={() => signIn("google", { callbackUrl: "/courses" })}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-[#1A1A1A] transition-all hover:bg-white/90 active:scale-[0.98] shadow-sm font-medium text-[15px]"
                                >
                                    <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span>Sign in with Google</span>
                                </button>

                                <button
                                    onClick={() => signIn("azure-ad", { callbackUrl: "/courses" })}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2F2F2F] border border-white/10 px-8 py-4 text-white transition-all hover:bg-[#3F3F3F] active:scale-[0.98] shadow-sm font-medium text-[15px]"
                                >
                                    <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 23 23">
                                        <path fill="#f3f3f3" d="M0 0h11v11H0z" />
                                        <path fill="#f3f3f3" d="M12 0h11v11H12z" />
                                        <path fill="#f3f3f3" d="M0 12h11v11H0z" />
                                        <path fill="#f3f3f3" d="M12 12h11v11H12z" />
                                    </svg>
                                    <span>Sign in with Microsoft</span>
                                </button>

                                <div className="flex items-center gap-4 my-2 w-full">
                                    <div className="h-[1px] bg-white/10 flex-1" />
                                    <span className="text-white/20 text-[10px] font-black tracking-[0.2em]">OR</span>
                                    <div className="h-[1px] bg-white/10 flex-1" />
                                </div>

                                <button
                                    onClick={() => setStep("PHONE")}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/[0.05] border border-white/10 px-8 py-4 text-white/90 transition-all hover:bg-white/[0.08] active:scale-[0.98] shadow-sm font-medium text-[15px]"
                                >
                                    <Phone className="w-[18px] h-[18px] opacity-70" />
                                    <span>Sign in with Mobile</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === "PHONE" && (
                        <motion.div
                            key="phone"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full flex flex-col items-center"
                        >
                            <button
                                onClick={() => setStep("SELECT")}
                                className="absolute top-10 left-10 p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">Mobile Login</h2>
                            <p className="text-white/50 text-sm mb-8">Enter your 10-digit mobile number</p>

                            <div className="w-full space-y-4 px-4">
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 font-bold">+91</span>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-4 text-white focus:outline-none focus:border-primary/50 transition-all text-lg font-medium tracking-wider"
                                        autoFocus
                                    />
                                </div>
                                {error && <p className="text-red-400 text-xs font-semibold uppercase tracking-wider">{error}</p>}
                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading || phone.length < 10}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-white transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-bold shadow-lg shadow-primary/20 mt-4"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "SEND OTP"}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === "OTP" && (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full flex flex-col items-center"
                        >
                            <button
                                onClick={() => setStep("PHONE")}
                                className="absolute top-10 left-10 p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                            <p className="text-white/50 text-sm mb-8">Sent to +91 {phone}</p>

                            <div className="w-full space-y-4 px-4">
                                <input
                                    type="text"
                                    placeholder="000000"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-all text-center text-3xl font-black tracking-[0.5em] placeholder:text-white/10"
                                    autoFocus
                                />
                                {error && <p className="text-red-400 text-xs font-semibold uppercase tracking-wider">{error}</p>}
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading || code.length < 6}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-500 px-8 py-4 text-white transition-all hover:bg-green-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-bold shadow-lg shadow-green-500/20 mt-4"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "VERIFY & LOGIN"}
                                </button>
                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="text-white/30 hover:text-white/60 text-[10px] font-black tracking-[0.2em] transition-all uppercase mt-6"
                                >
                                    Resend Code
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
