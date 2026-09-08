import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";
import { homeHead } from "@/lib/home-head";
export const Route = createFileRoute("/es/")({ head: () => homeHead("es"), component: App });
