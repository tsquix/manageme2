import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Layout from "@/components/Layout";
import { TaskProvider } from "@/contexts/TaskContext";
import { SessionProvider } from "next-auth/react";
export default function App({ session, Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ProjectProvider>
        <TaskProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </TaskProvider>
      </ProjectProvider>
    </SessionProvider>
  );
}
