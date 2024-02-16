/**
 * Stopwatch class
 */
export class Stopwatch {
    private startTime: number;
    private intervalId: number;
    private callback: () => void;

    /**
     * Constructor
     * @param callback callback function
     */
    constructor(callback: () => void) {
        this.callback = callback;
        this.startTime = 0;
        this.intervalId = 0;
    }

    /**
     * Start the stopwatch
     */
    public start(): void {
        this.clear();
        this.startTime = new Date().getTime();
        this.intervalId = setInterval(this.callback, 100);
    }

    /**
     * Stop the stopwatch
     */
    public stop(): void {
        if (this.intervalId !== 0) this.clear();
    }

    /**
     * Get the elapsed time
     * @returns elapsed time in milliseconds
     */
    public getElapsedTime(): number {
        return new Date().getTime() - this.startTime;
    }

    /**
     * Clear the interval
     */
    private clear(): void {
        clearInterval(this.intervalId);
        this.intervalId = 0;
    }

}