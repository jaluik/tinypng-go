const TINYIMG_URL = ['tinyjpg.com', 'tinypng.com'];

export const randomHeader = () => {
  const ip = new Array(4)
    .fill(0)
    .map(() => Math.round(Math.random() * 255))
    .join('.');

  return {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Postman-Token': Date.now(),
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'X-Forward-For': ip,
  };
};

export const randomRequestOption = () => {
  const index = Math.random() < 0.5 ? 0 : 1;

  const headers = randomHeader();
  return {
    headers,
    hostname: TINYIMG_URL[index],
    method: 'POST',
    path: '/web/shrink',
    rejectUnauthorized: false,
  };
};
