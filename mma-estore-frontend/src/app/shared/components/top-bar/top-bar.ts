import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

@Component({

  selector: 'app-top-bar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './top-bar.html',

  styleUrl: './top-bar.css'

})

export class TopBar {

}