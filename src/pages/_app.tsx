import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProjectProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProjectProvider>
  );
}
