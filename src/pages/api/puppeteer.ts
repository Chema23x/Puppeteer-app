import puppeteer from 'puppeteer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const { title } = req.body;


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

        // Otra manera de hacerlo
        // const inputSelector = ''; 
        // await page1.click(inputSelector);
        // await page1.type(inputSelector, 'Xbox series X');

        await page1.locator('#cb1-edit').fill(title);

        //Hacer click para la busqueda
        const submitButtonSelector = '.nav-search-btn';
        await page1.click(submitButtonSelector);

        await page1.waitForSelector('.ui-search-layout__item');

        // Extraer los precios de los productos
        const prices = await page1.evaluate(() => {
            const productElements = Array.from(document.querySelectorAll(".ui-search-layout__item"));
            return productElements
                .slice(0, 5)
                .map(item => {

                    const priceElement = item.querySelector(".andes-money-amount__fraction");
                    const priceText = priceElement ? priceElement.textContent : null;
                    return priceText ? parseFloat(priceText.replace(/,/g, '')) : null;
                })
                .filter(price => price !== null);
        });
        //Encontrar el precio mas bajo
        const mercadoPrice = Math.min(...prices);

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
        await page2.mouse.click(100, 100);

        await page2.waitForSelector("#twotabsearchtextbox");

        await page2.locator("#twotabsearchtextbox").fill(title);

        await page2.locator("#nav-search-submit-button").click();

        // Espera a que se cargue la lista de productos
        await page2.waitForSelector('.a-offscreen');

        // Extraer el precio del primer producto
        const price = await page2.evaluate(() => {
            return document.querySelector('.a-offscreen')?.textContent; // Selecciona el primer producto
        });
        if (typeof price === 'string') {
            // Eliminar el símbolo de dólar y convertir a número
            const amazonPrice = parseFloat(price.replace(/[$,]/g, ''));

            return res.status(200).json({ mercadoPrice, amazonPrice });
        } else {
            console.log('El precio no está disponible o es inválido.');
        }


    } catch (error) {
        return res.status(500).json({ error: 'Failed to open the page' });
    }
}
