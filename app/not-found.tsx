import { Button } from "@/components/ui/button";
export default function NotFound() {
    return <div
        className="grid min-h-screen place-items-center px-5"
    >
        <div
            className="text-center"
        >
            <p
                className="text-7xl font-black tracking-tighter text-(--orange)"
            >
                404
            </p>
            <h1
                className="mt-3 text-2xl font-extrabold"
            >
                We can’t find that page.
            </h1>
            <p
                className="mt-2 text-sm text-muted"
            >
                The link may be old, or the page may have moved.
            </p>
            <Button
                href="/"
                className="mt-7"
            >
                Back to GearHub
            </Button>
        </div>
    </div>;
}
