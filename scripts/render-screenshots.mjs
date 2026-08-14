import puppeteer from '/tmp/zahedian-render/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome-stable',
  headless: true,
});

async function capture(name, width, height, fullPage = true) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    })));
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
    document.documentElement.style.scrollBehavior = 'auto';
  });
  if (fullPage) {
    await page.evaluate(async () => {
      const step = Math.max(420, Math.floor(window.innerHeight * .72));
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 45));
      }
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 180));
    });
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((element) => {
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'none', 'important');
        element.style.setProperty('transition', 'none', 'important');
      });
    });
  }
  await page.screenshot({ path: `deliverables/${name}.png`, fullPage });
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    title: document.title,
    direction: document.documentElement.dir,
    images: [...document.images].filter((image) => image.currentSrc).map((image) => ({ src: image.currentSrc, complete: image.complete, width: image.naturalWidth })),
    overflow: [...document.querySelectorAll('*')]
      .map((element) => ({ tag: element.tagName, className: element.className, left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, width: element.getBoundingClientRect().width }))
      .filter((item) => item.left < -0.5 || item.right > document.documentElement.clientWidth + 0.5)
      .slice(0, 30),
  }));
  console.log(JSON.stringify({ name, errors, metrics }));
  await page.close();
}

await capture('homepage-desktop-preview', 1440, 1000, false);
await capture('homepage-desktop', 1440, 1000, true);
await capture('homepage-mobile', 390, 844, true);
await browser.close();
