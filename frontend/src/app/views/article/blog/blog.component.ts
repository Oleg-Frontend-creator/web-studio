import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ActiveCategoriesParamsType} from "../../../../types/active-categories-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  categories: CategoryType[] | null = null;
  activeCategories: CategoryType[] | null = null;

  articles: ArticleType[] | null = null;
  pages: number[] = [];
  activePage: number | null = null;

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((data: CategoryType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.categories = data as CategoryType[];

        this.activatedRoute.queryParams.subscribe((params) => {
          let body: ActiveCategoriesParamsType = {
            page: +params['page'] || 1
          };
          this.activePage = body.page;

          if (params['categories']) {
            body.categories = params['categories'];

            if (!this.activeCategories) {
              this.activeCategories = [];

              if (body.categories && this.categories) {
                for (let i = 0; i < body.categories.length; i++)
                  for (let j = 0; j < this.categories.length; j++) {
                    if (body.categories[i] === this.categories[j].url) {
                      this.activeCategories.push(this.categories[j]);
                    }
                  }
              }
            }
          }

          this.loadArticles(body.page);
        });
      });
  }

  loadArticles(pageNumber: number = 1) {
    this.activePage = pageNumber;
    this.pages = [];
    let params: ActiveCategoriesParamsType = {page: this.activePage};

    if (this.activeCategories) {
      let categoryUrls: string[] = [];
      this.activeCategories.forEach(category => {
        categoryUrls.push(category.url);
      });
      params.categories = categoryUrls;
    }

    this.articleService.getArticles(params)
      .subscribe((data: { count: number, pages: number, items: ArticleType[] }) => {
        if (data.items.length === 0) {
          this.activePage = data.pages;
          params.page = this.activePage;

          this.articleService.getArticles(params)
            .subscribe((data: { count: number, pages: number, items: ArticleType[] }) => {
              this.articles = data.items as ArticleType[];
            });
        } else {
          this.articles = data.items as ArticleType[];
        }

        if (data.pages > 1) {
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }
        }

        this.router.navigate([], {queryParams: params});
      });
  }

  openDropdown(dropdown: HTMLElement): void {
    dropdown.classList.contains('open') ?
      dropdown.classList.remove('open') : dropdown.classList.add('open');
  }

  chooseCategory(category: CategoryType, categoryItem: HTMLElement): void {
    if (categoryItem.classList.contains('active')) {
      categoryItem.classList.remove('active');

      if (this.activeCategories) {
        this.activeCategories = this.activeCategories?.filter(activeCategory =>
          activeCategory.url !== category.url);
      }
    } else {
      categoryItem.classList.add('active');

      if (!this.activeCategories) {
        this.activeCategories = [];
      }
      this.activeCategories.push(category);
    }

    this.loadArticles();
  }

  removeCategory(category: CategoryType): void {
    if (this.activeCategories) {
      this.activeCategories = this.activeCategories?.filter(activeCategory =>
        activeCategory.url !== category.url);
    }

    this.loadArticles();
  }

  openPage(page: number) {
    if (this.activePage) {
      this.activePage = page;
      this.loadArticles(this.activePage);
    }
  }

  openPrevPage(): void {
    if (this.activePage && this.activePage > 1) {
      this.activePage--;
      this.loadArticles(this.activePage);
    }
  }

  openNextPage(): void {
    if (this.activePage && this.activePage < this.pages.length) {
      this.activePage++;
      this.loadArticles(this.activePage);
    }
  }
}
