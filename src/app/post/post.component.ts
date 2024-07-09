import {Component, OnInit} from '@angular/core';
import {ImageService} from "../services/image.service";
import {throwError} from "rxjs";
import {PostService} from "../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  id = ""
  title = ""
  sex = ""
  species = ""
  postType = ""
  content = ""
  email = ""
  imageURL = ""
  address = ""
  lostDate = ""

  constructor(
    private imageService: ImageService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.postType = params['type'];
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit(): void {
    this.postService.getPostById(Number(this.id)).subscribe(res => {
      this.title = res.title
      this.sex = res.sex
      this.species = res.species
      this.content = res.content
      this.email = res.email
      this.imageURL = res.imageURL
      this.address = res.address
      this.lostDate = res.lostDate
    })
  }

  imageChange(event: any) {
    if (!event.target.files || !event.target.files[0]) return;

    const formData = new FormData();
    formData.append("image", event.target.files[0])

    this.imageService.uploadImage(formData).subscribe(
      response => {
        this.imageURL = response
      },
      error => {
        console.error('Upload image error:', error);
        return throwError(error);
      }
    );
  }

  publish() {
    if (this.title && this.sex && this.species && this.postType && this.content && this.email && this.imageURL) {
      if (this.id) {
        this.postService.updatePost(Number(this.id), this.title, this.sex, this.species, this.postType, this.content, this.email, this.imageURL, this.address, this.lostDate).subscribe(() => {
          this.router.navigate(['/forum'])
        })
      } else {
        this.postService.publishPost(this.title, this.sex, this.species, this.postType, this.content, this.email, this.imageURL, this.address, this.lostDate).subscribe(() => {
          this.router.navigate(['/forum'])
        })
      }
    }
  }
}
