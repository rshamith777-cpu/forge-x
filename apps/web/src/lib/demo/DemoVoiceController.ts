export class DemoVoiceController {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isMuted = false;

  constructor() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.initVoice();
        if (this.synth && 'onvoiceschanged' in this.synth) {
          this.synth.onvoiceschanged = () => this.initVoice();
        }
      }
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  }

  private initVoice() {
    try {
      if (!this.synth) return;
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) return;
      
      const femaleVoices = voices.filter(v => 
        v.lang && v.lang.startsWith('en') && 
        !v.name.includes('David') && 
        !v.name.includes('Mark') && 
        !v.name.includes('George') && 
        !v.name.includes('Guy') &&
        !v.name.includes('Male')
      );

      const premiumFemale = femaleVoices.filter(v => 
        v.name.includes('Aria') || 
        v.name.includes('Jenny') || 
        v.name.includes('Natural') || 
        v.name.includes('Online') ||
        v.name.includes('Female') ||
        v.name.includes('Woman')
      );
      
      this.voice = premiumFemale[0] 
        || femaleVoices.find(v => v.name.includes('Zira')) 
        || femaleVoices.find(v => v.name.includes('Samantha'))
        || femaleVoices.find(v => v.name.includes('Google US English'))
        || femaleVoices.find(v => v.name.includes('Google UK English Female'))
        || femaleVoices[0]
        || voices[0];
    } catch (e) {
      console.warn("Error initializing voices:", e);
    }
  }

  public speak(text: string) {
    try {
      if (this.isMuted || !this.synth) return;
      this.stop();
      
      if (!this.voice && this.synth) {
        this.initVoice();
      }
      
      if (typeof SpeechSynthesisUtterance !== 'undefined') {
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) {
          utterance.voice = this.voice;
        }
        
        utterance.rate = 0.95;
        utterance.pitch = (this.voice && (this.voice.name.includes('Zira') || this.voice.name.includes('Aria') || this.voice.name.includes('Jenny') || this.voice.name.includes('Samantha') || this.voice.name.includes('Female'))) ? 1.0 : 1.25;
        
        this.synth.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis speak error:", e);
    }
  }

  public stop() {
    try {
      if (this.synth) this.synth.cancel();
    } catch (e) {}
  }

  public pause() {
    try {
      if (this.synth) this.synth.pause();
    } catch (e) {}
  }

  public resume() {
    try {
      if (this.synth) this.synth.resume();
    } catch (e) {}
  }
}
