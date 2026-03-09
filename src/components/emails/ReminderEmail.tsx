import React from "react";
import { Html, Head, Preview, Body, Container, Text, Link, Section } from "@react-email/components";

export default function ReminderEmail({ userName, missingModules }: { userName: string, missingModules: string[] }) {
    return (
        <Html>
            <Head />
            <Preview>Action Required: Complete your Mandatory Training Modules</Preview>
            <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f6f9fc', padding: '40px 0' }}>
                <Container style={{ backgroundColor: '#ffffff', border: '1px solid #e6ebf1', borderRadius: '8px', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                    <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 20px 0' }}>
                        Juspay LMS Training Reminder
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '24px' }}>
                        Hi {userName || "Team"},
                    </Text>
                    <Text style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '24px' }}>
                        This is a friendly reminder that you have incomplete mandatory training modules waiting for you in the Juspay Learning Management System.
                    </Text>

                    <Section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '6px', margin: '20px 0', border: '1px solid #eeeeee' }}>
                        <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 10px 0' }}>Pending Modules:</Text>
                        <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#4a4a4a', fontSize: '14px', lineHeight: '24px' }}>
                            {missingModules.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                    </Section>

                    <Link href="https://lms-red-one.vercel.app" style={{ display: 'inline-block', backgroundColor: '#6d28d9', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', marginTop: '20px' }}>
                        Go to Dashboard
                    </Link>
                </Container>
            </Body>
        </Html>
    );
}
