import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  uploadImage = ""

  imageChange(event: any) {
    if (!event.target.files || !event.target.files[0]) return;

    const FR = new FileReader();

    FR.addEventListener("load", (evt) => {
       this.uploadImage = evt.target?.result as string;
    });

    FR.readAsDataURL(event.target.files[0]);
  }
}
