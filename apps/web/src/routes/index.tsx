import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";
import { homeHead } from "@/lib/home-head";
export const Route = createFileRoute("/")({ head: () => homeHead(), component: App });
