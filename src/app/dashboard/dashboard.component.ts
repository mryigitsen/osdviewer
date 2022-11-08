import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
export interface Slides {
  fileName: string,
  filePath: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})



@Injectable()
export class DashboardComponent implements OnInit {
  public answ;
  constructor(private http: HttpClient, private router: Router) {

  }
  toggleProBanner(event) {
    event.preventDefault();
    document.querySelector('body').classList.toggle('removeProbanner');
  }
  ngOnInit() {
    let ans = this.http.get<any>('http://127.0.0.1:5000/Users/yigitsen/Desktop/August_Martin/server/').subscribe( data => {
      this.answ = data;
      ans.unsubscribe();
    });

  }

  showSlide(filePath: any) {
    this.router.navigateByUrl('/slide', { state: { filePath:filePath }});

  }


  sendToAI()
  {
    let timerInterval
    Swal.fire({
      title: 'Sent to the AI',
      html: 'Estimated Time of Completion: <b></b> minutes.',
      timer: 6000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          // tslint:disable-next-line:radix
          b.textContent = String(parseInt(String(Swal.getTimerLeft() / 600)))
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      this.router.navigateByUrl('/dash2');

      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })



  }
}
