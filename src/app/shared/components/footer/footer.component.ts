import { Component, OnInit } from '@angular/core';
import {LoaderService} from '../../../components/loader/loader.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentDate = new Date();

  constructor(
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
  }

}
