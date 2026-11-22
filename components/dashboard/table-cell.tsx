export function TableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (<td
        className={`px-5 py-4 align-middle ${className}`}
    >
        {children}
    </td>
    )
}
