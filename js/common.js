export const log = console.log;

export const wait = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

export const loadImage = (src) => {
  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => reject('Ошибка загрузки файла ' + src);
  });

  return promise;
}
