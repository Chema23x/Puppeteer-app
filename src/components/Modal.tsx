import Image from "next/image";

type ModalProps = {
    close: (value: null) => void;
    title: string;
    price1: number;
    price2: number;
    price3: number;
    company1: string;
    company2: string;
    company3: string;
    prices: object | null;
}
 
const imgs: { [key: string]: string } = {
    "Super Smash Bros. Ultimate": "/assets/img/juego.jpg",
    "Control de Xbox Series X": "/assets/img/control.jpg",
    "Iphone 14": "/assets/img/iphone.jpg",
    "Go pro 12": "/assets/img/camara.jpg"
};

export const Modal = ({ close, title, price1, price2, price3, prices, company1,company2,company3 }: ModalProps) => {
    return (
        <section className="h-screen w-full inset-0 absolute flex justify-center items-center">
            <div className="w-1/2 h-3/4 bg-white rounded-md shadow-md relative flex flex-col p-20 gap-y-20  items-center">
                <button onClick={() => close(null)} className="absolute top-5 right-5 w-5">
                    <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                    </svg>
                </button>
                <h3 className="text-4xl font-bold">{title}</h3>
                <div className="flex justify-between item w-full">
                    <Image 
                        className="w-5/12 h-52 object-contain" 
                        src={imgs[title]} 
                        alt="producto" 
                        width={500} 
                        height={500} 
                    />
                    <div className="w-1/2 flex flex-col items-center">
                        <h4 className="text-4xl font-bold">Mejor precio</h4>
                        {prices == null ?
                            <div className="flex w-full h-full text-5xl justify-center items-center ">
                                <span className="effect">C</span>
                                <span className="effect">a</span>
                                <span className="effect">r</span>
                                <span className="effect">g</span>
                                <span className="effect">a</span>
                                <span className="effect">n</span>
                                <span className="effect">d</span>
                                <span className="effect">o</span>
                            </div>
                            :
                            typeof prices == 'object' ?
                                <div className="h-full w-full flex flex-col justify-center items-center gap-y-5 font-bold text-xl">
                                    <div className="text-xl">
                                        <span>{company1}:  </span>
                                        <span 
                                            className="text-green-600">   
                                            {price1.toLocaleString("es-MX", {
                                                style: "currency",
                                                currency: "MXN"
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex w-full text-xs">
                                        <div className="w-full flex gap-x-2">
                                            <span>{company2}:</span>
                                            <span 
                                                className="text-red-500">
                                                {price2.toLocaleString("es-MX", {
                                                    style: "currency",
                                                    currency: "MXN"
                                                })}
                                            </span>
                                        </div>
                                        <div className="w-full flex justify-end gap-x-2">
                                            <span>{company3}:</span>
                                            <span 
                                                className="text-red-500">
                                                {price3.toLocaleString("es-MX", {
                                                    style: "currency",
                                                    currency: "MXN"
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            :
                            <div className="flex w-full h-full text-5xl justify-center items-center ">
                                <span>{prices}</span>
                            </div>
                        }
                    </div>
                </div>
                <div className="absolute bottom-10  w-full">
                    <h4 className="font-bold mb-4 w-full text-center">Sitios consultados</h4>
                    <div className="w-full flex justify-evenly">
                        <span className="border border-black hover:bg-black hover:text-white rounded-lg px-5">Amazon</span>
                        <span className="border border-black hover:bg-black hover:text-white rounded-lg px-5">Mercado Libre</span>
                        <span className="border border-black hover:bg-black hover:text-white rounded-lg px-5">Liverpool</span>
                    </div>
                </div>
            </div>
        </section >
    )
}