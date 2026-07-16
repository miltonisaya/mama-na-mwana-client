import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {AiAssistantService} from './ai-assistant.service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'error';
  text: string;
  columns?: string[] | null;
  rows?: Array<Record<string, any>> | null;
}

@Component({
  selector: 'app-ai-assistant',
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.scss']
})
export class AiAssistantComponent implements AfterViewChecked {
  @ViewChild('messagesEl') private messagesEl?: ElementRef<HTMLDivElement>;

  readonly examplePrompts = [
    'How many contacts registered this month?',
    'Which facility has the most pending transactions?',
    'How many contacts are in each age group?'
  ];

  isOpen = false;
  isExpanded = false;
  isLoading = false;
  question = '';
  messages: ChatMessage[] = [];

  private shouldScroll = false;

  constructor(private aiAssistantService: AiAssistantService) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.messagesEl) {
      this.messagesEl.nativeElement.scrollTop = this.messagesEl.nativeElement.scrollHeight;
      this.shouldScroll = false;
    }
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.shouldScroll = true;
    }
  }

  close(): void {
    this.isOpen = false;
    this.isExpanded = false;
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    this.shouldScroll = true;
  }

  useExample(prompt: string): void {
    this.question = prompt;
    this.send();
  }

  send(): void {
    const trimmed = this.question.trim();
    if (!trimmed || this.isLoading) {
      return;
    }

    this.messages.push({role: 'user', text: trimmed});
    this.question = '';
    this.isLoading = true;
    this.shouldScroll = true;

    this.aiAssistantService.ask(trimmed).subscribe({
      next: (result) => {
        this.messages.push({
          role: 'assistant',
          text: result?.answer ?? "I couldn't come up with an answer to that.",
          columns: result?.columns,
          rows: result?.rows
        });
        this.isLoading = false;
        this.shouldScroll = true;
      },
      error: (err) => {
        this.messages.push({
          role: 'error',
          text: err?.error?.message ?? err?.error?.error ?? 'Something went wrong answering that question.'
        });
        this.isLoading = false;
        this.shouldScroll = true;
      }
    });
  }
}
