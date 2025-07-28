import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </>
  );
}
