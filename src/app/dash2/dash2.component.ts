import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  selector: 'app-dashboard-2',
  templateUrl: './dash2.component.html',
  styleUrls: ['./dash2.component.scss'],
})



@Injectable()
export class Dash2Component implements OnInit {
  public answ;
  public vals = 22;
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

  ngAfterViewInit()
  {
    this.vals = 22;
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
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })

  }

  randomValue()
  {
    this.vals += Math.round(Math.random() * 20)
    console.log(this.vals)
    return this.vals
  }


  sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable2");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }
}
