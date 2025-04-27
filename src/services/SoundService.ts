class SoundService {
  private static instance: SoundService;
  private static _isMuted: boolean = false;
  private backgroundMusic: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();

  public constructor() {
    this.initializeSounds();
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  public static isMuted(): boolean {
    return SoundService._isMuted;
  }

  public static play(soundName: string): void {
    SoundService.getInstance().playSoundEffect(soundName);
  }

  public static toggleMute(): void {
    SoundService._isMuted = !SoundService._isMuted;
    SoundService.getInstance().handleMuteChange();
  }

  public initializeSounds(): void {
    // Initialize sound effects
    this.soundEffects.set('click', new Audio('/sounds/click.mp3'));
    this.soundEffects.set('success', new Audio('/sounds/success.mp3'));
    this.soundEffects.set('error', new Audio('/sounds/error.mp3'));
    this.soundEffects.set('notification', new Audio('/sounds/notification.mp3'));
    
    // Initialize background music
    this.backgroundMusic = new Audio('/sounds/background.mp3');
    this.backgroundMusic.loop = true;
  }

  private handleMuteChange(): void {
    if (SoundService._isMuted) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
  }

  public playBackgroundMusic(): void {
    if (this.backgroundMusic && !SoundService._isMuted) {
      this.backgroundMusic.play().catch(console.error);
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  public playSoundEffect(effectName: string): void {
    if (SoundService._isMuted) return;
    
    const sound = this.soundEffects.get(effectName);
    if (sound) {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.play().catch(console.error);
    }
  }
}

export default SoundService;