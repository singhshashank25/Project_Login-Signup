import { Component, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.services';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.services';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  userIsAuthenticated = false;
  private authStatusSubs: Subscription;

  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(
    public postsService: PostsService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });

    this.posts = this.postsService.getPosts(
      this.postsPerPage,
      this.currentPage
    );

    this.isLoading = false;

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = false;
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
    this.isLoading = false;
  }

  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
    this.authStatusSubs.unsubscribe();
  }
}
