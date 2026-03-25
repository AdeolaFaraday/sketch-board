export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const WORDS = [
  'Apple', 'Banana', 'Cat', 'Dog', 'Elephant', 'Fire', 'Guitar', 'House', 'Island', 'Jungle',
  'Kangaroo', 'Lemon', 'Mountain', 'Notebook', 'Ocean', 'Piano', 'Queen', 'Robot', 'Sun', 'Tiger',
  'Umbrella', 'Volcano', 'Water', 'Xanadu', 'Yacht', 'Zebra', 'Airplane', 'Bicycle', 'Camera', 'Dolphin',
  'Egg', 'Flower', 'Garden', 'Helmet', 'Ice', 'Jellyfish', 'Keyboard', 'Lamp', 'Mirror', 'Night',
  'Owl', 'Penguin', 'Quilt', 'Rainbow', 'Snake', 'Train', 'Unicorn', 'Violin', 'Window', 'Xylophone'
];

export function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
