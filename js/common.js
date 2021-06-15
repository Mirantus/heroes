export const log = console.log;

export const wait = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));

export const getResources = (res, path, list = []) => {
  if (Array.isArray(res)) {
    res.forEach(fileName => {
      list.push(path + fileName);
    })
    return list;
  }

  if (typeof res === 'object') {
    return Object.keys(res).reduce((list, key) => {
      return getResources(res[key], path + key + '/', list);
    }, list);
  }

  return [...list, path + res];
};

const loadImage = (src) => {
  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.src = src;
    image.onload = resolve;
    image.onerror = reject;
  });

  return promise;
}

export const loadImages = images => {
  const promises = images.map(loadImage);
  return Promise.all(promises);
};
