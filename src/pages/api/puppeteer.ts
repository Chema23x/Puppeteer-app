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

        const searchMercadoLibre = async () => {
            const page1 = await browser.newPage();
            await page1.goto('https://www.mercadolibre.com.mx/#from=homecom');
            await page1.setViewport({ width: 1500, height: 1080 });
            await page1.waitForSelector('#cb1-edit');
            await page1.type('#cb1-edit', title);

            await page1.click('.nav-search-btn');
            await page1.waitForSelector('.ui-search-layout__item');

            const prices = await page1.evaluate(() => {
                const productElements = Array.from(document.querySelectorAll(".poly-price__current"));
                return productElements
                    .slice(0, 3)
                    .map(item => {
                        const priceContainer = item.querySelector('.andes-money-amount__fraction');
                        return priceContainer ? parseFloat(priceContainer.textContent!.replace(/,/g, '')) : null;
                    })
                    .filter(price => price !== null) as number[];
            });
            await page1.close();
            return prices.length > 0 ? Math.min(...prices) : null;
        };

        // Amazon

        const searchAmazon = async () => {
            const page2 = await browser.newPage();
            await page2.setUserAgent('Mozilla/5.0');
            await page2.goto('https://www.amazon.com.mx/');
            await page2.setViewport({ width: 1500, height: 1080 });

            const searchSelector = await page2.evaluate(() => document.querySelector('#nav-bb-search') ? '#nav-bb-search' : '#twotabsearchtextbox');
            await page2.waitForSelector(searchSelector);
            await page2.type(searchSelector, title);
            await page2.click(searchSelector === '#nav-bb-search' ? '.nav-bb-button' : '#nav-search-submit-button');
            await page2.waitForSelector('.a-spacing-base');

            const price = await page2.evaluate(() => {
                const priceElement = document.querySelector(".a-spacing-base .a-price-whole");
                return priceElement ? parseFloat(priceElement.textContent!.replace(/[$,]/g, '')) : null;
            });
            await page2.close();
            return price;
        };

        //Liverpool
        
        const searchLiverpool = async () => {
            const page3 = await browser.newPage();
            await page3.goto('https://www.liverpool.com.mx/tienda/home');
            await page3.setViewport({ width: 1500, height: 1080 });
            await page3.waitForSelector('#mainSearchbar');
            await page3.locator('#mainSearchbar').fill(title);
            await page3.click(".icon-zoom");
            await page3.waitForSelector(".m-plp-card-container");

            const lprice = await page3.evaluate(() => {
                const card = document.querySelector(".m-plp-card-container")
                const discount = card?.querySelector(".a-card-discount")
                const normalPrice = card?.querySelector(".a-card-price")
                let amount;
                if(discount){
                   amount =  discount.textContent
                }else{
                    amount = normalPrice?.textContent
                }
                return amount;
            });
            let price;
            if(typeof lprice === "string"){
                price = lprice.replace(/[$,]/g, '')
                if(price.includes("-")){
                    price = price.split(" ")
                    price = parseFloat(price[0].slice(0, -2));
                }else{
                    price = parseFloat(price.slice(0, -2));
                }
            }else{
                console.error("Precio no encontrada")
            }
            await page3.close();
            return price;
        };
       
        const [mercadoPrice, amazonPrice, liverpoolPrice] = await Promise.all([
            searchMercadoLibre(),
            searchAmazon(),
            searchLiverpool()
        ]);

        await browser.close();

        const storePrices = {
           "Mercado Libre": mercadoPrice,
            "Amazon":amazonPrice,
            "Liverpool":liverpoolPrice
        }; 

        return res.status(200).json( storePrices );

    } catch (error) {
        console.error('Error occurred:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Failed to open the page', details: error instanceof Error ? error.message : String(error) });
    }
}




    

       


