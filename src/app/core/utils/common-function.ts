export default class Utils {
  static getBackgroundDivHeight(
    divContainer,
    fixedHeight,
    elRef
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const divElement: HTMLElement = elRef.nativeElement.querySelector(
        `${divContainer}`
      );
      if (divElement) {
        const backgroundImage = new Image();
        backgroundImage.src = window
          .getComputedStyle(divElement)
          .backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2');

        backgroundImage.onload = () => {
          const divHeight = divElement.getBoundingClientRect().height;
          let imgHeigh = divHeight;
          const h: number = fixedHeight + imgHeigh;
          const containerHeight = `calc(100vh - ${h}px)`;
          resolve(containerHeight);
        };

        backgroundImage.onerror = (error) => {
          console.error('Error loading background image', error);
          reject(error);
        };
      } else {
        reject('Div element not found');
      }
    });
  }

  static arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
}
