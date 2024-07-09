import { Component } from '@angular/core';
import {PostService} from "../services/post.service";
import {ActivatedRoute} from "@angular/router";
import {CommentService} from "../services/comment.service";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {

  data: any = null
  content = ""
  postId: number = 0
  comments: any = []

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.postId = Number(params['id'])
       this.getPostById();
       this.getComments();
       setInterval(() => {
         this.getComments();
       }, 1000)
    });
  }

  getPostById() {
    this.postService.getPostById(this.postId).subscribe(res => {
      this.data = res
    })
  }

  submitComment() {
    if (this.content) {
      this.commentService.addCommentToPost(this.postId, this.content).subscribe(() => {
        this.content = "";
        this.getComments();
      })
    }
  }

  getComments() {
    this.commentService.getCommentsFromPost(this.postId).subscribe(res => {
      this.comments = res
    })
  }
}
