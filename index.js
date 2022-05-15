const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function init(){
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://www.alza.cz/');
    // cookies
    await page.click('#alzaDialog > div.close');
    await page.click('body > div.js-cookies-info.cookies-info.cols-3 > div > div > div.cookies-info__buttons > a.cookies-info__button.cookies-info__button--link.js-cookies-info-reject');


    //search product
    await page.type('#edtSearch', 'lednicka');
    await page.click('#btnSearch');

    await page.waitForNavigation();
    //------

    // select all prices
    const prices = await page.evaluate(() =>{
        return Array.from(document.querySelectorAll('span.c2')).map(x => x.textContent);
    });
    await fs.writeFile('names.txt', prices.join('\r\n'));
    //------

    // select img urls
    const photos = await page.$$eval("#boxes em img", (imgs) =>{
        return imgs.map(x => x.getAttribute('data-src'));
    });
    console.log(photos);
    //------

    await browser.close();
}

init();