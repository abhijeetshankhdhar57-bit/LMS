"use server";

import { db } from "@/lib/db";

// Mock function for sending SMS - In production, replace with Twilio, OTPless, etc.
const sendSMS = async (phone: string, code: string) => {
    console.log(`[SMS MOCK] Sending OTP ${code} to ${phone}`);
    // return await twilio.messages.create({ body: `Your LMS login code is ${code}`, from: '...', to: phone });
    return true;
};

export async function sendOtp(phone: string) {
    try {
        // Basic validation: ensure it's a 10-digit number (simple check)
        if (!/^\d{10}$/.test(phone)) {
            return { error: "Invalid phone number. Please enter 10 digits." };
        }

        // Generate a 6-digit numeric OTP
        // Hardcode for testing number
        const code = phone === "8630816298" ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Upsert the OTP (one active code per phone number)
        await db.otp.upsert({
            where: { phoneNumber: phone },
            update: { code, expiresAt },
            create: { phoneNumber: phone, code, expiresAt },
        });

        // Mock sending the SMS
        await sendSMS(phone, code);

        return { success: true, message: "OTP sent successfully (Check console for mock)" };
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { error: "Failed to send OTP. Please try again." };
    }
}

export async function verifyOtp(phone: string, code: string) {
    try {
        const otpRecord = await db.otp.findUnique({
            where: { phoneNumber: phone },
        });

        if (!otpRecord) {
            return { error: "No OTP found for this number." };
        }

        if (otpRecord.code !== code) {
            return { error: "Invalid OTP code." };
        }

        if (new Date() > otpRecord.expiresAt) {
            return { error: "OTP has expired. Please request a new one." };
        }

        // Success! Delete the OTP record after use
        await db.otp.delete({ where: { phoneNumber: phone } });

        // Check if user exists, otherwise create
        let user = await db.user.findUnique({
            where: { phone },
        });

        if (!user) {
            user = await db.user.create({
                data: {
                    phone,
                    name: `User ${phone.slice(-4)}`, // Default name
                    role: "LEARNER"
                },
            });
        }

        return { success: true, user };
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { error: "Verification failed. Please try again." };
    }
}
