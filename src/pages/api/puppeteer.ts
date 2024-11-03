import puppeteer from 'puppeteer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 200,
        });

        const context = await browser.createBrowserContext();

        const page1 = await context.newPage();
        const page2 = await context.newPage();

        await page1.goto('https://www.mercadolibre.com.mx/#from=homecom');
        // Set screen size.
        await page1.setViewport({ width: 1080, height: 1024 });
        // Esperar hasta que el input esté disponible en el DOM
        await page1.waitForSelector('#cb1-edit');

        // Hacer clic en el input
        const inputSelector = '#cb1-edit'; // Cambia esto al selector correcto del input en tu página
        await page1.click(inputSelector);

        // Escribir "hola" en el input
        await page1.type(inputSelector, 'Xbox series X');

        // Opcionalmente: hacer clic en el botón para enviar el formulario
        const submitButtonSelector = '.nav-search-btn';
        await page1.click(submitButtonSelector);


        res.status(200).json({ message: 'Page opened successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to open the page' });
    }
}
