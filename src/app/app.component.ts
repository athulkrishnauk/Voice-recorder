import { Component } from '@angular/core';

import { DomSanitizer } from "@angular/platform-browser";
import * as RecordRTC from "recordrtc";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'audioRecorder';

  record;
  recording = false;
  start = true;

  record_out;
  error;

  constructor(private domSanitizer: DomSanitizer) {}
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  startRecording() {
    this.start = false;
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream) {
    var options = {
      mimeType: "audio/wav",
      numberOfAudioChannels: 1,
      sampleRate: 48000
    };
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    this.record.stop(this.playRecording.bind(this));
  }

  playRecording(blob) {
    this.record_out = URL.createObjectURL(blob);
  }

  errorCallback(error) {
    this.error = "Audio not play in your browser";
  }

  retry() {
    this.start = true;
    this.record_out = null;
  }

  ngOnInit() {}

}
