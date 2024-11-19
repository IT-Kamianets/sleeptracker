import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sleeptracker';

  // Таймерні змінні
  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;
  isRunning: boolean = false;
  timerInterval: any;

  // Форматування часу
  formatTime(): string {
    return `${this.padZero(this.hours)}:${this.padZero(this.minutes)}:${this.padZero(this.seconds)}`;
  }

  // Допоміжна функція для додавання нуля перед одиничними цифрами
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  // Запуск таймера
  startTimer(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.resetTimer();

      this.timerInterval = setInterval(() => {
        this.seconds++;
        if (this.seconds === 60) {
          this.seconds = 0;
          this.minutes++;
        }
        if (this.minutes === 60) {
          this.minutes = 0;
          this.hours++;
        }
      }, 1000);
    }
  }

  // Скидання значень часу
  resetTimer(): void {
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
  }

  // Зупинка таймера та збереження часу
  stopTimer(): void {
    clearInterval(this.timerInterval);
    this.isRunning = false;

    const currentDate = new Date();
    const timeSpent = this.formatTime();

    const savedData = this.loadStoredData();
    savedData.push({ date: currentDate.toISOString(), time: timeSpent });

    localStorage.setItem('timeSpentRecords', JSON.stringify(savedData));
    this.displayStoredData(savedData);
  }

  // Завантаження всіх збережених даних
  loadStoredData(): any[] {
    const savedData = localStorage.getItem('timeSpentRecords');
    return savedData ? JSON.parse(savedData) : [];
  }

  // Виведення всіх збережених записів
  displayStoredData(data: any[]): void {
    const storedDataContainer = document.getElementById('storedData')!;
    storedDataContainer.innerHTML = '';

    data.forEach((entry: { date: string, time: string }) => {
      const entryElement = document.createElement('div');
      entryElement.classList.add('entry');
      entryElement.innerText = `Дата: ${new Date(entry.date).toLocaleString()} - Час: ${entry.time}`;
      storedDataContainer.appendChild(entryElement);
    });
  }

  // Очищення всіх збережених даних
  clearData(): void {
    localStorage.removeItem('timeSpentRecords');
    this.displayStoredData([]); // Очищаємо виведені дані
  }

  // Завантаження збережених даних при ініціалізації компонента
  ngOnInit(): void {
    const savedData = this.loadStoredData();
    this.displayStoredData(savedData);
  }
}
