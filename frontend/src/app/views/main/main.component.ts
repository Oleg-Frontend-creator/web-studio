import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleType} from "../../../types/article.type";
import {ArticleService} from "../../shared/services/article.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalComponent} from "../../shared/components/modal/modal.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  commonOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    nav: true,
    navText: ['', ''],
    autoplay: true,
    autoplayHoverPause: true
  };
  heroOptions: OwlOptions = {
    ...this.commonOwlOptions,
    items: 1,
    autoplayTimeout: 15000
  }
  reviewsOptions: OwlOptions = {
    ...this.commonOwlOptions,
    items: 3,
    autoplayTimeout: 5000,
    margin: 25
  };

  heroSlides = [
    {
      subtitle: 'Предложение месяца',
      title: `Продвижение в Instagram для вашего бизнеса <span class="special">-15%</span>!`,
      imagePath: 'assets/images/main/offer-carousel/1.png',
      serviceName: 'Реклама'
    },
    {
      subtitle: 'Акция',
      title: `Нужен грамотный <span class="special">копирайтер</span>?`,
      offerText: 'Весь декабрь у нас действует акция на работу копирайтера.',
      imagePath: 'assets/images/main/offer-carousel/2.png',
      serviceName: 'Копирайтинг'
    },
    {
      subtitle: 'Новость дня',
      title: `<span class="special">6 место</span> в ТОП-10 SMM-агенств Москвы!`,
      offerText: 'Мы благодарим каждого, кто голосовал за нас!',
      imagePath: 'assets/images/main/offer-carousel/3.png',
      serviceName: 'Продвижение'
    }
  ];
  reviewSlides = [
    {
      imagePath: 'assets/images/main/reviews/1.png',
      name: 'Станислав',
      reviewText: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! ' +
        'Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      imagePath: 'assets/images/main/reviews/2.png',
      name: 'Алёна',
      reviewText: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно ' +
        'вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      imagePath: 'assets/images/main/reviews/3.png',
      name: 'Мария',
      reviewText: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы ' +
        'по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    }, {
      imagePath: 'assets/images/main/reviews/4.png',
      name: 'Артём',
      reviewText:
        'Нашёл блог Айтишторм совершенно случайно, но теперь читаю каждый день! ' +
        'Статьи действительно помогают развиваться и структурировать знания в IT. Спасибо за труд!'
    },
    {
      imagePath: 'assets/images/main/reviews/5.png',
      name: 'Иван',
      reviewText:
        'Очень нравится подача материалов. Всё просто, понятно и по делу! ' +
        'Айтишторм помогает мне уверенно двигаться в своей новой профессии.'
    },
    {
      imagePath: 'assets/images/main/reviews/6.png',
      name: 'Илья',
      reviewText:
        'Редко встречаются такие искренние блоги. Чувствуется, что ребята любят свою работу ' +
        'и хотят передать эти знания другим. Продолжайте в том же духе!'
    },
    {
      imagePath: 'assets/images/main/reviews/7.png',
      name: 'Владислав',
      reviewText:
        'Мне особенно импонируют статьи о саморазвитии и карьерном росте. ' +
        'Материал настолько мотивирует, что после чтения хочется сразу идти и работать над собой!'
    },
    {
      imagePath: 'assets/images/main/reviews/8.png',
      name: 'Василиса',
      reviewText:
        'Подписалась недавно, но уже перечитала кучу статей. ' +
        'Айтишторм помогает выбрать направление в IT и понять, что подходит именно тебе.'
    },
    {
      imagePath: 'assets/images/main/reviews/9.png',
      name: 'Валерий',
      reviewText:
        'Спасибо за рубрику с полезными советами! Многое уже применил на практике. ' +
        'Чувствую, что становлюсь увереннее в своих навыках.'
    },
    {
      imagePath: 'assets/images/main/reviews/10.png',
      name: 'Виктория',
      reviewText:
        'Приятно удивлена качеством контента. Не ожидала, что блог окажется настолько полезным. ' +
        'Особенно ценю материалы, которые помогают систематизировать знания.'
    }
  ];

  popularArticles: ArticleType[] = [];

  constructor(private articleService: ArticleService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe((data: ArticleType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.popularArticles = data as ArticleType[];
      });
  }

  openModal(serviceName: string) {
    const modalRef = this.modalService.open(ModalComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.serviceName = serviceName;
  }
}
