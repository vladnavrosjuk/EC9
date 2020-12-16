import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[appZoom]' })
export class ZoomDirective {
  constructor(private element: ElementRef) {}

  @Input()
  public defaultSize: string;

  @HostListener('mouseover')
  public mouseOver(): void {
    this.setFontSize('40');
  }

  @HostListener('mouseout')
  public mouseOut(): void {
    this.setFontSize(this.defaultSize);
  }

  private setFontSize(size: string): void {
    this.element.nativeElement.style.fontSize = `${size}px`;
  }
}
