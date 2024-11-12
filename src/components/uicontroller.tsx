interface UIElements {
  convertButton: HTMLButtonElement;
  loadingIndicator: HTMLElement;
  errorDisplay: HTMLElement;
  textInput: HTMLTextAreaElement;
  voiceSelect: HTMLSelectElement;
}

export class UIController {
  private elements: UIElements;

  constructor() {
    this.elements = {
      convertButton: document.getElementById('convertBtn') as HTMLButtonElement,
      loadingIndicator: document.getElementById('loadingIndicator') as HTMLElement,
      errorDisplay: document.getElementById('errorDisplay') as HTMLElement,
      textInput: document.getElementById('textInput') as HTMLTextAreaElement,
      voiceSelect: document.getElementById('voiceSelect') as HTMLSelectElement
    };
  }

  public setLoading(loading: boolean): void {
    this.elements.convertButton.disabled = loading;
    this.elements.convertButton.textContent = loading ? 'Converting...' : 'Convert to Speech';
    this.elements.loadingIndicator.style.display = loading ? 'block' : 'none';
  }

  public showError(message: string): void {
    this.elements.errorDisplay.textContent = message;
    this.elements.errorDisplay.style.display = 'block';
  }

  public hideError(): void {
    this.elements.errorDisplay.style.display = 'none';
  }

  public getText(): string {
    return this.elements.textInput.value.trim();
  }

  public getVoiceId(): string {
    return this.elements.voiceSelect.value;
  }
}