import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, AfterViewInit{
  @ViewChild('footerCheckbox') footerCheckBox: ElementRef | undefined;
  currentTheme: string  = 'cyberpunk';

  ngOnInit() {
    this.loadTheme();
  }

  // le onInit est appelé avant la vue, donc le footerCheckBox est undefined
  ngAfterViewInit(): void {
    this.applyTheme();
  }

  loadTheme() {
    this.currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme')! : 'cyberpunk';
    this.applyTheme();
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);

    if (this.footerCheckBox && this.footerCheckBox.nativeElement) {
      console.log("this.footerCheckBox.nativeElement.checked", this.footerCheckBox.nativeElement.checked);
      this.footerCheckBox.nativeElement.checked = (this.currentTheme === 'dim');
    }
  }

  footerCheckBoxChecked() {
    this.currentTheme = this.footerCheckBox?.nativeElement.checked ? 'dim' : 'cyberpunk';
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
  }

}
