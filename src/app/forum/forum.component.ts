import {Component, OnInit} from '@angular/core';
import {PostService} from "../services/post.service";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements OnInit {
  name = ""
  sex = ""
  postType = ""
  datetime = ""
  species = ""

  data: any = { content: [] }
  posts: any = []

  constructor(private postService: PostService,) {

  }

  ngOnInit(): void {
    this.getAllPost()
  }

  getAllPost() {
    this.postService.getAllPosts().subscribe(res => {
      this.data = res
      this.posts = res.content
      console.log(this.posts)
    })
  }

  search() {
    let posts = this.data.content
    if (this.name) {
      posts = posts.filter((item: any) => item.title && item.title.toLowerCase().includes(this.name.toLowerCase()))
    }
    if (this.sex) {
      posts = posts.filter((item: any) => item.sex && item.sex.toLowerCase().includes(this.sex.toLowerCase()))
    }
    if (this.species) {
      posts = posts.filter((item: any) => item.species && item.species.toLowerCase().includes(this.species.toLowerCase()))
    }
    if (this.datetime) {
      posts = posts.filter((item: any) => item.createTime && (Date.now() - new Date(item.createTime).getTime()) < 1000 * 60 * 60 * 24 * 30 * Number(this.datetime))
    }
    if (this.postType) {
      posts = posts.filter((item: any) => item.postType && item.postType.toLowerCase().includes(this.postType.toLowerCase()))
    }
    this.posts = posts;
  }

  reset() {
    this.name = ""
    this.sex = ""
    this.postType = ""
    this.datetime = ""
    this.species = ""
    this.search();
  }
}
