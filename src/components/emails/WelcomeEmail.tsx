import * as React from 'react';
import { Html, Head, Preview, Body, Container, Text, Link, Section, Hr } from '@react-email/components';

interface WelcomeEmailProps {
    userName: string;
    loginUrl: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userName, loginUrl }) => (
    <Html>
        <Head />
        <Preview>Welcome to the Juspay Enterprise Learning Management System</Preview>
        <Body style={{ backgroundColor: '#0f172a', fontFamily: 'sans-serif', color: '#f8fafc' }}>
            <Container style={{ margin: '0 auto', padding: '20px 0 48px', width: '580px' }}>
                <Text style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#93c5fd' }}>
                    JUSPAY LMS
                </Text>

                <Section style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Text style={{ fontSize: '18px', color: '#f8fafc' }}>
                        Hello {userName},
                    </Text>
                    <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#cbd5e1' }}>
                        An enterprise learning account has been automatically provisioned for you. You can now access mandatory training modules, track your progress, and earn certificates.
                    </Text>
                    <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#cbd5e1', fontWeight: 'bold' }}>
                        Please authenticate using your Corporate Google Workspace account.
                    </Text>

                    <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                        <Link
                            href={loginUrl}
                            style={{
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                display: 'inline-block'
                            }}
                        >
                            Sign In with Google
                        </Link>
                    </Section>

                    <Hr style={{ borderColor: '#334155', margin: '32px 0 24px' }} />

                    <Text style={{ color: '#64748b', fontSize: '13px', lineHeight: '20px' }}>
                        If you have trouble logging in, please contact your systems administrator. Ensure you are using your official domain organization email.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);
