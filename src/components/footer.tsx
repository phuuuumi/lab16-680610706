type footerProps = {
    fullName: string,
    studentId: string,
}

export default function Footer({fullName, studentId }: footerProps) {
    return (
        <footer className="w-full text-center">
            <p className="border p-2 text-muted-foreground text-xs">
                จัดทำโดย {fullName} - {studentId}
            </p>
        </footer>
    )
}