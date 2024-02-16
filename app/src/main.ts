import './style.scss';
import { setupNumberPuzzle } from './game/number-puzzle';

document.addEventListener("DOMContentLoaded", () => {
  const app: HTMLDivElement = document.getElementById('app') as HTMLDivElement;
  if (app) setupNumberPuzzle(app);
});

