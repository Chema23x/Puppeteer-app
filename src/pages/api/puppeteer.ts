import puppeteer from 'puppeteer';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const { title } = req.body;

        let mercadoPrice;
        let amazonPrice;
        let liverpoolPrice;

        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 200,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page1 = await browser.newPage();

        await page1.goto('https://www.mercadolibre.com.mx/#from=homecom');
        // Set screen size.
        await page1.setViewport({ width: 1500, height: 1080 });
        // Esperar hasta que el input esté disponible en el DOM
        await page1.waitForSelector('#cb1-edit');

        // Hacer clic en el input

        await page1.locator('#cb1-edit').fill(title);

        //Hacer click para la busqueda
        const submitButtonSelector = '.nav-search-btn';
        await page1.click(submitButtonSelector);

        await page1.waitForSelector('.ui-search-layout__item');

        // Extraer los precios de los productos
        const prices: number[] | undefined = await page1.evaluate(() => {
            const productElements = Array.from(document.querySelectorAll(".ui-search-layout__item"));
            return productElements
                .slice(0, 3) // Limita a los primeros 3 elementos
                .map(item => {
                    const priceContainer = item.querySelector('.poly-price__current');
                    console.log(priceContainer);
                    if (priceContainer) {
                        const priceElement = priceContainer.querySelector(".andes-money-amount__fraction");
                        const priceText = priceElement ? priceElement.textContent : null;
                        return priceText ? parseFloat(priceText.replace(/,/g, '')) : null;
                    }
                    return null;
                })
                .filter(price => price !== null) as number[]; // Filtra valores nulos y asegura que sea un arreglo de números
        });
        
        if (prices && prices.length > 0) { // Asegúrate de que haya precios antes de calcular el mínimo
            mercadoPrice = Math.min(...prices);
            console.log(mercadoPrice);
        } else {
            console.log("No se encontraron precios.");
        }

        // Amazon

        const page2 = await browser.newPage();

        // Configurar un User-Agent realista  --- Evitar Captcha
        await page2.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36');

        // Evitar detección de WebDriver
        await page2.evaluate(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        });

        await page2.goto('https://www.amazon.com.mx/');

        await page2.setViewport({ width: 1500, height: 1080 });

        // Simular movimientos de ratón
        await page2.mouse.move(100, 100);

        let search2;
        let id2;
        search2 = await page2.evaluate(async () => {
            id2 = "#nav-bb-search"
            return document.querySelector(id2) ? document.querySelector(id2) : false; 
        })
        if(search2){
            await page2.locator("#nav-bb-search").fill(title);
            await page2.locator(".nav-bb-button").click();
        }else{
            await page2.waitForSelector("#twotabsearchtextbox");
            await page2.locator("#twotabsearchtextbox").fill(title);
            await page2.locator("#nav-search-submit-button").click();
        }

        await page2.locator("#twotabsearchtextbox").fill(title);

        await page2.locator("#nav-search-submit-button").click();

        // Espera a que se cargue la lista de productos
        await page2.waitForSelector('.a-spacing-base');

        // Extraer el precio del primer producto
        const price:string | null | undefined = await page2.evaluate(() => {
            const productElements = Array.from(document.querySelectorAll(".a-spacing-base"));
            let item = productElements.slice(0,1); 
            let value = item[0] ? item[0].querySelector(".a-price-whole")?.textContent : null;
            return value;
        });
        if (typeof price === 'string') {
            // Eliminar el símbolo de dólar y convertir a número
            amazonPrice = parseFloat(price.replace(/[$,]/g, ''));
            console.log(amazonPrice)
        } else {
            console.log('El precio no está disponible o es inválido.');
        }

        //Liverpool
        
        const page3 = await browser.newPage();

        // Configurar un User-Agent realista  --- Evitar Captcha
        await page3.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4380.66 Safari/537.36');

        // Evitar detección de WebDriver
        await page3.evaluate(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        });
        
        await page3.goto('https://www.liverpool.com.mx/tienda/home');
        // Set screen size.
        await page3.setViewport({ width: 1500, height: 1080 });

        await page3.waitForSelector('#mainSearchbar');

        // Simular movimientos de ratón
        await page3.mouse.move(100, 100);

        await page3.evaluate(() => {
            window.scrollBy(0, 100); // Emula el scroll
        });

        // Hacer clic en el input

        await page3.locator('#mainSearchbar').fill(title);

        await page3.click(".icon-zoom");

        await page3.waitForSelector(".m-plp-card-container")

        const lprice = await page3.evaluate(() => {
            let card = document.querySelector(".m-plp-card-container")
            let discount = card?.querySelector(".a-card-discount")
            let normalPrice = card?.querySelector(".a-card-price")
            let amount;
            if(discount){
               amount =  discount.textContent
            }else{
                amount = normalPrice?.textContent
            }
            return amount;
        });

        if(typeof lprice === "string"){
            liverpoolPrice = lprice.replace(/[$,]/g, '')
            if(liverpoolPrice.includes("-")){
                liverpoolPrice = liverpoolPrice.split(" ")
                liverpoolPrice = parseFloat(liverpoolPrice[0].slice(0, -2));
            }else{
                liverpoolPrice = parseFloat(liverpoolPrice.slice(0, -2));
            }
        }else{
            console.error("Precio no encontrada")
        }
        await browser.close();

        const storePrices = [mercadoPrice, amazonPrice, liverpoolPrice]; 
        console.log(storePrices);
        
        return res.status(200).json( storePrices );

    } catch (error) {
        return res.status(500).json({ error: 'Failed to open the page' });
    }
}
