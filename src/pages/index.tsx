import { useEffect } from 'react';

export default function Home() {

  const openWebPage = async () => {
    try {
      const response = await fetch('/api/puppeteer');
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Failed to open web page', error);
    }
  };



  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-20 bg-teal-600'>
      <h1 className='text-7xl text-center text-white'>WebScrapping con Puppeteer</h1>
      <button className='rounded-md px-20 py-5 bg-fuchsia-600 text-white shadow-xl border border-black' onClick={() => openWebPage()}>Comenzar</button>
    </main>
  );
}
