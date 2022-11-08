// DO NOT, UNDER ANY CIRCUMSTANCE, SHOULD YOU IMPORT OPENSEADRAGON IN HERE.
// I HONESTLY DON'T CARE IF IMPORTING IT WILL SAVE YOUR LIFE.

import {AfterViewInit, Component, Injectable, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import OpenSeadragon from './osd/openseadragon.js';
import Annotorious  from '@recogito/annotorious-openseadragon';
import BetterPolygon from '@recogito/annotorious-better-polygon';
import Toolbar from '@recogito/annotorious-toolbar';
import {HttpClient} from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface Response {
  slideURL: string,
  slideFileName: string,
  slideMPP: number,
}
@Injectable()
@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})

export class SlideComponent implements OnInit {
  public info;
  public config;
  SpecimenType: any;
  ClinicalDetails: any;
  Macroscopic: any;
  Microscopic: any;
  Diagnosis: any;
  name: any;
  constructor(private http: HttpClient, private location:Location) { }

  ngOnInit(): void {

  }


  ngAfterViewInit(): void {
  let viewer;
    this.info = this.location.getState();
    const url = 'http://127.0.0.1:5000' + this.info.filePath;

    this.http.get<any>(url).subscribe( data => {
      this.name = data.slideFileName;
      console.log(data.slideFileName)
      viewer =  OpenSeadragon({
          id: 'seadragon-viewer',
          tileSources: 'http://127.0.0.1:5000' + data.slideURL,
          prefixUrl: '//openseadragon.github.io/openseadragon/images/',
          showNavigator: true,
          showRotationControl: true,
          animationTime: 0.5,
          blendTime: 0.1,
          constrainDuringPan: true,
          maxZoomPixelRatio: 2,
          minZoomImageRatio: 1,
          visibilityRatio: 1,
          zoomPerScroll: 2,
          timeout: 120000,
        });
        const mpp = data.slideMPP;
        viewer.scalebar({
          pixelsPerMeter: mpp ? (1e6 / mpp) : 0,
          xOffset: 10,
          yOffset: 10,
          barThickness: 3,
          color: '#555555',
          fontColor: '#333333',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        });
      const config = {};
      const anno = Annotorious(viewer);
      BetterPolygon(anno);
      Toolbar(anno, document.getElementById('my-toolbar-container'));
      anno.loadAnnotations('http://127.0.0.1:5000/getAnnotations' + this.info.filePath). then((annotations) => {
        console.log(annotations);
      });
      ;

      anno.on('createAnnotation',  (annotation) => {
        this.http.post<any>('http://127.0.0.1:5000/addAnnotation' + this.info.filePath, annotation).subscribe(data => {});
      });


      anno.on('deleteAnnotation',  (annotation) => {
        this.http.post<any>('http://127.0.0.1:5000/deleteAnnotation' + this.info.filePath, annotation).subscribe(data => {});
      });

      // BLOCKED UNTIL WE FIND OUT WHAT'S WRONG!

      // anno.on('updateAnnotation',  (annotation, previous) => {
      //   console.log(annotation)
      //   console.log()
      //   console.log(previous)
      //   this.http.post<any>('http://127.0.0.1:5000/deleteAnnotation' + this.info.filePath, previous).subscribe(data => {});
      //   this.http.post<any>('http://127.0.0.1:5000/addAnnotation' + this.info.filePath, annotation).subscribe(data => {});
      //
      // });
    })
    console.log('http://127.0.0.1:5000/getReport' + this.info.filePath)
    this.http.get<any>('http://127.0.0.1:5000/getReport' + this.info.filePath).subscribe(resp => {
      console.log(resp)
      this.SpecimenType = resp.specimen;
      this.ClinicalDetails = resp.clinical;
      this.Macroscopic = resp.macro;
      this.Microscopic = resp.micro;
      this.Diagnosis = resp.diag;

      ;})
    console.log(this.config);
  }

  saveResults() {
    this.http.post<any>('http://127.0.0.1:5000/saveReport' + this.info.filePath, {
      specimen: this.SpecimenType,
      clinical: this.ClinicalDetails,
      macro: this.Macroscopic,
      micro: this.Microscopic,
      diag: this.Diagnosis
    }).subscribe(data => {
    })

  }


    generatePDF() {
      let dd = {
        content: [
          {text:'The Polytechnic University of Hong Kong', style:'header'},
          {text:'Department of Comptuer Pathology', style:'subheader'},
          {text:'Digital Pathology Report', style:'subheader'},
          ' ',

          {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 } ]},
          'Patient Name: Patient 1',
          ' ',
          'Doctor Name: YEUNG, Stephen',
          ' ',

          {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 } ]},
          ' ',
          {text:'Findings: ', style:'bold'},
          ' ',
          'Slide Name: ' + this.name,
          ' ',
          {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 } ]},

          {text:'Specimen Type: ', style:'bold'},
          ' ',
          this.SpecimenType,
          ' ',
          ' ',
          {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 } ]},

          {text:'Clinical Details: ', style:'bold'},
          ' ',
          this.ClinicalDetails,
          ' ',
          ' ',
          {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 } ]},
          {text:'Macroscopic Examination: ', style:'bold'},
          ' ',
          this.Macroscopic,
          ' ',
          ' ',
          {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 } ]},
          {text:'Microscopic Examination: ', style:'bold'},
          ' ',
          this.Microscopic,
          ' ',
          ' ',
          {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 } ]},
          {text:'Diagnosis: ', style:'bold'},
          ' ',
          this.Diagnosis,
          ' ',
          ' ',
          {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 } ]}
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true
          },subheader: {
            fontSize: 19,
            bold: true
          },
          bold: {
            bold: true
          }
        }

      }

      pdfMake.createPdf(dd).open();
    }






}
