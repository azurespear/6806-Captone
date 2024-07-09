import { Component } from '@angular/core';
import {PostService} from "../services/post.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-my-post',
  templateUrl: './my-post.component.html',
  styleUrl: './my-post.component.css'
})
export class MyPostComponent {
  posts: any = []
  userId: number = -1

  constructor(private postService: PostService, private userService: UserService,) {

  }

  ngOnInit(): void {
    this.userService.getUserData().subscribe(
      data => {
        this.userId = data.id;
        this.getUserPosts(this.userId)
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  getUserPosts(userId: number) {
    this.postService.getPostsByUserId(userId).subscribe(res => {
      this.posts = res
    })
  }

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(() => {
      this.getUserPosts(this.userId)
    })
  }
}
