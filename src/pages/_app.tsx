import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Layout from "@/components/Layout";
import { TaskProvider } from "@/contexts/TaskContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProjectProvider>
      <TaskProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TaskProvider>
    </ProjectProvider>
  );
}
