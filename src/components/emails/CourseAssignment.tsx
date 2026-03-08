import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
} from "@react-email/components";
import * as React from "react";

interface CourseAssignmentEmailProps {
    courseTitle: string;
    courseUrl: string;
}

export const CourseAssignmentEmail = ({
    courseTitle,
    courseUrl,
}: CourseAssignmentEmailProps) => (
    <Html>
        <Head />
        <Preview>New Mandatory Training: {courseTitle}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>New Mandatory Module Assigned</Heading>
                <Text style={text}>
                    A new mandatory learning module has been published to your curriculum.
                </Text>
                <Text style={courseTitleText}>"{courseTitle}"</Text>
                <Link href={courseUrl} style={button}>
                    Start Course Now
                </Link>
                <Text style={footer}>
                    This is an automated message from the Juspay LMS Platform.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default CourseAssignmentEmail;

const main = {
    backgroundColor: "#000000",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#111111",
    margin: "0 auto",
    padding: "40px 20px",
    borderRadius: "12px",
    border: "1px solid #333",
    textAlign: "center" as const,
};

const h1 = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "1.2",
    marginBottom: "20px",
};

const text = {
    color: "#a3a3a3",
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "24px",
};

const courseTitleText = {
    color: "#9A7BFF", // Primary accent
    fontSize: "20px",
    fontWeight: "bold",
    lineHeight: "1.5",
    marginBottom: "32px",
};

const button = {
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    color: "#000000",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
    marginBottom: "30px",
};

const footer = {
    color: "#666666",
    fontSize: "12px",
    lineHeight: "1.5",
    marginTop: "20px",
};
