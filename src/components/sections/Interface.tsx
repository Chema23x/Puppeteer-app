import { Modal } from "../Modal";
import { Option } from "../Option";
import { useState } from 'react';

export const Interface = () => {
    const [showOptions, setOptions] = useState(false);
    const [chosenProduct, setChosenProduct] = useState<string | null>(null);
    const [data, setData] = useState<object | null >(null);
    const props: string[] = [
        "Super Smash Bros. Ultimate",
        "Control de Xbox Series X",
        "Iphone 14",
        "Go pro 12"
    ];
    const openWebPage = async (title: string) => {
        try {
            const response = await fetch('/api/puppeteer', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title })  // Converts title to a JSON string
            });
            const d = await response.json();
            const values = Object.values(d);

            if(values.length > 0){
                const sortedData = Object.fromEntries(
                Object.entries(d).sort(([, priceA], [, priceB]) => Number(priceA) - Number(priceB))
            );
                const arr = Object.entries(sortedData);
                setData(arr);
            }else{
                setData(null);
            }
        } catch (error) {
            console.error('Failed to open web page', error);
        }
    };
    
    return (
        <>
            {showOptions ?
                <section className="h-screen w-full py-20 px-36 grid grid-flow-row grid-cols-2 gap-10 relative">
                    <button onClick={() => setOptions(false)} className="absolute top-5 left-10 w-10">
                        <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                        </svg>
                    </button>
                    {
                        props.map((title, index) => (
                            <Option
                                key={index}
                                title={title}
                                setValue={() => setChosenProduct(title)}
                                start={() => openWebPage(title)}
                                cleanState={() => setData(null)}
                            />
                        ))
                    }
                </section>
                :
                <section className="flex flex-col items-center gap-20">
                    <h1 className='text-7xl text-center text-white'>WebScrapping con Puppeteer</h1>
                    <button onClick={() => setOptions(true)} className='rounded-md w-1/4 px-20 py-5 bg-fuchsia-600 text-white shadow-xl border border-black'>
                        Comenzar
                    </button>
                </section>
            }

            {chosenProduct &&
                <Modal
                    title={chosenProduct}
                    close={() => setChosenProduct(null)}
                    prices={data}
                    price1={Array.isArray(data) && data.length >= 1 ? data[0][1] : 0}
                    price2={Array.isArray(data) && data.length >= 1 ? data[1][1] : 0}
                    price3={Array.isArray(data) && data.length >= 1 ? data[2][1] : 0}
                    company1={Array.isArray(data) && data.length >= 1 ? data[0][0] : 0}
                    company2={Array.isArray(data) && data.length >= 1 ? data[1][0] : 0}
                    company3={Array.isArray(data) && data.length >= 1 ? data[2][0] : 0}
                />
            }
        </>
    )
}