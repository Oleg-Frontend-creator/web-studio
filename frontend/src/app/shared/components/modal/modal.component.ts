import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserRequestService} from "../../services/user-request.service";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestTypeEnum} from "../../../../types/request-type.enum";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {
  serviceName: string | null = null;
  isRequestSuccess: boolean = false;
  errorMessage: string | null = null;
  services: string[] = [
    'Создание сайтов',
    'Продвижение',
    'Реклама',
    'Копирайтинг'
  ];
  selectedIndex: number = -1;

  requestForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-Я][а-я]*(?:\s+[А-Я][а-я]*)*$/)]],
    phone: ['', Validators.required],
  });

  constructor(public activeModal: NgbActiveModal,
              private userRequestService: UserRequestService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.selectedIndex = this.services.findIndex(service => service === this.serviceName);
  }

  sendRequestOrder() {
    if (this.requestForm.valid && this.serviceName) {
      const body = {
        name: this.requestForm.value.name as string,
        phone: this.requestForm.value.phone as string,
        service: this.serviceName,
        type: RequestTypeEnum.order
      };

      this.userRequestService.sendRequestOrder(body)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message);
            }

            this.isRequestSuccess = true;
          },
          error: () => {
            this.errorMessage = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
          }
        });
    }
  }

  sendRequestConsultation() {
    if (this.requestForm.valid) {
      const body = {
        name: this.requestForm.value.name as string,
        phone: this.requestForm.value.phone as string,
        type: RequestTypeEnum.consultation
      };

      this.userRequestService.sendRequestConsultation(body)
        .subscribe((data: DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.isRequestSuccess = true;
        });
    }
  }
}
